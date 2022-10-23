//先取得網址字串，假設此頁網址為「index.aspx?id=U001&name=GQSM」
var url = location.href;

//再來用去尋找網址列中是否有資料傳遞(QueryString)
if (url.indexOf('?') != -1) {
    var source = "";
    //在此直接將各自的參數資料切割放進ary中
    var ary = url.split('?')[1].split('&');
    //此時ary的內容為：
    //ary[0] = 'id=U001'，ary[1] = 'name=GQSM'

    //下迴圈去搜尋每個資料參數
    for (i = 0; i <= ary.length - 1; i++) {
        //如果資料名稱為id的話那就把他取出來
        if (ary[i].split('=')[0] == 'stream') {
            source = ary[i].split('=')[1];
            console.log(source);
        }

        if (ary[i].split('=')[0] == 'title') {
            title = ary[i].split('=')[1];
            console.log(decodeURI(title));
            document.querySelector('h1').innerText = '現正播出：' + decodeURI(title);
        }

        if (ary[i].split('=')[0] == 'format') {
            format = ary[i].split('=')[1];
        }
    }
}

const video = document.querySelector("#player"); // 定義影片、音源播放位置
// 呼叫出 plyr 播放器
const player = new Plyr(video, {
    captions: {
        active: true,
        update: true,
        language: "en"
    },
    controls: ["play"],
    tooltips: {
        controls: true,
        seek: true
    },
    i18n: {
        play: '播放',
        pause: '暫停',
    }
});

if (format == 'hls') {
    const hls = new Hls();
    hls.loadSource(source);
    hls.attachMedia(video);
    window.hls = hls;
    player.on("languagechange", () => {
        setTimeout(() => (hls.subtitleTrack = player.currentTrack), 50);
    });
} else {
    video.src = source;
}