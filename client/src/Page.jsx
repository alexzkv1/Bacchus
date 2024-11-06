import { useEffect, useState } from 'react';
import './Page.css';
import Card from './components/Card';
import DropDown from './components/dropDown';

function App() {
  const url = 'http://uptime-auction-api.azurewebsites.net/api/Auction';
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setErrror] = useState();
  const [categories, setCategories] = useState([]);


  useEffect(() =>{
    const fetchPosts = async () => {
      try{
        setLoading(true);
        const response = await fetch('http://localhost:5000/data');
        const auctionData = await response.json();
        setAuctions(auctionData)
      } catch(err){
        setErrror(err);
      } finally{
        setLoading(false);
      }
    }
    fetchPosts();
  },[]);

  const updateAuction = (updatedAuction) => {
    setAuctions((prevAuctions) => {
      const existingAuction = prevAuctions.find(
        (auction) => auction.productId === updatedAuction.productId
      );
  
      if (updatedAuction.highestBid <= existingAuction.highestBid) {
        return prevAuctions; 
      }

      return prevAuctions.map((auction) =>
        auction.productId === updatedAuction.productId ? updatedAuction : auction
      );
    });
  };


  if(loading){
    return (<div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <p className="text-5xl font-bold">Wait a second!</p>
          <h2 className="py-6">
            Loading    <span className="loading loading-spinner loading-md"></span>
          </h2>
        </div>
      </div>
    </div>);
  }

  if(error){
    return (<div className="hero bg-base-200 min-h-screen">
    <div className="hero-content text-center">
      <div className="max-w-md">
        <h1 className="text-5xl font-bold">Oops....</h1>
        <p className="py-6">
          Something went wrong!
        </p>
      </div>
    </div>
  </div>)
  }

  return (
    <div className="App">
      <DropDown auctions={auctions} />
      <p className="text-5xl font-bold mt-5 text-center  tracking-wide shadow-lg drop-shadow-md">
      Bacchus Auctions
    </p>

      <Card auctions={auctions} updateAuction={updateAuction} />
    </div>
  );
}

export default App;
