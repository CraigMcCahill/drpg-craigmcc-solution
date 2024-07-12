import { renderHook, waitFor } from '@testing-library/react';
import useFetch from './useFetch';

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

beforeEach(() => {
  global.fetch = jest.fn((url) =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockUserDataPage1),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.clearAllMocks();
});

test('useFetch handles loading state', async () => {
  const { result } = renderHook(() => useFetch('https://mock-api.com/users?page=1'));

  expect(result.current.loading).toBe(true);

  await waitFor(() => expect(result.current.loading).toBe(false));
});

test('useFetch fetches data successfully', async () => {
  const { result } = renderHook(() => useFetch('https://mock-api.com/users?page=1'));

  await waitFor(() => expect(result.current.data).toEqual(mockUserDataPage1));
  await waitFor(() => expect(result.current.loading).toBe(false));
  await waitFor(() => expect(result.current.error).toBe(null));
});

test('useFetch handles error state', async () => {
  (global.fetch as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      ok: false,
      statusText: 'Internal Server Error',
    })
  );

  const { result } = renderHook(() => useFetch('https://mock-api.com/users?page=1'));

  await waitFor(() => expect(result.current.error).toEqual(new Error('Error: Internal Server Error')));
  await waitFor(() => expect(result.current.loading).toBe(false));
  await waitFor(() => expect(result.current.data).toBe(null));
});

export {};
