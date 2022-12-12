

console.log('Conncet to task form')
function getDuration(str_time, end_time) {

}


const responses = [];

function submitTaskStudio() {
    
    
    const form = document.getElementById('task_form_studio');
    const elements = form.elements;
    const startTime = elements['start-time-input'].value;
    const endTime = elements['end-time-input'].value;
    const title = elements['task-title'].value;
    const types = elements['task-type'].value;
    const time = endTime - startTime;

    elements['video-link'].value = video.youtube_video_url + '&t=' + startTime + 's';
    const youtube_video_url = elements['video-link'].value;

    responses.push({
        title:title,
        time: time 
    })
    console.log('responses array: ');
    console.log(responses);

    return (responses);
    //form.submit();

}



async function submitResponse() {
    const rawResponse = await fetch('/tasks/add', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(responses)

      });
      const content = await rawResponse.json();

}





