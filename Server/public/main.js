new Vue({
    el: '#app',
    data: {
        url: 'https://www.youtube.com/watch?v=mZMLuJ0_BGA',
        videoList: [],
        error: '',
        loadingVideo: false,
    },
    methods: {
        addUrl() {
            console.log("add");

            this.error = '';

            this.getUrlDetails(this.url);
        },
        getUrlDetails(url) {
            if (!url) {
                this.error = 'Please enter a valid url.';
                return
            }
            this.loadingVideo = true;
            this.url = '';
            if (this.isFullUrl(url)) {
                let params = this.getParameters(url);

                if (params.v) {
                    for (let i = 0; i < this.videoList.length; i++) {
                        if (this.videoList[i].video.id == params.v) {
                            this.error = 'That video is already in the list.';
                            this.loadingVideo = false;
                            return;
                        }
                    }
                    console.log('fetching ' + params.v);
                    this.apiCall({
                        videoId: params.v
                    }).then(result => {
                        if (result.video) {
                            result.video.downloadStatus = "waiting";
                            this.videoList.unshift(result);
                            this.loadingVideo = false;
                        } else {
                            this.loadingVideo = false;
                            this.error = 'No Video Found.'
                        }
                    });
                } else {
                    this.loadingVideo = false;
                    this.error = 'No Video Found.'
                }
            } else {
                this.loadingVideo = false;
                this.error = 'Invalid Url.'
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
            return url.match(/www.youtube.com\//g)[0] ? true : false;
        },
        convertVideos() {

        },
        removeItem(item) {
            this.videoList.splice(this.videoList.indexOf(item), 1)

        },
        convertItem(item) {
            fetch('/convert', {
                method: 'POST',
                body: JSON.stringify({
                    videoData: item
                }),
                headers: {
                    'content-type': 'application/json'
                }
            }).then(response => response.json()).then(result => {
                item.downloadStatus = result;
                console.log(result);

                this.checkProgress(item)
            });
        },
        downloadItem(item) {
            fetch(`/download/?path=${item.downloadStatus.res.file}`, {
                method: 'GET',
            }).then(resp => resp.blob()).then(blob => {
                const url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = item.downloadStatus.res.title;
                document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                a.click();
                a.remove();
            });
        },
        checkProgress(item) {

            fetch('/progress', {
                method: 'POST',
                body: JSON.stringify({
                    videoData: item
                }),
                headers: {
                    'content-type': 'application/json'
                }
            }).then(response => response.json()).then(result => {
                item.downloadStatus = result;
            });
            console.log(item.downloadStatus);

            if (!item.downloadStatus.res) {

                setTimeout(() => this.checkProgress(item), 2000);
            }
        },
        formatDuration(durationString) {
            return durationString.match(/[^A-Z]\d*/g).join(':');
        }

    },
    mounted() {

    },

})