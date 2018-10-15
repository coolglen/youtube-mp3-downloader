const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const downloader = require('./youtube/downloader');

const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json());


app.get('/', async (req, res) => {
    await downloader.download('https://www.youtube.com/watch?v=FnQbyj27-oY');
    res.send('done');
})

const port = process.env.PORT || 5000;
app.listen(port, () =>{
    console.log(`Listening on port: ${port}`);
});


