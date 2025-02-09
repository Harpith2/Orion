const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Basic CORS middleware - apply before all routes
app.use(cors());
app.use(express.json());

// Proxy request to Safe Browsing API
app.post('/check-url', async (req, res) => {
  const { url } = req.body;

  const apiKey = 'AIzaSyBnDDzlSnOIMkdbb_ARdnmGAsRMHDUudXo';
  const endpoint = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';
  const requestBody = {
    client: {
      clientId: 'your-app',
      clientVersion: '1.0.0',
    },
    threatInfo: {
      threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
      platformTypes: ['ANY_PLATFORM'],
      threatEntryTypes: ['URL'],
      threatEntries: [{ url }],
    },
  };

  try {
    const response = await axios.post(
      `${endpoint}?key=${apiKey}`,
      requestBody
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Error checking URL safety' });
  }
});

// Proxy request to Have I Been Pwned API
app.get('/check-email/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const response = await axios.get(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${email}`,
      {
        headers: {
          'User-Agent': 'testing',
          'hibp-api-key': 'a9d7a077537e4fc6941124b3ff67124a',
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      res.json([]); // Return empty array for no breaches found
    } else {
      res.status(500).json({ error: 'Error checking email breaches' });
    }
  }
});



// Start the server
app.listen(5001, () => {
  console.log('Backend server running on port 5001');
});