import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dashboard from './Dashboard';
import { API_URL } from '../../constants';

jest.mock('../../constants', () => ({
  API_URL: 'https://mock-api.com/users',
}));

const mockUserData = {
  page: 1,
  per_page: 1,
  total: 1,
  total_pages: 1,
  data: [
    {
      id: 1,
      email: 'craig.mccahill@example.com',
      first_name: 'Craig',
      last_name: 'McCahill',
      avatar: 'https://example.com/avatar.jpg',
    },
  ],
};

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockUserData),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders loading state initially', () => {
  render(<Dashboard />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

test('renders user data after fetching', async () => {
  render(<Dashboard />);
  await waitFor(() => expect(screen.getByText('Users')).toBeInTheDocument());
  expect(screen.getByText('craig.mccahill@example.com')).toBeInTheDocument();
  expect(screen.getByText('Craig')).toBeInTheDocument();
  expect(screen.getByText('McCahill')).toBeInTheDocument();
});
