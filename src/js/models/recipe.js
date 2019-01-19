import axios from 'axios';
import {key, proxy} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {        
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            // alert('Something went wrong :(');
        }
    }

    calcTime() {
        // Estimando que necesitamos 15mins por cada 3 ingredientes.
        const numImg = this.ingredients.length;
        const periods = Math.ceil( numImg / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients () {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound' ];

        const newIngredients = this.ingredients.map( el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit,i)=>{
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });
            // 2) Remove parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split('');
            const unitIndex = arrIng.findIndex(el2=> unitsShort.includes(el2));

            let objIng;

            if (unitIndex > -1) {
                // theres a unit
                // ex. 4 1/2 cups, arrCount is [4, 1/2]
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if (arrCount.length===1) {
                    count = eval( arrIng[0].replace('-', '+')) ;
                } else {
                    count = eval(arrIng.slice(0,unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredients: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if ( parseInt( arrIng[0], 10 ) ) {
                // there is NO unit, but 1st element is number
                objIng = {
                    count: parseInt( arrIng[0], 10 ),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                };
            } else if (unitIndex === -1 ) {
                // theres NO unit and no number in first position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            }

            return ingredient;
        });

        this.ingredients = newIngredients;
    }
}