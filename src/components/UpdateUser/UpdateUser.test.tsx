import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UpdateUser from './UpdateUser';

jest.mock('../../constants', () => ({
  API_URL: 'https://mock-api.com/users',
}));

const mockUser = {
  id: 1,
  email: 'john.doe@example.com',
  first_name: 'John',
  last_name: 'Doe',
  avatar: 'https://example.com/avatar.jpg',
};

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders the form with user data', () => {
  render(<UpdateUser user={mockUser} />);

  expect(screen.getByLabelText('First Name:')).toHaveValue('John');
  expect(screen.getByLabelText('Last Name:')).toHaveValue('Doe');
  expect(screen.getByLabelText('Email:')).toHaveValue('john.doe@example.com');
});

test('handles form input changes', () => {
  render(<UpdateUser user={mockUser} />);

  fireEvent.change(screen.getByLabelText('First Name:'), { target: { value: 'Jane' } });
  fireEvent.change(screen.getByLabelText('Last Name:'), { target: { value: 'Smith' } });
  fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'jane.smith@example.com' } });

  expect(screen.getByLabelText('First Name:')).toHaveValue('Jane');
  expect(screen.getByLabelText('Last Name:')).toHaveValue('Smith');
  expect(screen.getByLabelText('Email:')).toHaveValue('jane.smith@example.com');
});

test('submits the form successfully', async () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockUser),
  });

  await act(async () => {
    render(<UpdateUser user={mockUser} />);
  });

  fireEvent.change(screen.getByLabelText('First Name:'), { target: { value: 'Jane' } });
  fireEvent.change(screen.getByLabelText('Last Name:'), { target: { value: 'Smith' } });
  fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'jane.smith@example.com' } });

  await act(async () => {
    fireEvent.submit(screen.getByRole('button', { name: /Update User/i }));
  });

  expect(global.fetch).toHaveBeenCalledWith(
    'https://mock-api.com/users/1',
    expect.objectContaining({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...mockUser,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
      }),
    })
  );

  expect(screen.getByRole('button', { name: /Update User/i })).not.toBeDisabled();
});

test('handles form submission error', async () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: false,
  });

  render(<UpdateUser user={mockUser} />);

  fireEvent.change(screen.getByLabelText('First Name:'), { target: { value: 'Jane' } });

  await act(async () => {
    fireEvent.submit(screen.getByRole('button', { name: /Update User/i }));
  });

  await waitFor(() => {
    expect(screen.getByText('Error: Failed to update user')).toBeInTheDocument();
  });
});
