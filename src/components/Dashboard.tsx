import React, { useEffect, useState, useMemo } from 'react';

import DataTable from 'react-data-table-component';

const API_URL = 'https://reqres.in/api/users';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface Users {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: Array<User>;
}

function Dashboard() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Oops something went wrong!');
        }
        const result: Users = await response.json();
        setData(result.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo(
		() => [
			{
				name: 'ID',
				selector: (row: User) => row.id,
				sortable: true,
			},
			{
				name: 'Email',
				selector: (row: User) => row.email,
				sortable: true,
			},
      {
				name: 'First Name',
				selector: (row: User) => row.first_name,
				sortable: true,
			},
			{
				name: 'Last Name',
				selector: (row: User) => row.last_name,
				sortable: true,
			},
		],
		[],
	);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
   <div>
    <DataTable 
      title="Users"
      data={data}
      columns={columns}
    />
   </div>
  );
}

export default Dashboard;
