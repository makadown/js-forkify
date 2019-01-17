import { elements } from "./base";

export const getInput = () => elements.searchInput.value;
export const clearInput = () =>{ elements.searchInput.value = ''; };
export const clearResults = () => {
    elements.searchResultList.innerHTML='';
    elements.searchResPages.innerHTML = '';
};

// eg 'Pasta with tomato and spinach' 
const limitRecipeTitle = (title, limit=20) => {
    const newTitle = [];
    if (title.length > limit) {
        /* Esto hace iteraciones con los pedazos de un titulo, incrementando en el tamaño de
        cada trozo hasta superar el limite. */
        title.split(' ').reduce((acc, cur)=>{
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')}...`;
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `<li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>`;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

// type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type==='prev'? page-1 : page+1 }>
        <span>Page ${type==='prev'? page-1 : page+1 }</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type==='prev'? 'left' : 'right' }"></use>
        </svg>        
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil( numResults / resPerPage);
    let button;

    if (page===1 && pages >1) {
        // mostrar unicamente el boton para ir a pagina siguiente
        button = createButton(page, 'next');
    } else if (page === pages && pages>1) {
        // mostrar unicamente boton a pagina previa
        button = createButton(page, 'prev');
    } else if ( page< pages ) {
        // mostrar los dos botones.
        button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')}
        `;
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // rendererar resultados de pagina actual
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // mostrar botones de paginacion
    renderButtons(page, recipes.length, resPerPage);
};