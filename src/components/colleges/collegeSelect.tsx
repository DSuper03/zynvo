"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

interface CollegeSearchSelectProps {
  colleges: { name: string; clubs: string[]; }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function CollegeSearchSelect({
  colleges,
  value,
  onChange,
  placeholder = "Select your college/university",
  required = false
}: CollegeSearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter colleges based on search term
  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredColleges.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredColleges.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredColleges.length) {
          handleSelect(filteredColleges[highlightedIndex].name);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSelect = (college: string) => {
    onChange(college);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleInputClick = () => {
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Display Input */}
      <div 
        className="bg-gray-800 text-white w-full py-3 px-10 rounded-lg focus-within:ring-2 focus-within:ring-yellow-500 cursor-pointer relative"
        onClick={handleInputClick}
      >
        <FiSearch className="text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : value}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent text-white w-full outline-none cursor-pointer"
          placeholder={value || placeholder}
          readOnly={!isOpen}
          required={required}
        />
        <FiChevronDown 
          className={`text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredColleges.length > 0 ? (
            filteredColleges.map((college, index) => (
              <div
                key={index}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  index === highlightedIndex
                    ? 'bg-yellow-500 text-black'
                    : 'text-white hover:bg-gray-700'
                }`}
                onClick={() => handleSelect(college.name)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {college.name}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-400">
              No colleges found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}