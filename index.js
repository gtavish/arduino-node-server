const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/welcome', (req, res) => {
    res.json({ message: 'Hello from Render!', status: 'success' });
});

app.get('/getDueStatus/:id', async (req, res) => {
  const id = req.params.id;
  const url = `https://arduino-db-8ae74-default-rtdb.firebaseio.com/students/${id}.json`;

  try {
    const response = await axios.get(url);
    res.json({
      data: response.data,
      status: 'success'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch data',
      error: error.message
    });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
