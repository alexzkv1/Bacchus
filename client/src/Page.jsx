import { useEffect, useState } from 'react';
import './Page.css';
import Card from './components/Card';
import DropDown from './components/dropDown';

function App() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setErrror] = useState();
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [categories, setCategories] = useState([]);


  useEffect(() =>{
    
    const fetchPosts = async () => {
      try{
        setLoading(true);
        const response = await fetch(`${BASE_URL}/data`);
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


  useEffect(() => {
    const categoriesDb = [...new Set(auctions.map(auction => auction.productCategory))];
    setCategories(['All', ...categoriesDb]);
    setFilteredAuctions(auctions);
  }, [auctions]);

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

  const filterAuctions = (e) => {
    const category = e.target.closest('li').id;
    const filtered = category === "All" 
      ? auctions 
      : auctions.filter((auction) => auction.productCategory === category);
  
    console.log(filtered);
    setFilteredAuctions(filtered);
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
    <div className='flex  justify-start'>
    <DropDown categories={categories} filterAuctions={filterAuctions} />
    </div>
  <div className="flex items-center justify-center">
    <p className="text-5xl font-bold text-center tracking-wide drop-shadow-lg shadow-sm">
      Bacchus Auctions
    </p>
  </div>

  <Card auctions={filteredAuctions} updateAuction={updateAuction} />
</div>

  );
}

export default App;
