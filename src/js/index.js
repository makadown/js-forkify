import Search from "./models/search";
import Recipe from './models/recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from "./views/base";

/* Global state of the app
    - search object
    - current recipe object
    - shopping list object
    - liked recipes
*/
const state = {};

/* SEARCH CONTROLLER */
const ctrlSearch = async () => {
    // 1) Get query from the view
    const query = searchView.getInput(); // TODO: read input
    console.log(query);

    if (query) {
        // 2) new search object and add to state
        state.search = new Search(query);
        // 3) Prepare user interface for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        // 4) Search for recipes
        await state.search.getResults();
        // 5) render results on UI
        clearLoader();
        searchView.renderResults(state.search.results);
    }
};

elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    ctrlSearch();
});

elements.searchResPages.addEventListener( 'click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt( btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
    }
});


/* RECIPE CONTROLLER */
const r = new Recipe(47746);
r.getRecipe();
console.log(r);