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
    var trendingAlbums = [];
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
            var albumObject = {
                title: ele.title,
                image: ele.cover_image,
                rank: rankTotal,
                genre: ele.genre,
                label: ele.label
            };
            //filters out those that don't have sufficient rank calculated above
            if (albumObject.rank > rankThreshold) {
                trendingAlbums.push(albumObject);
            }

        }
        //run logic to update DOM
        updateTrendingAlbumDom(trendingAlbums);
    });
    return response;
}

//update DOM for trending albums 
function updateTrendingAlbumDom(trendingAlbumArray) {
    console.log(trendingAlbumArray);
}

//get trending singles
//https://api.discogs.com/database/search?year=2021&format=single&token=ZkPKfcbrCFxLTLxNSjiZlgnTrLWdqMuIPPYUvVMx
async function getTrendingSingles(rankThreshold, year, apiKey) {
    //create string to search by year
    var constructedUrl = "https://api.discogs.com/database/search?year=" +
        year + "&format=single&token=" + apiKey;
    var trendingSingles = [];
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
            var singleObject = {
                title: ele.title,
                image: ele.cover_image,
                rank: rankTotal,
                genre: ele.genre,
                label: ele.label
            };
            //filters out those that don't have sufficient rank calculated above
            if (singleObject.rank > rankThreshold) {
                trendingSingles.push(singleObject);
            }

        }
        //run logic to update DOM
        updateTrendingSinglesDom(trendingSingles);
    });
    return response;
}

//update DOM for trending singles 
function updateTrendingSinglesDom(trendingSinglesArray) {
    console.log(trendingSinglesArray);
}

//get recommended albums (you might like this...)
//https://api.discogs.com/database/search?genre=hip+hop&token=ZkPKfcbrCFxLTLxNSjiZlgnTrLWdqMuIPPYUvVMx
//currently spaces need to be passed as + sign, this might need to be checked for somewhere and logic added
async function getRecommendedAlbums(rankThreshold, genre, apiKey) {
    //create string to search by genre
    var constructedUrl = "https://api.discogs.com/database/search?genre=" +
        genre + "&token=" + apiKey;
    var recommendedAlbums = [];
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
            var albumObject = {
                title: ele.title,
                image: ele.cover_image,
                rank: rankTotal,
                genre: ele.genre,
                label: ele.label
            };
            //filters out those that don't have sufficient rank calculated above
            if (albumObject.rank > rankThreshold) {
                recommendedAlbums.push(albumObject);
            }

        }
        //run logic to update DOM
        updateRecommendedAlbumDom(recommendedAlbums);
    });
    return response;
}

//update DOM for trending albums 
function updateRecommendedAlbumDom(recAlbumArray) {
    console.log(recAlbumArray);
}

//user search
async function getSearchResults(rankThreshold, userEntry, apiKey) {
    //create string to search by genre
    var constructedUrl = "https://api.discogs.com/database/search?q=" +
        userEntry + "&token=" + apiKey;
    var resultAlbums = [];
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
            var albumObject = {
                title: ele.title,
                image: ele.cover_image,
                rank: rankTotal,
                genre: ele.genre,
                label: ele.label
            };
            //filters out those that don't have sufficient rank calculated above
            if (albumObject.rank > rankThreshold) {
                resultAlbums.push(albumObject);
            }

        }
        //run logic to update DOM
        updateSearchResultsDom(resultAlbums);
    });
    return response;
}

//update DOM for trending albums 
function updateSearchResultsDom(resultAlbums) {
    console.log(resultAlbums);
}





//https://api.discogs.com/database/search?release_title=nevermind&artist=nirvana&per_page=3&page=1
//https://api.discogs.com/database/search?q=Muse
// /database/search ? q = { query } & { ? type, title, release_title, credit, artist, anv, label, genre, style, country, year, format, catno, barcode, track, submitter, contributor }
//https://api.discogs.com/database/search?year=2021&format=single&token=ZkPKfcbrCFxLTLxNSjiZlgnTrLWdqMuIPPYUvVMx
async function getDiscogsApiTest(bandName, apiKey) {
    var constructedUrl = "https://api.discogs.com/database/search?q=" +
        bandName + "&token=" + apiKey;
    const response = await fetch(constructedUrl).then(response => {
        if (response.ok) {
            return response.json();
        }
    });
    return response;
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
    //gets and prints from discog
    // var test = getDiscogsApiTest(bandName, apiKeyDiscogs);
    // test.then((data) => {
    //     console.log(data);
    // });

    //gets and prints from spotify
    // getSpotifyApiTestUsingLibrary("43ZHCT0cAZBISjO8DG9PnE", apiKeySpotify);

    getTrendingAlbums(500, currentYear, apiKeyDiscogs);
    getTrendingSingles(5, currentYear, apiKeyDiscogs);
    // getRecommendedAlbums(2000, "Hip+Hop", apiKeyDiscogs);
    // getSearchResults(0, "jay-z", apiKeyDiscogs);
    // getSearchResults(0, "Hip+Hop", apiKeyDiscogs);
}

onLoad();