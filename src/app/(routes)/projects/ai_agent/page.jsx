"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import Vapi from "@vapi-ai/web";
import { Mic, PhoneOff } from "lucide-react";

const MedicalVoiceAgent = () => {
  const { sessionId } = useParams();
  const [callStarted, setCallStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const vapiRef = useRef(null);

  useEffect(() => {
    vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
    const vapi = vapiRef.current;

    vapi.on("call-start", () => {
      console.log("Call started");
      setCallStarted(true);
      setLoading(false);
    });

    vapi.on("call-end", () => {
      console.log("Call ended");
      setCallStarted(false);
      setLoading(false);
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript") {
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
      vapiRef.current.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID || "");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#F4F9F9] px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#284B63] mb-3 tracking-tight">
          Medical Voice Consultation
        </h1>
        <p className="text-[#353535] text-sm">
          Session ID:{" "}
          <span className="font-mono text-[#3C6E71]">{sessionId}</span>
        </p>
        <p
          className={`mt-3 text-base font-semibold ${
            callStarted ? "text-green-600" : "text-red-600"
          }`}
        >
          {callStarted ? "Connected" : "Disconnected"}
        </p>
      </div>

      {callStarted && (
        <div className="mb-8 relative">
          <div className="rounded-full h-24 w-24 bg-green-500 opacity-80 flex items-center justify-center animate-pulse shadow-lg shadow-green-300">
            <Mic className="text-white h-10 w-10" />
          </div>
          <span className="absolute bottom-[-28px] w-full text-center text-xs text-[#353535]">
            Listening...
          </span>
        </div>
      )}

      <Button
        onClick={handleCall}
        disabled={loading}
        className={`w-64 py-4 text-lg font-semibold rounded-full transition-all duration-300 shadow-md ${
          callStarted
            ? "bg-red-500 hover:bg-red-600"
            : "bg-[#3C6E71] hover:bg-[#2F575E]"
        }`}
      >
        {loading
          ? "Connecting..."
          : callStarted
          ? (
              <>
                <PhoneOff className="inline-block mr-2 h-5 w-5" />
                End Call
              </>
            )
          : (
              <>
                <Mic className="inline-block mr-2 h-5 w-5" />
                Start Consultation
              </>
            )}
      </Button>

      <p className="text-xs text-[#353535] mt-10 text-center max-w-xs">
        Please ensure your microphone is enabled for a smooth conversation with
        the medical voice assistant.
      </p>
    </div>
  );
};

export default MedicalVoiceAgent;
