# Auction App

This is a simple auction app where users can view products and place bids.

## Setting Up the Project

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/auction-app.git
   cd auction-app

2. Install dependencies for both the frontend and backend:

```bash
cd client
npm install
```
```


## How to Run the Server

1. Navigate to the server directory and run:

```bash
cd server
node server.js
```

## Configure .env

1. For the server
In the server directory, create a .env file:
```bash

PORT=
DATABASE_URL=
API_URL=
```

###### Example Database connection:
```bash
DATABASE_URL=postgres://your_username:your_password@localhost:5432/your_database_name
```



2. For the client
In the client directory, create a .env file:
```bash 
REACT_APP_API_URL=
```

3. Setting Database
In the server directory, run:
```bash
npm run sequelize db:migrate
```

### Tests
1. Navigate to client directory and run test from command line:
```bash
cd client
npm test 
```
