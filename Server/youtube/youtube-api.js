const fetch = require('node-fetch');

const API_KEY = '&key=AIzaSyBDcEsMMl1EqOI4O1Ftv99y61nc1_1PCTk'
const API_URL = 'https://www.googleapis.com/youtube/v3/';

function getVideoData(id) {
    return new Promise((resolve, reject) => {
        getSnippet(id).then(snippet => {
            getContentDetails(id).then(contentDetails => {
                resolve({ ...snippet,
                    ...contentDetails
                });
            })
        });
    });
}

function getAllPlaylistData(id, results = [], nextPageToken) {
    return getPlaylistData(id, nextPageToken).then(async data => {
        const nextPage = data.nextPageToken;
        results = results.concat(data.items);

        if (!nextPage) {
            for (i in results) {
                result = results[i].snippet;
                let contentDetails = await getContentDetails(result.resourceId.videoId).then(r => r)
                if (contentDetails) {
                    results[i] = new Object({ ...results[i],
                        ...contentDetails
                    });
                } else {
                    results.splice(i, 1);
                }
            }
            return results;
        } else {
            return getAllPlaylistData(id, results, nextPage);
        }
    })
}

function getSnippet(id) {
    console.log(`${API_URL}videos?part=snippet&id=${id}${API_KEY}`);

    return fetch(`${API_URL}videos?part=snippet&id=${id}${API_KEY}`).then(r => r.json()).then(r => new Object({
        snippet: r.items[0].snippet
    }));
}

function getContentDetails(id) {
    console.log(`${API_URL}videos?part=contentDetails&id=${id}${API_KEY}`)
    return fetch(`${API_URL}videos?part=contentDetails&id=${id}${API_KEY}`).then(r => r.json()).then(r => {
        if (r.items[0]) {
            return new Object({
                contentDetails: r.items[0].contentDetails
            });
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