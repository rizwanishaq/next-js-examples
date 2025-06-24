'use client';

import React, { useState } from 'react';
import { doctorList } from './doctorList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from '@/components/ui/select';
import { StarIcon } from 'lucide-react';

const DoctorList = () => {
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const specialties = ['All', ...new Set(doctorList.map((doc) => doc.specialty))];

  const filteredDoctors = doctorList.filter((doc) => {
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Find a Doctor</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/2"
        />

        <Select value={selectedSpecialty} onValueChange={(value) => setSelectedSpecialty(value)}>
          <SelectTrigger className="md:w-1/2">
            <SelectValue placeholder="Filter by Specialty" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((spec) => (
              <SelectItem key={spec} value={spec}>
                {spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredDoctors.length === 0 ? (
        <p className="text-gray-500">No doctors found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className="border rounded-xl p-4 shadow hover:shadow-md transition">
              <img
                src={doc.image}
                alt={doc.name}
                className="w-20 h-20 rounded-full object-cover mb-3"
              />
              <h3 className="text-lg font-semibold">{doc.name}</h3>
              <p className="text-sm text-gray-600">{doc.specialty}</p>
              <p className="text-sm text-gray-500">{doc.location}</p>
              <p className="text-sm mt-2">{doc.description}</p>

              {/* Likes + Rating */}
              <div className="flex items-center text-sm text-gray-400 mt-2 gap-2">
                👍 {doc.likes} likes
                <StarIcon size={14} className="ml-2 text-yellow-500" />
                {doc.rating ? doc.rating.toFixed(1) : '4.5'} / 5.0
              </div>

              {/* Fee + Language */}
              <p className="text-sm text-gray-500 mt-1">Fee: AED {doc.consultationFee || 200}</p>
              <p className="text-xs text-gray-400">
                {doc.languages ? `Languages: ${doc.languages.join(', ')}` : ''}
              </p>

              {/* Availability */}
              <span
                className={`inline-block mt-3 text-xs font-medium px-2 py-1 rounded-full ${
                  doc.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {doc.available ? 'Available' : 'Unavailable'}
              </span>

              {/* Book Button */}
              {doc.available && (
                <Button className="mt-4 w-full" variant="secondary">
                  Book Consultation
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;
