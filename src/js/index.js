import Search from "./models/search";
import * as searchView from './views/searchView';
import { elements } from "./views/base";

/* Global state of the app
    - search object
    - current recipe object
    - shopping list object
    - liked recipes
*/
const state = {};

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
        // 4) Search for recipes
        await state.search.getResults();
        // 5) render results on UI
        searchView.renderResults(state.search.results);
    }
};

elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    ctrlSearch();
});
