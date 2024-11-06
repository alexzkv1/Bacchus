// src/__tests__/unit/DropDown.test.js

import { render, screen, fireEvent } from '@testing-library/react';
import DropDown from '../../components/dropDown';
import '@testing-library/jest-dom';

describe('DropDown Component', () => {
  const mockFilterAuctions = jest.fn();
  const categories = ['All', 'Electronics', 'Books'];

  test('renders categories correctly', () => {
    render(<DropDown categories={categories} filterAuctions={mockFilterAuctions} />);

    categories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  test('calls filterAuctions on category click', () => {
    render(<DropDown categories={categories} filterAuctions={mockFilterAuctions} />);

    fireEvent.click(screen.getByText('Electronics'));
    expect(mockFilterAuctions).toHaveBeenCalled();
  });
});
