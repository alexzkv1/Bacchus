const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { Pool } = require("pg");
const PORT = process.env.PORT || 5000;
const url = 'http://uptime-auction-api.azurewebsites.net/api/Auction';

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});


app.use(cors());

app.get(`/data`, async (req, res) => {
    try {
        const response = await fetch(url);
        const data = await response.json(); // Convert the response to JSON
        res.json(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.post("/place-bid", async (req, res) => {
    const { auctionID, username, bidAmount } = req.body;

    try {
        const numericBidAmount = Number(bidAmount);
        if (isNaN(numericBidAmount) || numericBidAmount <= 0) {
            return res.status(400).json({ error: "Invalid bid amount." });
        }

        const checkResult = await pool.query(`
            SELECT highestbid
            FROM Bids
            WHERE auctionid = $1 AND username = $2
        `, [auctionID, username]);

        if (checkResult.rows.length > 0) {
            const existingBid = checkResult.rows[0].highestbid;
            if (existingBid >= numericBidAmount) {
                return res.status(400).json({ error: "Bid must be higher than the current highest bid." });
            }

            const updateResult = await pool.query(`
                UPDATE Bids
                SET highestbid = $3
                WHERE auctionid = $1 AND username = $2
            `, [auctionID, username, numericBidAmount]);
            res.json({ message: "Bid updated successfully." });
        } else {
            const insertResult = await pool.query(`
                INSERT INTO Bids (auctionid, username, highestbid)
                VALUES ($1, $2, $3)
            `, [auctionID, username, numericBidAmount]);
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
