const fetch = require('node-fetch');

const API_KEY = '&key=AIzaSyBDcEsMMl1EqOI4O1Ftv99y61nc1_1PCTk'
const API_URL = 'https://www.googleapis.com/youtube/v3/';

async function getVideoData(id){
    console.log(`${API_URL}videos?part=snippet&id=${id}${API_KEY}`);
    
    return await fetch(`${API_URL}videos?part=snippet&id=${id}${API_KEY}`).then(result => result.json());
}

module.exports = {
    getVideoData
}
