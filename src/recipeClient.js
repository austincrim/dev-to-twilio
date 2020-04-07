const fetch = require('isomorphic-unfetch');
require('dotenv').config();

const getRecipeIdsByIngredients = async (ingredients, numberToReturn) => {
    ingredients = ingredients.replace(/\s+/g, '');
    numberToReturn = numberToReturn.replace(/\s+/g, '');
    console.log(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=${numberToReturn}&apiKey=${process.env.API_KEY}`);

    const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=${numberToReturn}&apiKey=${process.env.API_KEY}`
    );
    if (response.ok) {
        const data = await response.json();
        return data.map((r) => r.id);
    } else {
        throw new Error(
            `Get recipe ids fetch failed with status: ${response.status}`
        );
    }
};

const getRecipeDetailsByIds = async (recipeIds) => {
    const response = await fetch(
        `https://api.spoonacular.com/recipes/informationBulk?ids=${recipeIds.join()}&apiKey=${process.env.API_KEY}`
    );
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error(
            `Get recipe details fetch failed with status: ${response.status}`
        );
    }
};

exports.getRecipeDetailsByIds = getRecipeDetailsByIds;
exports.getRecipeIdsByIngredients = getRecipeIdsByIngredients;
