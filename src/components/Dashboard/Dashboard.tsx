import React, { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import Modal from 'react-modal';
import { User } from '../../types/user';
import UpdateUser from '../UpdateUser/UpdateUser';
import useUsers from '../../hooks/useUsers/useUsers';
import Pagination from '../Pagination/Pagination';
import Search from '../Search/Search';

function Dashboard() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const { filteredData, totalPages, loading, error } = useUsers(currentPage, searchQuery);

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
      <Search searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <DataTable title="Users" data={filteredData} columns={columns} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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
