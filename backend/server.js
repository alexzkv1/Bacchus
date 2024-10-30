const express = require('express');
const axios = require('axios');
const cors = require('cors');
app = express();
const port = 8080;
const url = 'http://uptime-auction-api.azurewebsites.net/api/Auction';

app.use(cors());

app.get('/data',  (req, res) => {
    axios.get(url)
    .then((response) => {
        res.send(response.data);
    })
    .catch((error) => {
        res.status(500).send('Server Error');
    });
    
});

app.listen(port, () =>{
    console.log(`App listening on port ${port}`);
})