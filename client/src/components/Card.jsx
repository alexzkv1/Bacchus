import { useState } from 'react';

export default function Card({ auctions }) {
  const [username, setUsername] = useState('');
  const [bidAmount, setBidAmount] = useState(0);

  const handleClick = async (e, auctionID) => {
    e.preventDefault();
    const auctionIDBD = auctionID;
    const usernameBD = username;
    const bidAmountBD = Number(bidAmount);
  
    const bidData = {
      usernameBD,
      auctionIDBD,
      bidAmountBD,
    };
  
    try {
      const response = await fetch('http://localhost:5000/place-bid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bidData)
      });
      console.log(bidData);
  
      if (response.ok) {
        alert('Bid submitted successfully!');
      } else {
        alert('Error submitting bid.');
      }
    } catch (error) {
      console.error('Error submitting bid:', error);
      alert('Error submitting bid.');
    }
  };
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
      {auctions.map((auction) => (
        <div className="card bg-base-200 shadow-2xl" key={auction.productId} id={auction.productId}>
          <div className="card-body">
            <h2 className="card-title">{auction.productName}</h2>
            <p>{auction.productDescription}</p>
            <div className="card-actions place-content-center">
            <button className="btn btn-primary" onClick={() => document.getElementById('modal').showModal()}>
              Place a bid
            </button>
<dialog id='modal' className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Place a bid</h3>
    <div className="grid grid-cols-2 gap-4">
      <input
        type="number"
        placeholder="Enter your bid"
        className="input input-bordered input-warning max-w-xs mt-5"
        value={bidAmount}
        onChange={(e) => setBidAmount((e.target.value))}
      />
      <input
        type="text"
        placeholder="Enter your name"
        className="input input-bordered input-warning max-w-xs mt-5"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
    </div>
    <button className="btn btn-primary mt-5 w-5/12" onClick={(e) => handleClick(e, auction.productId)}>
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
