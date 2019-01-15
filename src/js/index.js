import axios from 'axios';

async function getResults(query) {
  
    // Usen su propia key cabroncitos >=) ...
    const key = '76c2ca6f0e02fdfbf7550511a07b27fe'
    try {
    const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`);
    const recipes = res.data.recipes;
    console.log(recipes);
    } catch (error) {
        alert(error);
    }
}

getResults('tomato pasta');