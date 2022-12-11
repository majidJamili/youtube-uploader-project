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
    const type = elements['task-type'].value;
    const time = endTime - startTime;

    elements['video-link'].value = video.youtube_video_url + '&t=' + startTime + 's';
    const link = elements['video-link'].value;

    responses.push({
        startTime,
        endTime,
        title,
        type,
        link

    })
    console.log('responses array: ');
    console.log(responses);
    //return (responses);
    //form.submit();

}



function submitResponse() {


    const strResponses = responses;
    const resForm = document.getElementById('responses-form');
    const resInput = document.querySelector('#responses-id');
    resInput.value = strResponses;

    console.log(resInput.value);
    resForm.submit()
}




