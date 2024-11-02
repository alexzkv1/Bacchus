import { useEffect, useState } from 'react';
import '../Page.css';
import Card from '../components/Card'

function App() {
  const url = 'http://uptime-auction-api.azurewebsites.net/api/Auction';
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setErrror] = useState();

  useEffect(() =>{
    const fetchPosts = async () => {
      try{
        const response = await fetch('http://localhost:5000/data');
        const auctionData = await response.json();
        setAuctions(auctionData)
      } catch(err){
        setErrror(err);
      }
    }
    fetchPosts();
  },[]);

  if(loading){
    return (<div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">
            Loading...
          </p>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>);
  }

  if(error){
    return (<div className="hero bg-base-200 min-h-screen">
    <div className="hero-content text-center">
      <div className="max-w-md">
        <h1 className="text-5xl font-bold">Hello there</h1>
        <p className="py-6">
          Something went wrong!
        </p>
      </div>
    </div>
  </div>)
  }

  return (
    <div className="App">
      <h1>Bacchus Auctions</h1>
      <Card auctions={auctions}/>
    </div>
  );
}

export default App;
