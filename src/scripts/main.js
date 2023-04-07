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
        }

        if (ary[i].split('=')[0] == 'title') {
            title = ary[i].split('=')[1];
            document.querySelector('h2.radio-title').innerText = decodeURI(title);
        }

        if (ary[i].split('=')[0] == 'format') {
            format = ary[i].split('=')[1];
        }

        if (ary[i].split('=')[0] == 'img') {
            img = ary[i].split('=')[1];
            document.querySelector('#radio-img').setAttribute('src', 'https://diantai.yuslife.cc' + img);
        }

        if (ary[i].split('=')[0] == 'frequency') {
            frequency = ary[i].split('=')[1];
            document.querySelector('.fm').innerText = decodeURI(frequency);
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

function openWindow(item) {
    if (item === 'Countdown') {
        $('#forCountdown').removeClass('hidden');
    }
}

function closeWindow(item) {
    if (item === 'Countdown') {
        $('#forCountdown').addClass('hidden');
    }
}

function toPlay() {
    navigator.mediaSession.metadata = new MediaMetadata({
        title: decodeURI(title),
        artist: 'DianTai 廣播線上聽',
        album: 'DianTai 廣播線上聽',
        artwork: [
            { src: 'https://diantai.yuslife.cc' + img, sizes: '300x300', type: 'image/jpeg' },
        ]
    });
    document.querySelector('.pause').classList.remove('btn-hidden');
    document.querySelector('.play').classList.add('btn-hidden');
    document.querySelector('.radio img').classList.add('plus-img');
    player.play();
}

function toPause() {
    AudioScheduledSourceNode.stop;    //  讓聲音停止
    player.pause();
    //  處理播放器圖示
    document.querySelector('.pause').classList.add('btn-hidden');
    document.querySelector('.play').classList.remove('btn-hidden');
    document.querySelector('.radio img').classList.remove('plus-img');
}

// Muted 靜音
function toMuted() {
    player.muted = true;
    //  處理圖示
    document.querySelector('.volume_off').classList.add('btn-hidden');
    document.querySelector('.volume_up').classList.remove('btn-hidden');
}

// No Muted 關閉靜音
function tonoMuted() {
    player.muted = false;
    document.querySelector('.volume_off').classList.remove('btn-hidden');
    document.querySelector('.volume_up').classList.add('btn-hidden');
}

// 睡眠定時器
function timeToSleep() {
    const times = $('#forCountdown > ul > li > input:checked').val();
    const dayToset = Date.now() + Number(times);
    $('#forCountdown p').countdown(dayToset)
        .on('update.countdown', function (event) {
            var format = '%M 分 %S 秒';
            $(this).html('廣播將於 ' + event.strftime(format) + ' 後停止');
        })
        .on('finish.countdown', function (event) {
            $(this).html('請選擇時間');
            toPause();
        });
}