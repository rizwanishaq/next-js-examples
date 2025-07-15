
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Bot, Waves, MicVocal } from 'lucide-react';

const projectIcons = {
  ai_agent: <Bot className="w-6 h-6 text-white" />,
  denoiser: <Waves className="w-6 h-6 text-white" />,
  vad: <MicVocal className="w-6 h-6 text-white" />,
};

const projects = [
  {
    slug: 'ai_agent',
    name: 'AI Agent',
    description: 'An AI agent that can help you with your tasks.',
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
  },
  {
    slug: 'denoiser',
    name: 'Denoiser',
    description: 'A tool to remove noise from audio files.',
    color: 'bg-green-500',
    textColor: 'text-green-600',
  },
  {
    slug: 'vad',
    name: 'VAD',
    description: 'A voice activity detection tool.',
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
  },
];

const ProjectsList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link key={project.slug} href={`/projects/${project.slug}`} passHref>
          <div className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-slate-100 hover:border-slate-200 relative overflow-hidden">
            <Card className="bg-transparent shadow-none border-none h-full flex flex-col p-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg font-bold text-slate-800">{project.name}</CardTitle>
                <div className={`p-2.5 rounded-full ${project.color} shadow-md`}>
                  {projectIcons[project.slug]}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-slate-500 h-12">{project.description}</p>
              </CardContent>
              <div className="pt-0">
                <div className={`flex items-center font-semibold text-sm ${project.textColor}`}>
                  View Project
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Card>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-current rounded-xl transition-all duration-300 pointer-events-none" style={{ borderColor: project.textColor.replace('text-', '') }}></div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProjectsList;
