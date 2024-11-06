import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Card from '../../components/Card';
import '@testing-library/jest-dom';
import validator from 'validator';

// Mock the validator library functions
jest.mock('validator');

describe('Card Component', () => {
  const mockUpdateAuction = jest.fn();
  const mockAuctions = [
    {
      productId: '1',
      productName: 'Test Product',
      productDescription: 'Description of the product',
      productCategory: 'Category A',
      highestBid: '100'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    validator.isEmpty.mockImplementation((value) => !value);
    validator.isAlphanumeric.mockImplementation((value) => /^[a-z0-9]+$/i.test(value));
    validator.isFloat.mockImplementation((value, options) => {
      const num = parseFloat(value);
      return !isNaN(num) && num >= (options?.min || -Infinity);
    });
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });
  
  test('renders card correctly', () => {
    render(<Card auctions={mockAuctions} updateAuction={mockUpdateAuction} />);
    const CardElement = screen.getByText('Test Product');
    expect(CardElement).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Description of the product')).toBeInTheDocument();
    expect(screen.getByText('Category: Category A')).toBeInTheDocument();
    expect(screen.getByText('Highest Bid: 100')).toBeInTheDocument(); 
  });

  test('opens modal when "Place a bid" button is clicked', async () => {
    render(<Card auctions={mockAuctions} updateAuction={mockUpdateAuction} />);

    const placeBidButton = await screen.findByRole('button', { name: /Place a bid/i });
    fireEvent.click(placeBidButton);

    expect(screen.getByPlaceholderText(/Enter your bid/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your name/i)).toBeInTheDocument();
  });

  test('shows error message for invalid bid amount', async () => {
    render(<Card auctions={mockAuctions} updateAuction={mockUpdateAuction} />);

    const placeBidButton = await screen.findByRole('button', { name: /Place a bid/i });
    fireEvent.click(placeBidButton);
  
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: 'JohnDoe' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your bid/i), { target: { value: '-10' } });
  
    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);
  
    const errorMessage = await screen.findByText((content, element) => {
      return content.includes('Bid amount is required and must be a number greater than 0');
    });
    expect(errorMessage).toBeInTheDocument();
  });

  test('shows another error message for invalid bid amount', async () => {
    render(<Card auctions={mockAuctions} updateAuction={mockUpdateAuction} />);
  
    const placeBidButton = await screen.findByRole('button', { name: /Place a bid/i });
    fireEvent.click(placeBidButton);

    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your bid/i), { target: { value: '-10' } });
  
    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);
  
    const errorMessage = await screen.findByText((content, element) => {
      return content.includes('Username is required and must be alphanumeric');
    });
    expect(errorMessage).toBeInTheDocument();
  });

  test('submits valid bid successfully', async () => {
    render(<Card auctions={mockAuctions} updateAuction={mockUpdateAuction} />);
    const placeBidButton = await screen.findByRole('button', { name: /Place a bid/i });
    fireEvent.click(placeBidButton);

    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: 'JohnDoe' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your bid/i), { target: { value: '150' } });


    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Bid placed successfully.' }),
      })
    );

    const submitButton = await screen.findByText(/Submit/i);
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockUpdateAuction).toHaveBeenCalledWith(expect.objectContaining({ highestBid: '150' })));
  });
});
