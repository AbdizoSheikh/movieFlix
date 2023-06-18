

const apiKey = 'e6d486c9';
const moviesContainer = document.getElementById('moviesContainer');
const paginationContainer = document.getElementById('paginationContainer');
const modalContainer = document.getElementById('modalContainer');
const movieDetailsContainer = document.getElementById('movieDetails');
const searchInput = document.getElementById('searchInput');
const loaderContainer = document.getElementById('loaderContainer');

let currentPage = 1;
let totalResults = 0;
let totalPages = 0;
let currentMovies = [];
const searchForm = document.getElementById('searchForm');
searchForm.addEventListener('submit', function(event) {
  
    event.preventDefault();
    currentPage = 1;
    fetchMovies();

});

function showLoader() {
  loaderContainer.style.display = 'flex';
}

function hideLoader() {
  loaderContainer.style.display = 'none';
}

function fetchMovies() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm === '') return;

  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}&page=${currentPage}`;

  moviesContainer.innerHTML = '';
  paginationContainer.innerHTML = '';
  showLoader();

  fetch(url)
    .then(response => response.json())
    .then(data => {
      hideLoader();
      if (data.Response === 'True') {
        currentMovies = data.Search;
        totalResults = parseInt(data.totalResults);
        totalPages = Math.min(Math.ceil(totalResults / 10), 6);

        displayMovies();
        displayPagination();
      } else {
        moviesContainer.innerHTML = '<p>No movies found.</p>';
      }
    })
    .catch(error => {
      hideLoader();
      console.log('Error:', error);
      moviesContainer.innerHTML = '<p>An error occurred. Please try again later.</p>';
    });
}

function displayMovies() {
  currentMovies.forEach(movie => {
    const movieCard = document.createElement('div');
    const movieContainer=document.createElement('div')
    movieContainer.appendChild(movieCard)
    const button=document.createElement('button')
    button.classList.add('movie-button')
    movieContainer.classList.add('movie-card');
    movieContainer.innerHTML = `
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'no-image.jpg'}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button>View Details</button>
    `;
    moviesContainer.appendChild(movieContainer);

    movieContainer.addEventListener('click', () => {
      fetchMovieDetails(movie.imdbID);
    });
  });
}

function fetchMovieDetails(imdbID) {
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.Response === 'True') {
        displayMovieDetails(data);
      }
    })
    .catch(error => {
      console.log('Error:', error);
      movieDetailsContainer.innerHTML = '<p>An error occurred. Please try again later.</p>';
    });

  modalContainer.style.display = 'block';
}

function displayMovieDetails(movie) {
  movieDetailsContainer.innerHTML = `
    <h2>${movie.Title}</h2>
    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'no-image.jpg'}" alt="${movie.Title}">

    <p><strong>Year:</strong> ${movie.Year}</p>
    <p><strong>Director:</strong> ${movie.Director}</p>
    <p><strong>Cast:</strong> ${movie.Actors}</p>
    <p><strong>Plot:</strong> ${movie.Plot}</p>
    <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
    <p><strong>Genre:</strong> ${movie.Genre}</p>
  `;
}

modalContainer.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal') || event.target.classList.contains('close')) {
    modalContainer.style.display = 'none';
  }
});

function displayPagination() {
  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement('a');
    pageLink.href = '#';
    pageLink.textContent = i;
    pageLink.classList.add('page-link');
    if (i === currentPage) {
      pageLink.classList.add('active');
    }
    paginationContainer.appendChild(pageLink);

    pageLink.addEventListener('click', function(event) {
      event.preventDefault();
      currentPage = i;
      fetchMovies();
    });
  }
}

function initializeApp() {
  fetchMovies();
}

initializeApp();
