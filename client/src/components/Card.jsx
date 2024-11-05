import { useEffect, useState } from 'react';

export default function Card({ auctions, updateAuction }) {
  const [username, setUsername] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [auctionID, setAuctionID] = useState('');
  const [submiting, setSubmiting] = useState(false);


  const handleClick = (e) => {
    e.preventDefault();
    setSubmiting(true); 
  };


  useEffect(() => {
    const submitBid = async () => {
      if (!submiting) return; 
      
      const bidData = {
        usernameBD: username,
        auctionIDB: auctionID,
        bidAmountBD: bidAmount,
      };

      try {
        const response = await fetch('http://localhost:5000/place-bid', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bidData),
        });

        console.log(bidData);

        if (response.ok) {
          setUsername('');
          setBidAmount(0);
          setAuctionID('');
          document.getElementById('modal').close();
          const updatedAuction = { ...auctions.find(a => a.productId === auctionID), highestBid: bidAmount };
          updateAuction(updatedAuction);
        } else {
          document.getElementById('modal').close();
          setUsername('');
          setBidAmount(0);
          setAuctionID('');
        }
      } catch (error) {
        console.error('Error submitting bid:', error);
      } finally {
        setSubmiting(false); 
      }
    };

    submitBid();
  }, [submiting, auctionID, username, bidAmount]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
      {auctions.map((auction) => (
        <div className="card bg-base-200 shadow-2xl" key={auction.productId} id={auction.productId}>
          <div className="card-body">
            <h2 className="card-title justify-center">{auction.productName}</h2>
            <p>{auction.productDescription}</p>
            <p>Category: {auction.productCategory}</p>  
            <p>Highest Bid:  {auction.highestBid}</p>
            <div className="card-actions place-content-center">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setAuctionID(auction.productId);
                  document.getElementById('modal').showModal(); 
                }}
              >
                Place a bid
              </button>
              <dialog id="modal" className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Place a bid</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      id="bid-input"
                      type="number"
                      placeholder="Enter your bid"
                      className="input input-bordered input-warning max-w-xs mt-5"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="input input-bordered input-warning max-w-xs mt-5"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-primary mt-5 w-5/12" onClick={handleClick}>
                    Submit
                  </button>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button></button>
                </form>
              </dialog>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}