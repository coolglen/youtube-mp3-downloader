const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const youtubeApi = require('./youtube/youtube-api');

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


})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});