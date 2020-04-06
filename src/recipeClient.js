const fetch = require('isomorphic-unfetch');
require("dotenv").config();

const getRecipeIdsByIngredients = async ingredients => {
    ingredients = ingredients.replace(/\s+/g, '');
    const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=3&apiKey=${process.env.API_KEY}`);
    if(response.ok) {
        const data = await response.json();
        return data.map(r => r.id);
    } else {
        throw new Error(response);
    }
}

const getRecipeDetailsByIds = async recipeIds => {
    const response = await fetch(`https://api.spoonacular.com/recipes/informationBulk?ids=${recipeIds.join()}&apiKey=${process.env.API_KEY}`);
    if(response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error(response);
    }
}

exports.getRecipeDetailsByIds = getRecipeDetailsByIds;
exports.getRecipeIdsByIngredients = getRecipeIdsByIngredients;
