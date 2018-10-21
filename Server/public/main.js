new Vue({
    el: '#app',
    data: {
        url: 'https://www.youtube.com/watch?v=09R8_2nJtjg&list=PLzDtLZNk6j-xtyjj1gkbXBAgOC_JuBk4L',
        videoList: [],
        error: ''
    },
    methods: {
        addUrl() {
            this.error = '';
            this.getUrlDetails(this.url);
        },
        getUrlDetails(url) {
            if (this.isFullUrl(url)) {
                let params = this.getParameters(url);
                if (params.v) {
                    console.log('fetching ' + params.v);
                    this.apiCall({
                        videoId: params.v
                    }).then(result => {
                        if (result.video) {
                            console.log(result);
                            result.video.downloadStatus = "waiting";

                            this.videoList.unshift(result);
                        } else {
                            this.error = 'No Video Found.'
                        }
                    });
                } else {
                }
            } else {
            }
        },

        apiCall(option) {
            console.log(option);
            
            return fetch('/youtube-api', {
                method: 'POST',
                body: JSON.stringify(option),
                headers: {
                    'content-type': 'application/json'
                }
            }).then(response => response.json()).then(result => {
                return result;
            });
        },
        getParameters(url) {
            const match = url.match(/(\?|\&)([^=]+)([^&]+)/g);
            let params = {};
            for (i in match) {
                let current = match[i].split('=');
                params[current[0].match(/[^&?].*/g)[0]] = current[1];
            }
            return params;
        },
        isFullUrl(url) {
            return url.match(/www.youtube.com\//g)[0];
        },
        convertVideos() {

        },
        removeItem(item) {
            this.videoList.splice(this.videoList.indexOf(item), 1)

        },
        downloadItem(item){
            console.log({videoId:item.id});
            
            fetch('/download', {
                method: 'POST',
                body: JSON.stringify({videoData:item}),
                headers: {
                    'content-type': 'application/json'
                }
            }).then(response => response.json()).then(result => {
                item.downloadStatus = result; 
                this.checkProgress(item)                            
            });
        },
        checkProgress(item){
             
            fetch('/progress', {
                method: 'POST',
                body: JSON.stringify({videoData:item}),
                headers: {
                    'content-type': 'application/json'
                }
            }).then(response => response.json()).then(result => {
                item.downloadStatus = result;                             
            });
            console.log(item.downloadStatus.progress);
            
            if(item.downloadStatus.progress.percentage != 100){
                
                setTimeout(() => this.checkProgress(item), 2000);
            }
        },
        formatDuration(durationString) {
            return durationString.match(/[^A-Z]\d*/g).join(':');
        },
        round(num){
            return Math.round(num);
        }

    },
    mounted() {


    },

})