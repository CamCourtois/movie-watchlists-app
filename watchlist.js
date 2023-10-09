
document.addEventListener('DOMContentLoaded', () => {
    renderWatchList();
  
    const sortFilterEl = document.getElementById("watchlist-filter");
  
    sortFilterEl.addEventListener('change', () => {
        renderWatchList();
    });
});

async function getSortFilterValue() {
    const sortFilterEl = document.getElementById("watchlist-filter");
    let sortFilterOption = sortFilterEl.value ? sortFilterEl.value : 'alphabetical';
    return sortFilterOption;
}

function sortWatchlist(array, filterVal) {
    let sortValue = filterVal;
    console.log(sortValue);
    switch (sortValue) {
        case "year":
            array.sort((a, b) => a.year - b.year);
            break;
        case "genre":
            array.sort((a, b) => {
                const genreA = a.genre.toLowerCase();
                const genreB = b.genre.toLowerCase();
                return compareTitlesAndGenres(genreA, genreB);
            });
            break;
        case "alphabetical":
            array.sort((a, b) => {
                const titleA = a.title.toLowerCase();
                const titleB = b.title.toLowerCase();
                return compareTitlesAndGenres(titleA, titleB);
            });
            break;
        default:
            array.sort((a, b) => {
                const titleA = a.title.toLowerCase();
                const titleB = b.title.toLowerCase();
                return compareTitlesAndGenres(titleA, titleB);
            });
    }

   return array
}

function compareTitlesAndGenres(a, b) {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    }
    return 0;
}

function getWatchlistArray(){
    let watchListArray = []
    for(let i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i)
        watchListArray.push(JSON.parse(localStorage.getItem(key)))
    }
    return watchListArray;
}

async function renderWatchList() {

    const filmList = document.getElementById('film-list');
    const emptyFilmList = document.getElementById('empty-film-list');

    let watchlistArray = getWatchlistArray()
    
  
    if (watchlistArray.length === 0) {
      filmList.style.display = 'none';
      emptyFilmList.style.display = 'block';
    } 
    else 
    {
      filmList.style.display = 'block';
      emptyFilmList.style.display = 'none';
        
        let watchlistHTML = '';
        
        
       const sortedWatchlistArray = await sortWatchlist(watchlistArray, await getSortFilterValue())
        
        for (let i = 0; i < sortedWatchlistArray.length; i++) {
    
            const {title, ratings, duration, year, genre, plot, poster, rated, filmID} = sortedWatchlistArray[i]


            watchlistHTML += `
            <div class="film-item">
            <img src=${poster}/>
            <div class="film-info">
                <div class="film-header">
                    <h2>${title}</h2>
                    <i class="fa-solid fa-star"></i>
                    <h3>${ratings}</h3>
                </div>
                <div class="film-sub-header">
                    <h4>${year}</h4>
                    <h4>${duration}</h4>
                    <h4>${rated}</h4>
                    <h4>${genre}</h4>
                    
                        
                    <button class="add-remove-btn" data-remove='${filmID}' >
                        <i data-remove='${filmID}' class="fa-solid fa-circle-minus"></i> Remove
                    </button>
                    
                </div>
                <p class="film-plot">${plot}</p> 
            </div>
        </div>
            `;
        }
        
        filmList.innerHTML = watchlistHTML;
    }
  }
  


document.addEventListener('click', (e) => {
        if(e.target.dataset.remove){
            const filmID = e.target.dataset.remove;
            localStorage.removeItem(filmID);
            renderWatchList()
        }
});
  

 
