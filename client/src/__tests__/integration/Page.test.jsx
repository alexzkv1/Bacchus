import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../Page';
import '@testing-library/jest-dom';

describe('Bid Flow Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        HTMLDialogElement.prototype.showModal = jest.fn();
        HTMLDialogElement.prototype.close = jest.fn();
      });

    test('successful bid updates auction list', async () => {
        global.fetch = jest.fn((url) => {
          if (url.includes('/data')) {
            return Promise.resolve({
              json: () => Promise.resolve([{ productId: '1', productName: 'Test Product', highestBid: 100 }]),
            });
          }
          if (url.includes('/place-bid')) {
            return Promise.resolve({ ok: true });
          }
        });
        

        render(<App />);
        
        await waitFor(() => expect(screen.getByText('Test Product')).toBeInTheDocument());
      
        const bidButton = await screen.findByRole('button', { name: /Place a bid/i });
        fireEvent.click(bidButton);
      
        fireEvent.change(screen.getByPlaceholderText('Enter your bid'), { target: { value: '150' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'JohnDoe' } });
        fireEvent.click(screen.getByText('Submit'));
      
        const highestBidText = await screen.findByText((content, element) => {
          return content.includes('Highest Bid:') && element.tagName === 'P';
        });
        expect(highestBidText).toBeInTheDocument();
      });

      test('displays loading state while fetching data', async () => {
        global.fetch = jest.fn(() => {
          return new Promise((resolve) => setTimeout(() => resolve({ json: () => Promise.resolve([]) }), 2000));
        });
      
        render(<App />);
      
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
      
        await waitFor(
            () => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument(),
            { timeout: 3000 } 
          );
      });
    });       
