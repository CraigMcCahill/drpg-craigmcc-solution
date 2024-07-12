import { renderHook, waitFor } from '@testing-library/react';
import useUsers from './useUsers';

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
        } else if (url.includes('page=2')) {
          return Promise.resolve(mockUserDataPage2);
        }
      },
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.clearAllMocks();
});

test('useUsers handles loading state', async () => {
  const { result } = renderHook(() => useUsers(1, ''));

  expect(result.current.loading).toBe(true);

  await waitFor(() => expect(result.current.loading).toBe(false));
});

test('useUsers fetches data successfully', async () => {
  const { result } = renderHook(() => useUsers(1, ''));

  await waitFor(() => expect(result.current.filteredData).toEqual(mockUserDataPage1.data));
  await waitFor(() => expect(result.current.totalPages).toEqual(mockUserDataPage1.total_pages));
  await waitFor(() => expect(result.current.loading).toBe(false));
  await waitFor(() => expect(result.current.error).toBe(null));
});

test('useUsers handles error state', async () => {
  (global.fetch as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      ok: false,
      statusText: 'Internal Server Error',
    })
  );

  const { result } = renderHook(() => useUsers(1, ''));

  await waitFor(() => expect(result.current.error).toEqual(new Error('Error: Internal Server Error')));
  await waitFor(() => expect(result.current.loading).toBe(false));
  await waitFor(() => expect(result.current.filteredData).toEqual([]));
  await waitFor(() => expect(result.current.totalPages).toEqual(1));
});

test('useUsers filters data based on search query', async () => {
  const { result } = renderHook(() => useUsers(1, 'craig'));

  await waitFor(() => expect(result.current.filteredData).toEqual([mockUserDataPage1.data[0]]));
  await waitFor(() => expect(result.current.totalPages).toEqual(mockUserDataPage1.total_pages));
  await waitFor(() => expect(result.current.loading).toBe(false));
  await waitFor(() => expect(result.current.error).toBe(null));
});

test('useUsers updates data on page change', async () => {
  const { result, rerender } = renderHook(({ page, query }) => useUsers(page, query), {
    initialProps: { page: 1, query: '' },
  });

  await waitFor(() => expect(result.current.filteredData).toEqual(mockUserDataPage1.data));

  rerender({ page: 2, query: '' });

  await waitFor(() => expect(result.current.filteredData).toEqual(mockUserDataPage2.data));
});

export {};
