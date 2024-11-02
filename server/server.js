const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;
const url = 'http://uptime-auction-api.azurewebsites.net/api/Auction';
// Serve the static files from the React app'
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(cors());


app.get(`/data`, async (req, res) => {
    try {
        const response = await fetch(url);
        res.json(response);
    }
    catch (err){
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
