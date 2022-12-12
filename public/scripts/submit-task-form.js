
console.log('Conncet to task form')
console.log('video data', video._id)

function getDuration(str_time, end_time) {

}


var  responses = [];

function submitTaskStudio() {   
    
    const form = document.getElementById('task_form_studio');
    const elements = form.elements;
    const startTime = elements['start-time-input'].value;
    const endTime = elements['end-time-input'].value;
    const time = endTime - startTime; 
    const title = elements['task-title'].value;
    const types = elements['task-type'].value;
    elements['video-link'].value = video.youtube_video_url + '&t=' + startTime + 's';
    const youtube_video_url = elements['video-link'].value;

    responses.push({
        title: title,
        time: time,
        types: types,
        youtube_video_url: youtube_video_url
    })
    return (responses);
}


function nullResponses(arr){
    var arr = []; 
}



const paramsDB = video._id; 


async function submitResponse() {
    const rawResponse = await fetch('/tasks/add' ,
        {
        method: 'POST',
        body: paramsDB,
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({id: paramsDB,
                                           data:submitTaskStudio()})

      });
      
      const content = await rawResponse.json();
      return content; 
      console.log(content); 


}







