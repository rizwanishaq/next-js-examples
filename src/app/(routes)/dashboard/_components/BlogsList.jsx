
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Newspaper } from 'lucide-react';

const blogs = [
  {
    slug: 'blog-1',
    name: 'The Rise of AI',
    description: 'Exploring the rapid advancements in artificial intelligence.',
  },
  {
    slug: 'blog-2',
    name: 'Audio Denoising with NNs',
    description: 'A deep dive into neural networks for audio processing.',
  },
  {
    slug: 'blog-3',
    name: 'The Future of VAD',
    description: 'Trends and predictions for voice activity detection technology.',
  },
];

const BlogsList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <Link key={blog.slug} href={`/blogs/${blog.slug}`}>
          <Card className="group cursor-pointer overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/50">
              <CardTitle className="text-lg font-semibold">{blog.name}</CardTitle>
              <div className="bg-gradient-to-r from-primary to-purple-600 p-2 rounded-lg">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4">{blog.description}</p>
              <div className="flex items-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 font-semibold">
                Read More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default BlogsList;
