// DOM elements
var navBarEl = document.querySelector(".navbar");
var homeLinkEl = document.querySelector(".home");
var sourcesLinkEl = document.querySelector(".sources");
var searchBoxEl = document.querySelector(".search-box");
var rowBeforeAlbumsEl = document.querySelector(".row-before-albums");
var trendingAlbumsEl = document.querySelector(".trending-albums");
var rowBeforeSinglesEl = document.querySelector(".row-before-singles");
var trendingSinglesEl = document.querySelector(".trending-singles");
var subsectionSinglesEl = document.querySelector(".subsection-singles");
var rowBeforeRecommendationsEl = document.querySelector(".row-before-rec");
var recommendationsEl = document.querySelector(".recommendations");
var rowBeforeSearchedEl = document.querySelector(".row-before-searched");
var recentlySearchedEl = document.querySelector(".recently-searched");
var yearEl = document.querySelector(".current-year");

//variables
var currentYear = moment().year();
//these would typically not be shown on the front end
var apiKeySpotify = "BQCGIehYvduzpeprozD9T0YqWx_b9zVTzyRdIYcMo9ka2gw3VTAcShZ9yMAsfQ4HXvS4gPoI4ysIrM1XcNdSE98PftKvOWmA4JwRJ9114HjHF_TzdZbpHwYQUK_ZL0cSq8wVGZYfLQ-KPAA";
var apiKeyDiscogs = "ZkPKfcbrCFxLTLxNSjiZlgnTrLWdqMuIPPYUvVMx";
//if quota is reached, create a new project then api key here: https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=452704620540 and then update variable
var apiKeyYouTube = "AIzaSyCLtTtkim06HaBcHaSgqcua8vIt13zZ1js";

//set DOM year
yearEl.innerHTML = currentYear;

//https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=452704620540
//https://www.googleapis.com/youtube/v3/search?part=snippet&q=php&key=AIzaSyCwB3g3unr3dVHwdzwiNXYYBKOoooVBS_Y
// https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&qhip+hop&key=AIzaSyCLtTtkim06HaBcHaSgqcua8vIt13zZ1js
//https://www.googleapis.com/youtube/v3/videos?id=BJzmJxLncO4&key=AIzaSyCLtTtkim06HaBcHaSgqcua8vIt13zZ1js&part=status
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

//https://www.googleapis.com/youtube/v3/videos?id=6CQEZ_kas0I&key=AIzaSyBQ2FNzqY1x54ZKwVKjCtRAyFOQKyR3wnI&part=snippet,contentDetails,status
//https://www.youtube.com/get_video_info?video_id=6CQEZ_kas0I

//update DOM with YouTube data 
function updateYouTubeDom(results) {
    console.log(results);
    var html = "";
    for (let i = 0; i < results.length; i++) {
        const ele = results[i];
        html = "<a href='https://www.youtube.com/watch?v=" + ele.videoId + "' target='_blank'><img class='album-art' src='" + ele.image.url + "' alt='" + ele.title + "'><h5>Title: " +
            ele.title + "</h5></a><p>Channel Name: " + ele.channelName + "</p><p>Created: " +
            ele.created + "</p>";
        recommendationsEl.innerHTML += html;
    }
}

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
                created: moment(ele.snippet.publishTime).format("MM-DD-YYYY"),
                channelName: ele.snippet.channelTitle
            }
            if (resultObject.videoId) {
                resultObjects.push(resultObject);
            }
        }
        console.log(data);
    });
    return resultObjects;
}

//get trending albums
//https://api.discogs.com/database/search?year=2021&token=ZkPKfcbrCFxLTLxNSjiZlgnTrLWdqMuIPPYUvVMx
function getTrendingAlbums(rankThreshold, year, apiKey) {
    //create string to search by year
    var constructedUrl = "https://api.discogs.com/database/search?year=" +
        year + "&token=" + apiKey;
    //get the promise back and then once data comes back pass to update DOM
    var results = callDiscogsApi(constructedUrl, rankThreshold);
    results.then((data) => {
        updateTrendingAlbumDom(data);
    });
}

//update DOM for trending albums 
function updateTrendingAlbumDom(resultAlbums) {
    console.log(resultAlbums);
    //trendingAlbumsEl
    var html = "";
    var genres = "";
    for (let i = 0; i < resultAlbums.length; i++) {
        const ele = resultAlbums[i];
        for (let f = 0; f < ele.genre.length; f++) {
            genres += ele.genre[f];
            if (f < ele.genre.length - 1) {
                genres += " | ";
            }
        }
        // html = "<img class='album-art' src='" + ele.image + "' alt='" + ele.title + "'><h5>Title: " +
        //     ele.title + "</h5><p>Genres: " + genres + "</p><p>Label: " + ele.label[0] + "</p><p></p>";
        html = "";
        trendingAlbumsEl.innerHTML += html;
        genres = "";
    }


}

//get trending singles
//https://api.discogs.com/database/search?year=2021&format=single&token=ZkPKfcbrCFxLTLxNSjiZlgnTrLWdqMuIPPYUvVMx
function getTrendingSingles(rankThreshold, year, apiKey) {
    //create string to search by year
    var constructedUrl = "https://api.discogs.com/database/search?year=" +
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
    console.log(resultAlbums);
    //randomize the array
    shuffleArray(resultAlbums);
    var html = "";
    var genres = "";
    var numOfResults = resultAlbums.length; //max would be resultAlbums.length
    for (let i = 4; i < numOfResults; i++) {
        const ele = resultAlbums[i];
        for (let f = 0; f < ele.genre.length; f++) {
            genres += ele.genre[f];
            if (f < ele.genre.length - 1) {
                genres += " | ";
            }
        }
        html = "<div class='column is-one-fifth has-text-centered'><div class='card large'><div class='card-image'><figure class='image'><img src='" +
            ele.image + "' alt='" +
            ele.title + "'></figure></div><div class='card-content'><div class='media'><div class='media-content'><p class='card-title'>" +
            ele.title + "</p><p class='card-info'>" +
            genres + "</p><p class='card-info'>" +
            ele.label[0] + "</p></div></div></div></div></div>";
        trendingSinglesEl.innerHTML += html;
        genres = "";
    }
}

//get recommended albums (you might like this...)
//https://api.discogs.com/database/search?genre=hip+hop&token=ZkPKfcbrCFxLTLxNSjiZlgnTrLWdqMuIPPYUvVMx
//currently spaces need to be passed as + sign, this might need to be checked for somewhere and logic added
function getRecommendedAlbums(rankThreshold, genre, apiKey) {
    //create string to search by genre
    var constructedUrl = "https://api.discogs.com/database/search?genre=" +
        genre + "&token=" + apiKey;
    //get the promise back and then once data comes back pass to update DOM
    var results = callDiscogsApi(constructedUrl, rankThreshold);
    results.then((data) => {
        updateRecommendedAlbumDom(data);
    });
}

//update DOM for trending albums 
function updateRecommendedAlbumDom(resultAlbums) {
    console.log(resultAlbums);
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
    });
}

//update DOM for trending albums 
function updateSearchResultsDom(resultAlbums) {
    console.log(resultAlbums);
}

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
    // /database/search ? q = { query } & { ? type, title, release_title, credit, artist, anv, label, genre, style, country, year, format, catno, barcode, track, submitter, contributor }

    //Run these to show on DOM
    getTrendingAlbums(500, currentYear, apiKeyDiscogs);
    getTrendingSingles(5, currentYear, apiKeyDiscogs);
    getYouTubeRecommendations(replaceSpaceWithPlus("hip hop"), 12, apiKeyYouTube);
}

onLoad();