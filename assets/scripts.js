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

//variables
var currentYear = moment().year();
//these would typically not be shown on the front end
var apiKeySpotify = "BQC30pAzOiJa6r6r3lmOxxue8eeHaJsy6jn6SBpp4tklI0SkXlxpUkxgVKqAs9Uv0G7FQOLizaSmZ45_XFWILXo5V7VqVhHS_M2LwYUrBotfk7xtX4L-LySXVzr_SiXdYvkZbcI84A";
var apiKeyDiscogs = "ZkPKfcbrCFxLTLxNSjiZlgnTrLWdqMuIPPYUvVMx";

//get trending albums
//https://api.discogs.com/database/search?year=2021&token=ZkPKfcbrCFxLTLxNSjiZlgnTrLWdqMuIPPYUvVMx
async function getTrendingAlbums(rankThreshold, year, apiKey) {
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
}

//get trending singles
//https://api.discogs.com/database/search?year=2021&format=single&token=ZkPKfcbrCFxLTLxNSjiZlgnTrLWdqMuIPPYUvVMx
async function getTrendingSingles(rankThreshold, year, apiKey) {
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
function updateTrendingSinglesDom(trendingSingles) {
    console.log(trendingSingles);
}

//get recommended albums (you might like this...)
//https://api.discogs.com/database/search?genre=hip+hop&token=ZkPKfcbrCFxLTLxNSjiZlgnTrLWdqMuIPPYUvVMx
//currently spaces need to be passed as + sign, this might need to be checked for somewhere and logic added
async function getRecommendedAlbums(rankThreshold, genre, apiKey) {
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
async function getSearchResults(rankThreshold, userEntry, apiKey) {
    //create string to search by genre
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

//https://github.com/JMPerez/spotify-web-api-js
function getSpotifyApiTestUsingLibrary(bandId, apiKey) {
    var spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(apiKey);
    // get Elvis' albums, passing a callback. When a callback is passed, no Promise is returned
    spotifyApi.getArtistAlbums(bandId, function(err, data) {
        if (err) console.error(err);
        else console.log('Artist albums', data);
    });
}

//runs when page loads
function onLoad() {
    // /database/search ? q = { query } & { ? type, title, release_title, credit, artist, anv, label, genre, style, country, year, format, catno, barcode, track, submitter, contributor }


    //gets and prints from discog
    // var test = getDiscogsApiTest(bandName, apiKeyDiscogs);
    // test.then((data) => {
    //     console.log(data);
    // });

    //gets and prints from spotify
    // getSpotifyApiTestUsingLibrary("43ZHCT0cAZBISjO8DG9PnE", apiKeySpotify);

    getTrendingAlbums(500, currentYear, apiKeyDiscogs);
    getTrendingSingles(5, currentYear, apiKeyDiscogs);
    getRecommendedAlbums(2000, "Hip+Hop", apiKeyDiscogs);
    // getSearchResults(0, "jay-z", apiKeyDiscogs);
    // getSearchResults(0, "Hip+Hop", apiKeyDiscogs);
}

onLoad();