const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { Sequelize, DataTypes } = require('sequelize');
const db = require('./models');  
const PORT = 5000;
const url = 'http://uptime-auction-api.azurewebsites.net/api/Auction';

app.use(cors());
app.use(express.json());

db.sequelize.sync().then(() => console.log("Database synchronized"));

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:12345678@localhost:5432/postres');

sequelize.sync().then(() => console.log("Database synchronized"));

app.get('/data', async (req, res) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.post('/place-bid', async (req, res) => {
  const { auctionIDBD, usernameBD, bidAmountBD } = req.body;

  try {
    const numericBidAmount = Number(bidAmountBD);
    if (isNaN(numericBidAmount) || numericBidAmount <= 0) {
      return res.status(400).json({ error: "Invalid bid amount." });
    }

    const existingBid = await Bid.findOne({
      where: {
        auctionid: auctionIDBD,
        username: usernameBD,
      },
    });

    if (existingBid) {
      if (existingBid.highestbid >= numericBidAmount) {
        return res.status(400).json({ error: "Bid must be higher than the current highest bid." });
      }

      existingBid.highestbid = numericBidAmount;
      await existingBid.save();
      res.json({ message: "Bid updated successfully." });
    } else {
      await Bid.create({
        auctionid: auctionIDBD,
        username: usernameBD,
        highestbid: numericBidAmount,
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
