const fetch = require('node-fetch');
const _ = require('lodash');

const API_KEY = '&key=AIzaSyBDcEsMMl1EqOI4O1Ftv99y61nc1_1PCTk'
const API_URL = 'https://www.googleapis.com/youtube/v3/';

function getVideoData(id) {
    return new Promise((resolve, reject) => {
        getSnippet(id).then(result => {
           
                resolve(result);
        });
    });
}

function getAllPlaylistData(id, results = [], nextPageToken) {
    return getPlaylistData(id, nextPageToken).then(async data => {
        const nextPage = data.nextPageToken;
        results = results.concat(data.items);

        if (!nextPage) {
            return new Promise(async (resolve, reject) => {

                let ids = _.chunk(results.map(current => current.snippet.resourceId.videoId), 50);
                for (i in ids) {
                    ids[i] = ids[i].join(',')
                }

                let contentDetails = [];

                for (i in ids) {
                    let thisResult = await getContentDetails(ids[i]).then(r => r);                 
                    contentDetails = contentDetails.concat(thisResult);
                } 
            

                let formated = new Object();
                for(i in results){
                    const id = results[i].snippet.resourceId.videoId;
                  formated[results[i].snippet.resourceId.videoId] =  {snippet: results[i].snippet, contentDetails:  getContentById(contentDetails, id)}
                }

                console.log(formated);
                
               resolve(formated)
            });
        } else {
            return getAllPlaylistData(id, results, nextPage);
        }
    })
}

function getContentById(arr, ID){
    for(i in arr){
        if(arr[i].id === ID)return arr[i]
    }
}

function getSnippet(id) {
    console.log(`${API_URL}videos?part=snippet&id=${id}${API_KEY}`);

    return fetch(`${API_URL}videos?part=snippet,contentDetails&id=${id}${API_KEY}`).then(r => r.json()).then(r => r.items[0]);
}

function getContentDetails(id) {
    console.log(`${API_URL}videos?part=contentDetails&id=${id}${API_KEY}`)
    return fetch(`${API_URL}videos?part=contentDetails&id=${id}${API_KEY}`).then(r => r.json()).then(r => {
        if (r.items[0]) {
            return r.items;
        }
        return false;
    });
}


function getPlaylistData(id, nextPageToken) {
    nextPageToken = nextPageToken ? `pageToken=${nextPageToken}&` : '';
    return fetch(`${API_URL}playlistItems?${nextPageToken}part=snippet&maxResults=50&playlistId=${id}${API_KEY}`).then(response => response.json());
}

module.exports = {
    getVideoData,
    getAllPlaylistData
}