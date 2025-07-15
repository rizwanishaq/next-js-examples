
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Newspaper } from 'lucide-react';

const blogs = [
  {
    slug: 'blog-1',
    name: 'The Rise of AI',
    description: 'Exploring the rapid advancements in artificial intelligence.',
    color: 'bg-red-500',
    textColor: 'text-red-600',
  },
  {
    slug: 'blog-2',
    name: 'Audio Denoising with NNs',
    description: 'A deep dive into neural networks for audio processing.',
    color: 'bg-lime-500',
    textColor: 'text-lime-600',
  },
  {
    slug: 'blog-3',
    name: 'The Future of VAD',
    description: 'Trends and predictions for voice activity detection technology.',
    color: 'bg-cyan-500',
    textColor: 'text-cyan-600',
  },
];

const BlogsList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <Link key={blog.slug} href={`/blogs/${blog.slug}`} passHref>
          <div className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-slate-100 hover:border-slate-200 relative overflow-hidden">
            <Card className="bg-transparent shadow-none border-none h-full flex flex-col p-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg font-bold text-slate-800">{blog.name}</CardTitle>
                <div className={`p-2.5 rounded-full ${blog.color} shadow-md`}>
                  <Newspaper className="w-6 h-6 text-white" />
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-slate-500 h-12">{blog.description}</p>
              </CardContent>
              <div className="pt-0">
                <div className={`flex items-center font-semibold text-sm ${blog.textColor}`}>
                  Read More
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Card>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-current rounded-xl transition-all duration-300 pointer-events-none" style={{ borderColor: blog.textColor.replace('text-', '') }}></div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BlogsList;
