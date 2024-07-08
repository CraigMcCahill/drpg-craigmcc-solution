import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import Modal from 'react-modal';
import { API_URL } from '../constants';
import UpdateUser from './UpdateUser';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface Users {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: Array<User>;
}

function Dashboard() {
  const [data, setData] = useState<Array<User>>([]);
  const [filteredData, setFilteredData] = useState<Array<User>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}?page=${currentPage}`);
        if (!response.ok) {
          throw new Error('Unable to connect to API');
        }
        const result: Users = await response.json();
        setData(result.data);
        setFilteredData(result.data);
        setTotalPages(result.total_pages);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const filtered = data.filter((user) =>
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

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
      {
        name: 'Action',
        cell: (row: User) => (
          <button onClick={() => editUser(row)}>
            Edit Details
          </button>
        ),
				ignoreRowClick: true,
			},
    ],
    [],
  );

  const editUser = (row: User) => {
    setModalIsOpen(true);
    setUserToEdit(row);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by last name, or email"
      />
      <DataTable
        title="Users"
        data={filteredData}
        columns={columns}
      />
      <div>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <Modal
        contentLabel="Update User Details"
        isOpen={modalIsOpen}
      >
        <h2>Edit Details</h2>
        <button onClick={closeModal}>close</button>
        {userToEdit && <UpdateUser user={userToEdit} />}
      </Modal>
    </div>
  );
}

export default Dashboard;
