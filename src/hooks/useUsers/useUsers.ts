import { useState, useEffect } from 'react';
import { User, Users } from '../../types/user';
import useFetch from '../useFetch/useFetch';
import { API_URL } from '../../constants';

const useUsers = (currentPage: number, searchQuery: string) => {
  const [filteredData, setFilteredData] = useState<Array<User>>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { data, loading, error } = useFetch<Users>(`${API_URL}?page=${currentPage}`);

  useEffect(() => {
    if (data && data.total_pages && data.data) {
      setTotalPages(data.total_pages);
      setFilteredData(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (data?.data) {
      const users = data.data;
      const filtered = users.filter((user) =>
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, data]);

  return { filteredData, totalPages, loading, error };
};

export default useUsers;
