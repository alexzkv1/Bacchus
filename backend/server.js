const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config()
const { Pool } = require("pg");
app = express();
const port = 8080;
const url = 'http://uptime-auction-api.azurewebsites.net/api/Auction';

app.use(cors());
app.use(express.json());


const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});



app.get('/data', async (req, res) => {
    try {
        const auctionResponse = await axios.get(url);
        const auctions = auctionResponse.data;

        const auctionsWithHighestBids = await Promise.all(auctions.map(async (auction) => {
            const highestBidResponse = await pool.query(
                `SELECT MAX(highestBid) AS maxBid FROM Bids WHERE auctionID = $1`,
                [auction.productId]
            );

            const highestBid = highestBidResponse.rows[0].maxbid || 0;
            return { ...auction, highestBid };
        }));

        res.send(auctionsWithHighestBids);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});





// Endpoint to check if a bid exists for a user in a specific auction
app.get("/bid-exists/:auctionID/:username", async (req, res) => {
    const { auctionID, username } = req.params;

    try {
        const result = await pool.query(`
            SELECT highestbid
            FROM Bids
            WHERE auctionid = $1 AND username = $2
        `, [auctionID, username]);

        if (result.rows.length > 0) {
            res.json({ exists: true, bid: result.rows[0].highestbid });
        } else {
            res.json({ exists: false });
        }
    } catch (err) {
        console.error("Error checking bid existence:", err);
        res.status(500).json({ error: err.message });
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



app.listen(port, () =>{
    console.log(`App listening on port ${port}`);
})