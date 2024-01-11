const express = require('express');
const fs=require('fs');
const cors= require('cors');
const path = require('path');
const port = 3000;

// Import fetch dynamically
import('node-fetch').then(fetchModule => {
  const fetch = fetchModule.default;

  const app = express();

  app.use(cors());

  const GRAPHQL_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens';
  const API_KEY = process.env.GRAPH_API_KEY;

  const graphqlQuery = {
    query: `
    {
      domains(first: 5) {
        id
        name
        labelName
        labelhash
      }
      transfers(first: 5) {
        id
        domain {
          id
        }
        blockNumber
        transactionID
      }
    }
    `
  };

  app.get('/fetch-data', async (req, res) => {
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(graphqlQuery)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsondata = await response.json();
      console.log(JSON.stringify(jsondata, null, 2)); // Printing the data to the console
      res.send(jsondata.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching data');
    }
  });

  app.use(express.static('public'));


  app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'public', 'displayData.html'), 'utf8', (err, html) => {
      if (err) {
        res.status(500).send('Error loading page');
      } else {
        res.send(html);
      }
    });
  });

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    next();
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

}).catch(err => {
  console.error('Failed to load node-fetch module:', err);
});
