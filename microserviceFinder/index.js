const express = require('express');
const app = express();
const port = 3000;
const apikey = process.env.SPOONACUAR_API_KEY;


app.get('finder/getRandomRecipes/', async (req, res) => {
  try {
    const url ='https://api.spoonacular.com/recipes/random?apikey=${apiKey}&number=10'

    const response = await axios.get(url);
    const data = response.data;

    res.json({data});
    
    console.log('Random recipes obtained randomly');
  } catch (error) {
    console.error('Error obtaining random recipes:', error.message);
  }
});



app.listen(port, () => {
  console.log(`Microservice Finder listening at http://localhost:${port}`);
});