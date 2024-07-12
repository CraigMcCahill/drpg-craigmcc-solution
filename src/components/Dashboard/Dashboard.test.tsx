import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dashboard from './Dashboard';

jest.mock('../../constants', () => ({
  API_URL: 'https://mock-api.com/users',
}));

const mockUserDataPage1 = {
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
  ],
};

const mockUserDataPage2 = {
  page: 2,
  per_page: 1,
  total: 2,
  total_pages: 2,
  data: [
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
  global.fetch = jest.fn((url) =>
    Promise.resolve({
      ok: true,
      json: () => {
        if (url.includes('page=1')) {
          return Promise.resolve(mockUserDataPage1);
        }
        if (url.includes('page=2')) {
          return Promise.resolve(mockUserDataPage2);
        }
        return Promise.resolve(mockUserDataPage1);
      },
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

