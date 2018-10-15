const YoutubeMp3Downloader = require('youtube-mp3-downloader');
const ytApi = require('./youtube-api');


var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "C:\\ffmpeg\\bin\\ffmpeg.exe",        // Where is the FFmpeg binary located?
    "outputPath": "./tempOutput",    // Where should the downloaded and encoded files be stored?
    "youtubeVideoQuality": "highest",       // What video quality should be used?
    "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
    "progressTimeout": 2000                 // How long should be the interval of the progress reports
});

YD.on("finished", function(err, data) {
    console.log(JSON.stringify(data));
});
 
YD.on("error", function(error) {
    console.log(error);
});
 
YD.on("progress", function(progress) {
    console.log(JSON.stringify(progress));
});


async function download(url){
   await getUrlDetails(url).then(details => {
    const vid = details.items[0];
    YD.download(vid.id, vid.title);
   });
}

async function getUrlDetails(url) {
      
    if(isFullUrl(url)){
        let params = getParameters(url);
    
        if(params.list){
            return {'playlist': 'is playlist'}
        }else if(params.v){
            try {
                 return await ytApi.getVideoData(params.v);
            } catch (error) {
                return error
            }    
        }else{
            return {error: 'No video found.'}
        }
    }else{

    }
}

function getParameters(url){
    const match = url.match(/(\?|\&)([^=]+)([^&]+)/g);
    let params = {};  
    for(i in match){       
        let current = match[i].split('=');        
        params[current[0].match(/[^&?].*/g)[0]] = current[1];   
    }
    return params;
}

function isFullUrl(url) {
    return url.match(/www.youtube.com\//g)[0];
}

module.exports = {
    download
}
