const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const youtubeApi = require('./youtube/youtube-api');
const downloader = require('./youtube/downloader');

const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(express.static('./public'));


app.get('/', (req, res) => {

})

app.post('/youtube-api', (req, res) => {

    if (req.body.videoId) {
        youtubeApi.getVideoData(req.body.videoId).then(result => {
            res.json({'video': result})
        });
    }else if(req.body.playlistId){
        youtubeApi.getAllPlaylistData(req.body.playlistId).then(result =>{
            
            res.json({'playlist': result})
        });
    }
});

app.post('/convert', (req, res) => {
    res.json(downloader.startDownload(req.body.videoData));
});

app.post('/progress', (req, res) => {

    const progress = downloader.checkProgress(req.body.videoData.id);
    res.json(progress);
});

app.get('/download/',(req, res) => {
    console.log("here");
    
    console.log(req.query.path);
    res.sendFile(__dirname +"\\"+ req.query.path);
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});