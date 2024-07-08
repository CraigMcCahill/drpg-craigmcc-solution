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
