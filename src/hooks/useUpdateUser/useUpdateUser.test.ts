import { renderHook, act } from '@testing-library/react';

import useUpdateUser from './useUpdateUser';
import { API_URL } from '../../constants';
import { User } from '../../types/user';


const mockUser: User = {
  id: 1,
  email: 'john.doe@example.com',
  first_name: 'John',
  last_name: 'Doe',
  avatar: 'https://example.com/avatar.jpg',
};

const updatedUser: User = {
  id: 1,
  email: 'jane.doe@example.com',
  first_name: 'Jane',
  last_name: 'Doe',
  avatar: 'https://example.com/avatar2.jpg',
};

beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (options.method === 'PUT') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(updatedUser),
      });
    }
    return Promise.reject(new Error('Invalid request'));
  }) as jest.Mock;
});

afterEach(() => {
  jest.clearAllMocks();
});

test('should initialize with given user data', () => {
  const { result } = renderHook(() => useUpdateUser(mockUser));

  expect(result.current.formData).toEqual(mockUser);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBe(null);
  expect(result.current.success).toBe(false);
});

test('should update formData on handleChange', () => {
  const { result } = renderHook(() => useUpdateUser(mockUser));

  act(() => {
    result.current.handleChange({
      target: { name: 'first_name', value: 'Jane' },
    } as React.ChangeEvent<HTMLInputElement>);
  });

  expect(result.current.formData.first_name).toBe('Jane');
});

test('should handle submit successfully', async () => {
  const { result } = renderHook(() => useUpdateUser(mockUser));

  await act(async () => {
    await result.current.handleSubmit({
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>);
  });

  expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/${mockUser.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(result.current.formData),
  });
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBe(null);
  expect(result.current.success).toBe(true);
});

test('should handle submit error', async () => {
  (global.fetch as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      ok: false,
      statusText: 'Internal Server Error',
    })
  );

  const { result } = renderHook(() => useUpdateUser(mockUser));

  await act(async () => {
    await result.current.handleSubmit({
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>);
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBe('Failed to update user');
  expect(result.current.success).toBe(false);
});
