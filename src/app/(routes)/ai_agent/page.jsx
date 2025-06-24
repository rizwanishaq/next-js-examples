'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import Vapi from '@vapi-ai/web';
import { Mic, MicOff } from 'lucide-react';

const MedicalVoiceAgent = () => {
  const { sessionId } = useParams();
  const [callStarted, setCallStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const vapiRef = useRef(null);

  useEffect(() => {
    vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
    const vapi = vapiRef.current;

    vapi.on('call-start', () => {
      console.log('Call started');
      setCallStarted(true);
      setLoading(false);
    });

    vapi.on('call-end', () => {
      console.log('Call ended');
      setCallStarted(false);
      setLoading(false);
    });

    vapi.on('message', (message) => {
      if (message.type === 'transcript') {
        console.log(`${message.role}: ${message.transcript}`);
      }
    });

    return () => {
      vapi.removeAllListeners();
    };
  }, []);

  const handleCall = () => {
    if (!vapiRef.current) return;

    setLoading(true);

    if (callStarted) {
      vapiRef.current.stop();
    } else {
      vapiRef.current.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID || '');
    }
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center px-4 bg-gray-50">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Voice Consultation</h1>
        <p className="text-gray-500 text-sm">
          Session ID: <span className="font-mono">{sessionId}</span>
        </p>
        <p className={`mt-2 text-sm font-semibold ${callStarted ? 'text-green-600' : 'text-red-500'}`}>
          {callStarted ? 'Connected' : 'Disconnected'}
        </p>
      </div>

      {callStarted && (
        <div className="mb-6">
          <div className="animate-ping-slow rounded-full h-20 w-20 bg-green-400 opacity-75 flex items-center justify-center">
            <Mic className="text-white h-8 w-8" />
          </div>
        </div>
      )}

      <Button
        onClick={handleCall}
        disabled={loading}
        className={`w-64 text-lg transition-colors duration-300 ${
          callStarted ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading
          ? 'Connecting...'
          : callStarted
          ? 'End Call'
          : 'Start Call'}
      </Button>
    </div>
  );
};

export default MedicalVoiceAgent;
