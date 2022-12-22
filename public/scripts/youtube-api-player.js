var tag = document.createElement('script');
tag.id = 'iframe-demo';
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[1];



// console.log('data video: ')
// console.log(video)


firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('existing-iframe-example', {
      playerVars: {
          'controls': 0,
          'autoplay': 0          
        },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }, 
  });

  

        document.getElementById('seek-video').onclick = function(){
            const currentTime = Math.round(player.getCurrentTime()); 
            player.seekTo(currentTime + 30 , true); 
        };
        document.getElementById('pause').onclick = function(){
          player.pauseVideo();
        };
        document.getElementById('play').onclick = function(){
          player.playVideo();
        };
        document.getElementById('seek-back').onclick = function(){
          const currentTime = Math.round(player.getCurrentTime()); 
          player.seekTo(currentTime - 5 , true); 
      };
      document.getElementById('add-task').onclick = function(){
        player.pauseVideo();
        var currentTime = Math.round(player.getCurrentTime()); 
        document.getElementById('myFlashCard').style.display ="block";     
        const startTimeInput = document.getElementById('start-time-input'); 
        startTimeInput.value = currentTime
    };
    document.getElementById('stop-task').onclick = function(){
      player.pauseVideo();
      var currentTime = Math.round(player.getCurrentTime());   
      const startTimeInput = document.getElementById('end-time-input'); 
      startTimeInput.value = currentTime
  };
  document.getElementById('start-time-input').addEventListener("input", (event)=>{
    player.seekTo(document.getElementById('start-time-input').value)
  })
  document.getElementById('end-time-input').addEventListener("input", (event)=>{
    player.seekTo(document.getElementById('end-time-input').value)
  })

}


function onPlayerReady(event) {
  console.log('input value', document.getElementById('end-time-input').max)

  document.getElementById('end-time-input').max = player.getDuration(); 
    // console.log('event data'); 
    // console.log(event); 
  //document.getElementById('existing-iframe-example').style.borderColor = '#FF6D00';
}
function changeBorderColor(playerStatus) {
                var color;
                // if (playerStatus == -1) {
                //     color = "#37474F"; // unstarted = gray
                // } else if (playerStatus == 0) {
                //     color = "#FFFF00"; // ended = yellow
                // } else if (playerStatus == 1) {
                //     color = "#33691E"; // playing = green
                // } else if (playerStatus == 2) {
                //     color = "#DD2C00"; // paused = red
                // } else if (playerStatus == 3) {
                //     color = "#AA00FF"; // buffering = purple
                // } else if (playerStatus == 5) {
                //     color = "#FF6DOO"; // video cued = orange
                // }
                // if (color) {
                //     document.getElementById('existing-iframe-example').style.borderColor = color;
                // }
}
function getOnreadyStatus(event){

}

function onPlayerStateChange(event) {
  changeBorderColor(event.data);
}




// var tag = document.createElement('script');
// tag.id = 'iframe-demo';
// tag.src = 'https://www.youtube.com/iframe_api';
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// var player;
// function onYouTubeIframeAPIReady() {
//   player = new YT.Player('existing-iframe-example', {
//     //   events: {
//     //     'onReady': onPlayerReady,
//     //     'onStateChange': onPlayerStateChange
//     //   }
//   });

//         document.getElementById('seek-video').onclick = function(){
//             const currentTime = Math.round(player.getCurrentTime()); 
//             player.seekTo(currentTime + 30 , true); 
//         };
//         document.getElementById('pause').onclick = function() {
//           player.pauseVideo();

//       };
// }





// var tag = document.createElement('script');
// tag.id = 'iframe-demo';
// tag.src = 'https://www.youtube.com/iframe_api';
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// var player;
// function onYouTubeIframeAPIReady() {
//   player = new YT.Player('studio-iframe', {
//       // events: {
//       //   'onReady': onPlayerReady,
//       //   'onStateChange': onPlayerStateChange
//       // }
//   });

//     document.getElementById('pause').onclick = function(){
//         player.pauseVideo();
//         };
//     document.getElementById('seek-video').onclick = function(){
//           const currentTime = Math.round(player.getCurrentTime()); 
//           player.seekTo(currentTime + 30 , true); 
//       };


// }

                    // 3. This function creates an <iframe> (and YouTube player)
                    //    after the API code downloads.
// var player;
// function onYouTubePlayerAPIReady() {
//                         player = new YT.Player('player', {
//                             height: '315',
//                             width: '560',
//                             videoId: video.youtube_video_url,
//                             playerVars: {
//                                 'controls': 0,
//                                 'autoplay':0
//                               },
//                             events:{
//                                 'onReady': function(){document.getElementById('header-title').innerText="Project is being loaded ...!"},
//                                 'onStateChange':function(){document.getElementById('state').innerText="State is Changed"}
//                             }
                
//                         });

//                         document.getElementById('custom-function').onclick =function(){
//                             player.loadVideoById({
//                                 videoId: 'ymXrTrIbWsI',
//                                 'autoplay':0,
//                                 startSeconds:350,
//                                 endSeconds:450, 
//                                 suggestedQuality:'large'
//                             })
//                         };
//                         document.getElementById('seek-video').onclick = function(){
//                             player.seekTo(200, true); 
//                         };
//                         document.getElementById('smaller-video').onclick = function(){
//                             player.setSize({'width': 200,'height':250}); 
//                         };
//                         document.getElementById('bigger-video').onclick = function(){
//                             player.setSize({'width': 800,'height':800}); 
//                         };
//                         document.getElementById('duration-video').onclick = function(){
//                             player.getDuration(); 
//                             document.getElementById('header-title').innerText=player.getDuration(); 
                            
//                         };

//                         document.getElementById('resume').onclick = function() {  
//                             player.playVideo();
                            
//                         };
//                         document.getElementById('pause').onclick = function() {
//                             player.pauseVideo();
//                             const endTimeInput = document.getElementById('end-time-id'); 
//                             endTimeInput.value = player.getCurrentTime(); 
//                         };

//                         document.getElementById('add-task').onclick = function(){
//                             player.pauseVideo(); 
//                             var currentTime = player.getCurrentTime(); 
//                             const taskList = document.getElementById('task-list'); 
//                             document.getElementById("myForm").style.display = "block";
//                             const startTimeInput = document.getElementById('start-time-id'); 
//                             startTimeInput.value = player.getCurrentTime(); 

//                             const item = document.createElement('li'); 
//                             item.innerHTML = currentTime; 
//                             taskList.appendChild(item); 


//                         }

//                     }

// function closeForm() {
//                         document.getElementById("myForm").style.display = "none";
//                       }