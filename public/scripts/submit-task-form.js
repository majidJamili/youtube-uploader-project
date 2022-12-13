const paramsDB = video._id;
var responses = [];

function pickStatusClass(type){
    let x =  type;    
        switch (type) {
        case 'Value-adding':
            text = "status-success";
            break;
        case 'Non-value-adding':
            text = "status-non-value";
            break;
            case 'Essential':
                text = "status-essential";
            break;
            case 'Allowed Wait':
                    text = "status-wait";
            break;
            case 'Transport':
                        text = "status-transport";
            break;
            case 'Waste':
                            text = "status-waste";
            break;
        default:
            text = "status-undefined";
        }
        return text; 
}



// this creates the visial representation of the tasks on the client side:
function responseTaskUI(title, status, time) {



    const container = document.getElementById('task-panel-container');
    const taskDIV = document.createElement('div');
    taskDIV.classList.add('draggable');
    taskDIV.classList.add('task');
    taskDIV.setAttribute('draggable', true);
    const titleP = document.createElement('p');
    titleP.innerHTML = title.toUpperCase(); 
    taskDIV.appendChild(titleP);

    //status containers
    const statusID = document.createElement('i');
    console.log('status', status)
    console.log('class', pickStatusClass(status))
    statusID.classList.add(pickStatusClass(status));




    statusID.classList.add('fa-solid');
    statusID.classList.add('fa-circle');

    taskDIV.appendChild(statusID);

    // Time Container
    const timeDIV = document.createElement('div');
    timeDIV.innerHTML = time;
    timeDIV.classList.add('task-time');
    taskDIV.appendChild(timeDIV);

    container.appendChild(taskDIV);
    updateDragList()






}
// this function creates a task 

function createTask() {   
    
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
    //updateDragList()


    responses.push({
        title: title,
        time: time,
        types: types,
        youtube_video_url: youtube_video_url
    })
    return (responses);

}


// this sends all the create tasks to the server side: 
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
                                           data:createTask()})

      });
      
      const content = await rawResponse.json();
      return content; 
      console.log(content); 


}







function closeFlash() { document.getElementById("myFlashCard").style.display = "none"; }
function openFlash() { document.getElementById("myFlashCard").style.display = "block"; } 

function closeFlashSec() { document.getElementById("myFlashCardSecond").style.display = "none"; }
function openFlashSec() { document.getElementById("myFlashCardSecond").style.display = "block"; } 
