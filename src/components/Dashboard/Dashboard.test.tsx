import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dashboard from './Dashboard';

jest.mock('../../constants', () => ({
  API_URL: 'https://mock-api.com/users',
}));

const mockUserData = {
  page: 1,
  per_page: 1,
  total: 2,
  total_pages: 2,
  data: [
    {
      id: 1,
      email: 'craig.mccahill@example.com',
      first_name: 'Craig',
      last_name: 'McCahill',
      avatar: 'https://example.com/avatar.jpg',
    },
    {
      id: 2,
      email: 'jane.doe@example.com',
      first_name: 'Jane',
      last_name: 'Doe',
      avatar: 'https://example.com/avatar2.jpg',
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
  await act(async () => {
    render(<Dashboard />);
  });
  await waitFor(() => expect(screen.getByText('Users')).toBeInTheDocument());
  expect(screen.getByText('craig.mccahill@example.com')).toBeInTheDocument();
  expect(screen.getByText('Craig')).toBeInTheDocument();
  expect(screen.getByText('McCahill')).toBeInTheDocument();
});

test('handles search functionality', async () => {
  await act(async () => {
    render(<Dashboard />);
  });
  await waitFor(() => expect(screen.getByText('Users')).toBeInTheDocument());

  const searchInput = screen.getByPlaceholderText('Search by last name, or email');
  fireEvent.change(searchInput, { target: { value: 'craig' } });

  expect(screen.getByText('craig.mccahill@example.com')).toBeInTheDocument();
});

test('handles pagination', async () => {
  await act(async () => {
    render(<Dashboard />);
  });
  await waitFor(() => expect(screen.getByText('Users')).toBeInTheDocument());

  const nextButton = screen.getByText('Next');
  fireEvent.click(nextButton);

  expect(fetch).toHaveBeenCalledWith('https://mock-api.com/users?page=2');
});
