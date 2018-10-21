let YoutubeMp3Downloader = require("youtube-mp3-downloader");

function Downloader() {

    let self = this;

    //Configure YoutubeMp3Downloader with your settings
    self.YD = new YoutubeMp3Downloader({
        "ffmpegPath": "C:\\ffmpeg\\bin\\ffmpeg.exe",        // Where is the FFmpeg binary located?
        "outputPath": "./tempOutput",    // Where should the downloaded and encoded files be stored?
        "youtubeVideoQuality": "highest",       // What video quality should be used?
        "queueParallelism": 4,                  // How many parallel downloads/encodes should be started?
        "progressTimeout": 2000                 // How long should be the interval of the progress reports
    });

    self.callbacks = {};

    self.YD.on("finished", function (error, data) {

        if (self.callbacks[data.videoId]) {
            self.callbacks[data.videoId].callback(error, data);
        } else {
            console.log("Error: No callback for videoId!");
        }

    });
    self.YD.on("progress", function(progress) {
        if (self.callbacks[progress.videoId]) {
            self.callbacks[progress.videoId].progress(progress);
        } else {
            console.log("Error: No callback for videoId!");
        }
    });

    self.YD.on("error", function (error, data) {

        console.error(error);

        if (self.callbacks[data.videoId]) {
            self.callbacks[data.videoId].callback(error, data);
        } else {
            console.log("Error: No callback for videoId!");
        }

    });

};

Downloader.prototype.getMP3 = function (track, callback, progressCallback) {

    let self = this;

    // Register callback
    self.callbacks[track.videoId] = {callback: null, progess: null};
    self.callbacks[track.videoId].callback = callback;
    self.callbacks[track.videoId].progress = progressCallback;
    self.callbacks[track.videoId].progress({videoId: track.videoId, progress: {notStarted:true}});
    // Trigger download
    self.YD.download(track.videoId, track.name);

};

var dl = new Downloader();
var i = 0;
let jobs = {}
 
function startDownload(videoData){
    if(jobs[videoData.id]){
        console.log("job exists");
        
        return jobs[videoData.id]
    }
    
    dl.getMP3({videoId: videoData.id, name: `${videoData.snippet.title}-${new Date().getTime()}.mp3`}, function(err,res){
        i++;
        if(err)
            throw err;
        else{
        }
    }, progress => jobs[progress.videoId] = progress);
    return jobs[videoData.id]
}

function checkProgress(videoId){
    return jobs[videoId];
}


module.exports = {
    checkProgress,
    startDownload
};

