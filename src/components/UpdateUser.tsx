import React, { useEffect, useState, useMemo } from 'react';
import Modal from 'react-modal';
import { User } from './Dashboard';

interface UpdateUserProps {
  user: User;
  isOpen: boolean;
}

function UpdateUser({ user, isOpen }: UpdateUserProps) {
  const [editUser, setEditUser] = useState<boolean>(false);

  return (
    <Modal
    contentLabel="Update User Details"
    isOpen={isOpen}
  >
    <form></form>
  </Modal>)
}

export default UpdateUser;
