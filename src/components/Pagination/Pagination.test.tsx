import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination Component', () => {
  const setup = (currentPage: number, totalPages: number, onPageChange = jest.fn()) => {
    render(
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    );
  };

  it('should render pagination buttons correctly', () => {
    setup(1, 5);
    
    expect(screen.getByLabelText('First Page')).toBeDisabled();
    expect(screen.getByLabelText('Previous Page')).toBeDisabled();

    expect(screen.getByLabelText('Next Page')).toBeEnabled();
    expect(screen.getByLabelText('Last Page')).toBeEnabled();

    for (let i = 1; i <= 5; i++) {
      const pageButton = screen.getByText(i.toString());
      if (i === 1) {
        expect(pageButton).toBeDisabled();
      } else {
        expect(pageButton).toBeEnabled();
      }
    }
  });

  it('should call onPageChange with the correct page number when a button is clicked', () => {
    const onPageChange = jest.fn();
    setup(1, 5, onPageChange);

    fireEvent.click(screen.getByLabelText('Next Page'));
    expect(onPageChange).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByLabelText('Last Page'));
    expect(onPageChange).toHaveBeenCalledWith(5);

    fireEvent.click(screen.getByText('3'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('should disable next and last buttons on the last page', () => {
    setup(5, 5);

    expect(screen.getByLabelText('Next Page')).toBeDisabled();
    expect(screen.getByLabelText('Last Page')).toBeDisabled();
  });

  it('should enable previous and first buttons on any page other than the first', () => {
    setup(3, 5);

    expect(screen.getByLabelText('First Page')).toBeEnabled();
    expect(screen.getByLabelText('Previous Page')).toBeEnabled();
  });
});
