
import React from 'react';
import { User } from '../../types/user';
import useUpdateUser from '../../hooks/useUpdateUser/useUpdateUser';

interface UpdateUserProps {
  user: User;
}

function UpdateUser({ user }: UpdateUserProps) {
  const { formData, loading, error, success, handleChange, handleSubmit } = useUpdateUser(user);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="first_name">First Name:</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="last_name">Last Name:</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <br />
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update User'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {success && <p style={{ color: 'green' }}>User updated successfully!</p>}
    </form>
  );
};

export default UpdateUser;
