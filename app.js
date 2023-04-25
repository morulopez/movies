const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page='
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'

const main = document.getElementById('main')
const loader = document.getElementById('loader')
const showMore = document.getElementById('showMore')
const form = document.getElementById('form')
const search = document.getElementById('search')

// Get initial movies
getMovies(API_URL)

async function getMovies(url,firtsCall=true,search=false) {
    createLoader();
    if(!search){
        url = `${url}${document.getElementById('getPage').value}`
    }
    const res = await fetch(url)
    const data = await res.json()
    setTimeout(()=>{
        if(firtsCall) main.innerHTML='';
        loader.innerHTML='';
        showMovies(data.results);
        addShowMoreButton();
    },2000)
}   

function createLoader(){
    loader.innerHTML = `<div class="loader"></div>`
}

function showMovies(movies) {
    movies.forEach((movie) => {
        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')
        movieEl.innerHTML =builtMovieEl(movie);
        main.appendChild(movieEl)
    })
}

function builtMovieEl({ title, poster_path, vote_average, overview }){
    return  `<img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>`
}

function addShowMoreButton(){
    showMore.innerHTML='';
    const buttonEl = document.createElement('button')
    buttonEl.classList.add('btn-show-more')
    buttonEl.innerHTML='Show More'
    showMore.appendChild(buttonEl)
    document.querySelector('.btn-show-more').addEventListener('click',()=>{
        const inputPage = document.getElementById('getPage');
        inputPage.value = parseInt(inputPage.value)+1;
        getMovies(API_URL,false);
    })
    return true;
}

function getClassByRate(vote) {
    if(vote >= 8)return 'green'
    else if(vote >= 5)return 'orange'
    return 'red'
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    showMore.innerHTML='';
    main.innerHTML='';
    const searchTerm = search.value
    if(searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm,true,true)
        search.value = ''
    } else {
        window.location.reload()
    }
})