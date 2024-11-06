# Auction App

This is a simple auction app where users can view products and place bids.

## Setting Up the Project


1. Install dependencies for both the frontend:

```bash
cd client
npm install

```

2. And backend:
```bash 
cd ../server
npm install
```

## Configure .env

1. For the server
In the server directory, create a .env file:
```bash
PORT=5000
DATABASE_URL=postgres://your_username:your_password@localhost:5432/your_database_name
API_URL=your_url
```

2. For the client
In the client directory, create a .env file (not in /src):
```bash 
REACT_APP_API_URL=http://localhost:5000
```

## How to Run 

1. Navigate to the server directory and run:

```bash
cd server
node server.js
```

2. And then to the client directory
```bash 

cd ../client
npm run start
```

### How to Run Tests
1. Navigate to client directory and run test from command line:
```bash
cd client
npm test 
```
