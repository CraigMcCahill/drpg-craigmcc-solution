import React from 'react';

interface SearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

function Search ({ searchQuery, onSearchChange } : SearchProps) { 
  return (
    <div>
      <label htmlFor="search">Search:</label>
      <input
        type="search"
        id="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by last name, or email"
      />
    </div>
  );
}

export default Search;
