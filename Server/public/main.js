new Vue({
    el: '#app',
    data: {
        url: 'https://www.youtube.com/watch?v=Abdl-6RQ7q0',
        videoList: [],
        error: ''
    },
    methods: {
        addUrl() {
            this.error = '';
            this.getUrlDetails(this.url);
        },
        getUrlDetails(url) {
            console.log(this.isFullUrl(url));
            
            if (this.isFullUrl(url)) {
                let params = this.getParameters(url);

                if (params.list) {
                    this.apiCall({
                        playlistId: params.list
                    }).then(result => {
                        if (result.playlist) {
                            console.log(result)
                            this.videoList.push(result);
                        } else {
                            this.error = 'No Video Found.'
                        }
                    });

                }else if (params.v) {
                    console.log('fetching ' + params.v);
                    this.apiCall({
                        videoId: params.v
                    }).then(result => {
                        if (result.video) {                           
                            this.videoList.push(result);
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
        removeItem(item){
            this.videoList.splice(this.videoList.indexOf(item), 1)
            
        },
        formatDuration(durationString){
            return durationString.match(/[^A-Z]\d*/g).join(':');
        },

    },
    mounted() {


    },

})