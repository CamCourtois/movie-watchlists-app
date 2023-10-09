const filmHtml = document.getElementById("film-list")
const emptyFilmHtml = document.getElementById("empty-film-list")

document.addEventListener("DOMContentLoaded", () => {
    const fadeInElement = document.querySelector('#search-box')
    fadeInElement.classList.add('fade-in')
    
})

document.getElementById("search-btn").addEventListener('click', async function(e){
    e.preventDefault()
    await handleSearchClick()
})

async function handleSearchClick(){
    console.log('clicked');
    
    let searchInput = document.getElementById("film-search").value;
    if(searchInput === ""){
        // document.getElementById("film-list").style.display = "none"
        document.getElementById("empty-film-list").textContent = "Please enter a valid search"
    }
    else{
        searchInput.value = "";

        const data = await fetch(`http://www.omdbapi.com/?apikey=6bfdd399&s=${searchInput}`);
        const filmSearchResult = await data.json();
        document.getElementById("empty-film-list").style.display = "none"
        renderFilmList(filmSearchResult);
    }
    
}

async function renderFilmList(data){

        if(!data.Search){
            console.log("sorry no results found")
            filmHtml.style.display = "none"
            emptyFilmHtml.style.display = "block"
            emptyFilmHtml.textContent = "Sorry, no results found"
        }
        else{
            filmHtml.style.display = "block"
            let filmListHtml = ``
        
            for (const movie of data.Search) {
                const filmDetails = await getFilmDetails(movie.imdbID);
                const filmID = movie.imdbID
                
                const {title, ratings, duration, year, genre, plot, poster, rated} = filmDetails
                
                filmListHtml += `
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
                        
                                <button id = "add-remove-btn-${filmID}" class="add-remove-btn" data-info='${filmID}' >
                                    <i data-info='${filmID}' class="fa-solid fa-circle-plus"></i> Watchlist
                                </button>
                                
                            </div>
                            <p class="film-plot">${plot}</p> 
                        </div>
                    </div>
                `;
            }
            filmHtml.classList.remove('fade-in');
            
            filmHtml.innerHTML = filmListHtml

            setTimeout(() => {
                filmHtml.classList.add('fade-in');
              }, 0);
            
        }
        
        
}


async function getFilmDetails(filmID){
    const response = await fetch(`http://www.omdbapi.com/?apikey=6bfdd399&i=${filmID}`);
    const data = await response.json();
    
    filmObject = {}
    filmObject.title = data.Title
    filmObject.ratings = data.Ratings[0].Value.slice(0,3)
    filmObject.duration = data.Runtime
    filmObject.year = data.Year 
    filmObject.genre = data.Genre
    filmObject.plot = data.Plot
    filmObject.poster = data.Poster
    filmObject.rated = data.Rated
    filmObject.filmID = data.imdbID

    return filmObject;
}

document.addEventListener('click', async (e)=>{
    
    if(e.target.dataset.info){
        
        const filmObject = await getFilmDetails(e.target.dataset.info)
        
        addToWatchList(filmObject)
    }
    else{
        console.log("fail")
    }
})

function addToWatchList(film){
    console.log("adding to watchlist")
    let addBtn = document.getElementById(`add-remove-btn-${film.filmID}`)
    addBtn.textContent = "Added to List"
    addBtn.style.padding = "5px"
    
    localStorage.setItem(`${film.filmID}`, JSON.stringify(film))
}



