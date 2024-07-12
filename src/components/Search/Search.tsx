import React, { useState, useEffect, useCallback } from 'react';
import useDebounce from '../../hooks/useDebounce/useDebounce';

interface SearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

function Search({ searchQuery, onSearchChange }: SearchProps) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const debouncedSearchQuery = useDebounce(inputValue, 500);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  useEffect(() => {
    onSearchChange(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearchChange]);

  return (
    <div>
      <label htmlFor="search">Search:</label>
      <input
        type="search"
        id="search"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search by last name, or email"
        aria-label="Search by last name or email"
      />
    </div>
  );
}

export default Search;
