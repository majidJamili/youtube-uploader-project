// 2. This code loads the IFrame Player API code asynchronously.
console.log('File connected...');
console.log(video);

var tag = document.createElement('script');
tag.src = "http://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[1];
console.log(firstScriptTag);

firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
        height: '315',
        width: '560',
        videoId: video.youtube_video_url,
        playerVars: {
            'controls': 1,
            'autoplay': 0
        },

    });

    document.getElementById('resume').onclick = function () {

        player.playVideo();

    };
    document.getElementById('pause').onclick = function () {
        player.pauseVideo();
        const endTimeInput = document.getElementById('end-time-id');
        endTimeInput.value = Math.round(player.getCurrentTime());
    };

    document.getElementById('add-task').onclick = function () {
        const startTime = document.getElementById('start-time-id');
        startTime.innerHTML = Math.round(player.getCurrentTime());
        const startTimeInput = document.getElementById('start-time-input');
        startTimeInput.value = Math.round(player.getCurrentTime());
        console.log(startTimeInput.value);
        player.pauseVideo();
        var currentTime = player.getCurrentTime();
        const taskList = document.getElementById('task-list');
        document.getElementById("myForm").style.display = "block";


        const item = document.createElement('li');
        item.innerHTML = currentTime;
        taskList.appendChild(item);


    }

}



function closeForm() {
    document.getElementById("myForm").style.display = "none";
}
function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeFlash() { document.getElementById("myFlashCard").style.display = "none"; }
function openFlash() { document.getElementById("myFlashCard").style.display = "block"; } 