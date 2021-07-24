// DOM elements
var trendingSinglesEl = document.querySelector(".trending-singles");
var recommendationsEl = document.querySelector(".recommendations");
var yearEl = document.querySelector(".current-year");
var searchUserInputEl = document.querySelector(".search-user-input");
var searchButtonEl = document.querySelector(".user-search-button");
var searchHistoryEl = document.querySelector(".search-history");
var mainTextEl = document.querySelector(".main-text");
var modalClickEl = document.querySelector(".modal-click");
var modalInfoEl = document.querySelector(".modal-info");
var exitModalButtonEl = document.querySelector(".exit-modal");
var modalBackgroundEl = document.querySelector(".modal-background");
var modalContentEl = document.querySelector(".modal-card-body");
var modalTitleEl = document.querySelector(".modal-card-title");

//variables
var currentYear = moment().year();
//these would typically not be shown on the front end
var apiKeyDiscogs = "ZkPKfcbrCFxLTLxNSjiZlgnTrLWdqMuIPPYUvVMx";
//if quota is reached, create a new project then api key here (update project name in URL): https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=452704620540 and then update variable
var apiKeyYouTube = "AIzaSyCzkHtg-eRycXCXbNJEvoEJvRc79n5xvB8";
//max search history
var maxNumberOfMenuItems = 8;
//set DOM year
yearEl.innerHTML = currentYear;

//event listeners
searchButtonEl.addEventListener("click", function() {
    var userEntry = searchUserInputEl.value;
    addRecentSearchButton(userEntry);
    getSearchResults(100, userEntry, apiKeyDiscogs);
});

searchUserInputEl.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        var userEntry = searchUserInputEl.value;
        addRecentSearchButton(userEntry);
        getSearchResults(100, userEntry, apiKeyDiscogs);
    }
});

//when clicking search a history button
searchHistoryEl.addEventListener("click", function(event) {
    var userEntry = event.target.innerHTML;
    //need to search here and return albums
    getSearchResults(100, userEntry, apiKeyDiscogs);
});

//when clicking the exit modal button
exitModalButtonEl.addEventListener("click", function(event) {
    modalInfoEl.classList.remove("is-active");
});

//when clicking modal background
modalBackgroundEl.addEventListener("click", function(event) {
    modalInfoEl.classList.remove("is-active");
});

//when clicking a trending singles card
trendingSinglesEl.addEventListener("click", function(event) {
    var userEntry = event.target.closest(".modal-click");
    var selectedCard = event.target.closest(".has-text-centered");
    if (userEntry) {
        modalInfoEl.classList.add("is-active");
        populateModal(selectedCard);
    }
});

//when clicking record that was returned
recommendationsEl.addEventListener("click", function(event) {
    var userEntry = event.target.closest(".modal-click");
    var selectedCard = event.target.closest(".has-text-centered");
    if (userEntry) {
        modalInfoEl.classList.add("is-active");
        populateModal(selectedCard);
    }
});

//populate modal from DOM, this is used for results from the Discogs API
function populateModal(selectedCard) {
    var maxCharLength = 50;
    modalContentEl.innerHTML = "";
    //get data from DOM
    var mediaContent = selectedCard.querySelector(".media-content");
    var image = selectedCard.querySelector(".content-image").src;
    var title = mediaContent.firstChild.innerHTML;
    var genres = mediaContent.children[1].innerHTML;
    var label = mediaContent.children[2].innerHTML;
    //generate and add to DOM
    var html = "<img class='modal-image' src='" +
        image + "' alt='" + title + "'><p>Genre(s): " + genres + " | Label: " + label + "</p>";
    modalContentEl.innerHTML = html;
    if (title.length > maxCharLength) {
        title = title.substring(0, maxCharLength);
    }
    modalTitleEl.innerHTML = title;
}

//add search entry to DOM and local storage
function addRecentSearchButton(userEntry) {
    //create object to add to local storage array
    var recentSearch = {
        input: userEntry,
        genres: ""
    };
    //add to DOM
    var html = "<button class='button is-info is-medium is-fullwidth'>" + recentSearch.input + "</button>";
    //add to DOM at the beginning of the element
    searchHistoryEl.insertAdjacentHTML("afterbegin", html);
    //if the max number is reached, remove the last item from the DOM
    if (searchHistoryEl.children.length == maxNumberOfMenuItems + 1) {
        searchHistoryEl.children[maxNumberOfMenuItems].remove();
    }
    //add to json local storage array
    // Parse any JSON previously stored in allEntries
    var existingEntries = JSON.parse(localStorage.getItem("allSavedSearches"));
    if (existingEntries == null) {
        existingEntries = [];
    }
    if (existingEntries.length >= maxNumberOfMenuItems) {
        //if >= maxNumberOfMenuItems remove one before adding
        existingEntries.pop();
    }
    existingEntries.unshift(recentSearch);
    localStorage.setItem("allSavedSearches", JSON.stringify(existingEntries));
    //clear search
    searchUserInputEl.value = "";
}

//get recent searches from local storage and render them
function populateRecentlySearched() {
    var existingEntries = JSON.parse(localStorage.getItem("allSavedSearches"));
    if (existingEntries != null) {
        for (let i = 0; i < existingEntries.length; i++) {
            searchHistoryEl.innerHTML += "<button class='button is-info is-medium is-fullwidth'>" + existingEntries[i].input + "</button>";;
        }
    }
}

//get recommendations from YouTube
function getYouTubeRecommendations(userEntry, NumOfResults, apiKey) {
    var constructedUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=" + NumOfResults +
        "&order=relevance&q=" +
        userEntry +
        "&key=" + apiKey;
    var results = getYouTubeApi(constructedUrl);
    results.then((data) => {
        updateYouTubeDom(data);
    });
}

//update DOM with YouTube data 
function updateYouTubeDom(results) {
    shuffleArray(results);
    var html = "";
    var maxLength = 20;
    if (results.length < maxLength) {
        maxLength = results.length;
    }
    for (let i = 0; i < maxLength; i++) {
        const ele = results[i];
        html = "<div class='column is-one-fifth has-text-centered'><a href='https://www.youtube.com/watch?v=" +
            ele.videoId + "' target='_blank'><div class='card large'><div class='card-image'><figure class='image'><img src='" +
            ele.image.url + "' alt='" +
            ele.title + "'></figure></div><div class='card-content'><div class='media'><div class='media-content'><p class='card-title'>" +
            ele.title + "</p><p class='card-info'>" +
            ele.created + "</p></div></div></div></div></a></div>";
        recommendationsEl.innerHTML += html;
    }
}

//load youtube recommendations from genres saved to local storage 
function onLoadYouTubeRecommendations(apiKey) {
    // Parse any JSON previously stored in allEntries
    var existingGenres = JSON.parse(localStorage.getItem("savedGenres"));
    if (existingGenres == null) {
        getYouTubeRecommendations("Top 40", 20, apiKey);
    } else {
        shuffleArray(existingGenres);
        getYouTubeRecommendations(existingGenres[0] + " Music", 20, apiKey);
    }
}

//connect and return data from YouTube
async function getYouTubeApi(constructedUrl) {
    var resultObjects = [];
    //get a response and then iterate through data, if it is ranked high enough add the object to the array
    const response = await fetch(constructedUrl).then(response => {
        if (response.ok) {
            return response.json();
        }
    }).then((data) => {
        for (let i = 0; i < data.items.length; i++) {
            var ele = data.items[i];
            var resultObject = {
                title: ele.snippet.title,
                videoId: ele.id.videoId,
                image: ele.snippet.thumbnails.medium,
                created: moment(ele.snippet.publishTime).format("M-DD-YYYY"),
                channelName: ele.snippet.channelTitle
            }
            if (resultObject.videoId) {
                resultObjects.push(resultObject);
            }
        }
    });
    return resultObjects;
}

//get trending singles
//https://api.discogs.com/database/search?year=2021&format=single&token=ZkPKfcbrCFxLTLxNSjiZlgnTrLWdqMuIPPYUvVMx
function getTrendingSingles(rankThreshold, year, genre, apiKey) {
    //create string to search by year
    var constructedUrl = "https://api.discogs.com/database/search?genre=" +
        genre + "&year=" +
        year + "&format=single&token=" + apiKey;
    //get the promise back and then once data comes back pass to update DOM
    var results = callDiscogsApi(constructedUrl, rankThreshold);
    results.then((data) => {
        updateTrendingSinglesDom(data);
    });
}

//update DOM for trending singles 
//TODO: similar to updateTrendingAlbumDom - refactor function
function updateTrendingSinglesDom(resultAlbums) {
    //randomize the array
    shuffleArray(resultAlbums);
    var numOfResults = 5; //max would be resultAlbums.length
    updateDomFromDicogs(resultAlbums, numOfResults, trendingSinglesEl);
}

//load trending singles based on a genre from local storage gotten during search
function onLoadGetTrendingSingles(apiKey) {
    // Parse any JSON previously stored in allEntries
    var existingGenres = JSON.parse(localStorage.getItem("savedGenres"));
    if (existingGenres == null) {
        getTrendingSingles(5, currentYear, "rock", apiKey);
    } else {
        shuffleArray(existingGenres);
        getTrendingSingles(5, currentYear, existingGenres[0], apiKey);
    }
}

//user search
//https://api.discogs.com/database/search?q=hip+hop&token=ZkPKfcbrCFxLTLxNSjiZlgnTrLWdqMuIPPYUvVMx
function getSearchResults(rankThreshold, userEntry, apiKey) {
    //create string to search by user entry
    var constructedUrl = "https://api.discogs.com/database/search?q=" +
        userEntry + "&token=" + apiKey;
    //get the promise back and then once data comes back pass to update DOM
    var results = callDiscogsApi(constructedUrl, rankThreshold);
    results.then((data) => {
        updateSearchResultsDom(data);
        saveRelevantGenres(data);
    });
}

//get a relevant list of genres and save to local storage
function saveRelevantGenres(resultAlbums) {
    console.log(resultAlbums);
    const savedGenres = new Set()
        //this does not get every genre because genres are an array when returned but it's enough
    for (let i = 0; i < resultAlbums.length; i++) {
        const ele = resultAlbums[i];
        savedGenres.add(ele.genre[0]);
    }
    //change set to array and save to local storage
    localStorage.setItem("savedGenres", JSON.stringify(Array.from(savedGenres)));
}

//update DOM for trending albums 
function updateSearchResultsDom(resultAlbums) {
    mainTextEl.innerHTML = "Search results..."
    updateDomFromDicogs(resultAlbums, 50, recommendationsEl);
}

//updates the dom for trending singles and search results
function updateDomFromDicogs(resultAlbums, maxResults, elementUpdated) {
    elementUpdated.innerHTML = "";
    var html = "";
    var genres = "";
    if (resultAlbums.length < maxResults) {
        maxResults = resultAlbums.length;
    }
    for (let i = 0; i < maxResults; i++) {
        const ele = resultAlbums[i];
        for (let f = 0; f < ele.genre.length; f++) {
            genres += ele.genre[f];
            if (f < ele.genre.length - 1) {
                genres += " | ";
            }
        }
        html = "<div class='column is-one-fifth has-text-centered'><div class='card large modal-click'><div class='card-image'><figure class='image'><img class='content-image' src='" +
            ele.image + "' alt='" +
            ele.title + "'></figure></div><div class='card-content'><div class='media'><div class='media-content'><p class='card-title'>" +
            ele.title + "</p><p class='card-info'>" +
            genres + "</p><p class='card-info'>" +
            ele.label[0] + "</p></div></div></div></div></div>";
        elementUpdated.innerHTML += html;
        genres = "";
    }
}

//call and get data from discogs API and return custom object array
async function callDiscogsApi(constructedUrl, rankThreshold) {
    var resultObjects = [];
    //get a response and then iterate through data, if it is ranked high enough add the object to the array
    const response = await fetch(constructedUrl).then(response => {
        if (response.ok) {
            return response.json();
        }
    }).then((data) => {
        for (let i = 0; i < data.results.length; i++) {
            var ele = data.results[i];
            //rank doesn't always exist
            var rankTotal = 0;
            if (ele.community) {
                rankTotal = ele.community.want + ele.community.have
            }
            var resultObject = {
                title: ele.title,
                image: ele.cover_image,
                rank: rankTotal,
                genre: ele.genre,
                label: ele.label
            };
            //filters out those that don't have sufficient rank calculated above
            if (resultObject.rank > rankThreshold) {
                resultObjects.push(resultObject);
            }
        }
    });
    return resultObjects;
}

//replace space with plus to pass to API URLs
function replaceSpaceWithPlus(str) {
    return str.replace(/\s+/g, '+');
}

//Shuffles an array to randomize
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

//runs when page loads
function onLoad() {
    //Run these to show on DOM
    onLoadGetTrendingSingles(apiKeyDiscogs);
    onLoadYouTubeRecommendations(apiKeyYouTube);
    populateRecentlySearched();
}

onLoad();