require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const connectDB = require('./config/db');



app.get('finder/getRandomRecipes', async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const number = req.params.number;
    const url =`https://api.spoonacular.com/recipes/random?apikey=${apiKey}&number=10`;

    const response = await axios.get(url);
    const data = response.data;
    print("hola")
    res.json({data});
    
    console.log('Random recipes obtained randomly');
  } catch (error) {
    console.error('Error obtaining random recipes:', error.message);
  }
});



app.listen(port, () => {
  console.log(`Microservice Finder listening at http://localhost:${port}`);
});