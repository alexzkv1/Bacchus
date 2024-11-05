const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const app = express();
const { Sequelize, DataTypes } = require('sequelize');
const db = require('./models'); 
const bid = require('./models/bid');
const Bid = db.Bid;
const PORT = 5000;
const url = 'http://uptime-auction-api.azurewebsites.net/api/Auction';

app.use(cors());
app.use(express.json());



const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:12345678@localhost:5432/postgres');

sequelize.sync().then(() => console.log("Database synchronized"));

app.get('/data', async (req, res) => {
  try {
    const response = await axios.get(url);
    const auctions = response.data;

    const auctionsWithHighestBids = await Promise.all(
      auctions.map(async (auction) => {
        const highestBid = await Bid.max('bidAmount', {
          where: { auctionid: auction.productId },
        }) || 0;

        const isCurrentBidValid = highestBid > auction.currentBid ? highestBid : auction.currentBid; 

        return {
          ...auction,
          highestBid,
          isCurrentBidValid 
        };
      })
    );

    res.json(auctionsWithHighestBids);
  } catch (err) {
    console.error('Error fetching auctions or highest bids:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});


app.post('/place-bid', async (req, res) => {
  const { auctionIDB, usernameBD, bidAmountBD } = req.body;
  console.log("Bid data:", req.body);
  try {
    const numericBidAmount = Number(bidAmountBD);
    if (isNaN(numericBidAmount) || numericBidAmount <= 0) {
      return res.status(400).json({ error: "Invalid bid amount." });
    }

    const existingBid = await db.Bid.findOne({
      where: {
        auctionid: auctionIDB,
        username: usernameBD,
      },
    });

    if (existingBid) {
      if (existingBid.bidAmount >= numericBidAmount) {
        return res.status(400).json({ error: "Bid must be higher than the current highest bid." });
      }

      existingBid.highestbid = numericBidAmount;
      await existingBid.save();
      res.json({ message: "Bid updated successfully." });
    } else {
      await Bid.create({
        auctionid: auctionIDB,
        username: usernameBD,
        bidAmount: numericBidAmount,
      });
      res.json({ message: "Bid placed successfully." });
    }
  } catch (err) {
    console.error("Error placing bid:", err);
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
