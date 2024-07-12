import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import Modal from 'react-modal';
import { API_URL } from '../../constants';
import { User, Users } from '../../types/user';
import useFetch from '../../hooks/useFetch';
import UpdateUser from '../UpdateUser/UpdateUser';

function Dashboard() {
  const [filteredData, setFilteredData] = useState<Array<User>>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

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

  const columns = useMemo(
    () => [
      {
        name: 'Avatar',
        cell: (row: User) => <img src={row.avatar} alt={row.first_name} />,
        ignoreRowClick: true,
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
    []
  );

  const editUser = (row: User) => {
    setModalIsOpen(true);
    setUserToEdit(row);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <label htmlFor="search">Search:</label>
      <input
        type="search"
        id="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by last name, or email"
      />
      <DataTable title="Users" data={filteredData} columns={columns} />
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
      <Modal contentLabel="Update User Details" isOpen={modalIsOpen}>
        <h2>Edit Details</h2>
        {userToEdit && <UpdateUser user={userToEdit} />}
        <br />
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
}

export default Dashboard;
