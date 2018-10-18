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



module.exports = {
}
