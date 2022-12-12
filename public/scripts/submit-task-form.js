const paramsDB = video._id;

var responses = [];


function responseTaskUI(title, status, time) {



    const container = document.getElementById('task-panel-container');
    const taskDIV = document.createElement('div');
    taskDIV.classList.add('draggable');
    taskDIV.classList.add('task');
    taskDIV.setAttribute('draggable', true);
    const taskTitlePara = document.createElement('p');
    const titleText = document.createTextNode(title);
    taskTitlePara.appendChild(titleText);
    taskDIV.appendChild(taskTitlePara);

    //status containers
    const statusDIV = document.createElement('div');
    statusDIV.classList.add('task-type-success');
    taskDIV.appendChild(statusDIV);

    // Time Container
    const timeDIV = document.createElement('div');
    timeDIV.innerText = time;
    timeDIV.classList.add('task-time');
    taskDIV.appendChild(timeDIV);

    container.appendChild(taskDIV);




}


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
    responseTaskUI(title, types, time)
    updateDragList()


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







