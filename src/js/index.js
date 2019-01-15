import Search from "./models/search";

/* Global state of the app
    - search object
    - current recipe object
    - shopping list object
    - liked recipes
*/
const state = {};

const ctrlSearch = async () => {
    // 1) Get query from the view
    const query = 'pizza'; // TODO: read input

    if (query) {
        // 2) new search object and add to state
        state.search = new Search(query);
        // 3) Prepare user interface for results
        // 4) Search for recipes
        await state.search.getResults();
        // 5) render results on UI
        console.log(state.search.result);
    }
};

document.querySelector('.search').addEventListener('submit', e =>{
    e.preventDefault();

});

const search = new Search('pizza');
search.getResults();
