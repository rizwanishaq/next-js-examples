
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Bot, Waves, MicVocal } from 'lucide-react';

const projectIcons = {
  ai_agent: <Bot className="w-8 h-8 text-primary" />,
  denoiser: <Waves className="w-8 h-8 text-primary" />,
  vad: <MicVocal className="w-8 h-8 text-primary" />,
};

const projects = [
  {
    slug: 'ai_agent',
    name: 'AI Agent',
    description: 'An AI agent that can help you with your tasks.',
  },
  {
    slug: 'denoiser',
    name: 'Denoiser',
    description: 'A tool to remove noise from audio files.',
  },
  {
    slug: 'vad',
    name: 'VAD',
    description: 'A voice activity detection tool.',
  },
];

const ProjectsList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link key={project.slug} href={`/projects/${project.slug}`}>
          <Card className="group cursor-pointer overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/50">
              <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
              <div className="bg-gradient-to-r from-primary to-purple-600 p-2 rounded-lg">
                {React.cloneElement(projectIcons[project.slug], { className: "w-6 h-6 text-white" })}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
              <div className="flex items-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 font-semibold">
                View Project
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ProjectsList;
