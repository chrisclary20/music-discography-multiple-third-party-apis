var bandName = "Muse";
var apiKeySpotify = "BQC30pAzOiJa6r6r3lmOxxue8eeHaJsy6jn6SBpp4tklI0SkXlxpUkxgVKqAs9Uv0G7FQOLizaSmZ45_XFWILXo5V7VqVhHS_M2LwYUrBotfk7xtX4L-LySXVzr_SiXdYvkZbcI84A";
var apiKeyDiscogs = "ZkPKfcbrCFxLTLxNSjiZlgnTrLWdqMuIPPYUvVMx";

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

//https://api.discogs.com/database/search?release_title=nevermind&artist=nirvana&per_page=3&page=1
//https://api.discogs.com/database/search?q=Muse
// /database/search ? q = { query } & { ? type, title, release_title, credit, artist, anv, label, genre, style, country, year, format, catno, barcode, track, submitter, contributor }
//https://api.discogs.com/database/search?q=Nirvana&token=abcxyz123456
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

//runs when page loads
function onLoad() {
    //gets and prints from discog
    var test = getDiscogsApiTest(bandName, apiKeyDiscogs);
    test.then((data) => {
        console.log(data);
    });

    //gets and prints from spotify
    getSpotifyApiTestUsingLibrary("43ZHCT0cAZBISjO8DG9PnE", apiKeySpotify);

}

onLoad();