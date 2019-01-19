import Search from "./models/search";
import Recipe from './models/recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from "./views/base";

/* Global state of the app
    - search object
    - current recipe object
    - shopping list object
    - liked recipes
*/
const state = {};

/* SEARCH CONTROLLER */
const controlSearch = async () => {
    // 1) Get query from the view
    const query = searchView.getInput();
    // console.log(query);

    if (query) {
        // 2) new search object and add to state
        state.search = new Search(query);
        // 3) Prepare user interface for results
        searchView.clearInput();
        searchView.clearResults();
        recipeView.clearRecipe();
        renderLoader(elements.searchRes);
        // 4) Search for recipes
        try {
            await state.search.getResults();
            // 5) render results on UI
            clearLoader();
            searchView.renderResults(state.search.results);
        } catch (err) {
            alert('Error processing recipe');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
    }
});


/* RECIPE CONTROLLER */
const controlRecipe = async () => {
    // obtiene Id del url
    const id = window.location.hash.replace('#', '');
    if (id) {
        // prepara el UI para cambios
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // highlight selected search item
        searchView.highlightSelected(id);

        // crear nuevo objecto recipe
        state.recipe = new Recipe(id);
        try {
            // obtener datos del recipe y parsear ingredientes
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // calcular servings y tiempo de preparacion
            state.recipe.calcTime();
            state.recipe.calcServings();
            // renderear el recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (err) {
            alert('Error processing recipe');
        }
    }
};

/*
window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);
*/
// Esta linea hace lo mismo que arriba;
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));