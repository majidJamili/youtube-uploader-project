


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
/// clean the tasks form; being called withing posting response function
function cleanTaskForm(){ 
    document.getElementById('task_form_studio').reset(); 

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


    statusID.classList.add(pickStatusClass(status));
    statusID.classList.add('fa-solid');
    statusID.classList.add('fa-circle');
    taskDIV.appendChild(statusID);
    // Time Container
    const timeDIV = document.createElement('div');
    timeDIV.innerHTML = time;
    timeDIV.classList.add('task-time');
    taskDIV.appendChild(timeDIV);

    // attached other data: 







    container.appendChild(taskDIV);
    updateDragList()






}


// create UI task with hidden input of all data needed
function getDuration(start, end){
 
    if(start < end){
        duration = end - start
    }else{
        duration = 0
    }
    return duration; 
}

function createDataResponsebyList() {

    //TASK CONTAINER UI
    const container = document.getElementById('task-panel-container');
    const taskDIV = document.createElement('div');
    taskDIV.classList.add('draggable');
    taskDIV.classList.add('task');
    taskDIV.setAttribute('draggable', true);

    //FORM 
    const form = document.getElementById('task_form_studio');
    const elements = form.elements; 
    
    //CREATE  TITLE:
    const title = document.createElement('input'); 
    title.setAttribute('type' , 'hidden'); 
    title.setAttribute('name' , 'title'); 
    title.value = elements['task-title'].value.toUpperCase();
    taskDIV.appendChild(title);
    //CREATE  TIME:
    const time = document.createElement('input'); 
    time.setAttribute('type' , 'hidden');
    time.setAttribute('name' , 'time'); 
    const startTime = elements['start-time-input'].value;
    const endTime = elements['end-time-input'].value;
    time.value = getDuration(startTime, endTime); 
    taskDIV.appendChild(time);

    //CREATE  TYPES:
     const types = document.createElement('input'); 
     types.setAttribute('type' , 'hidden');
     types.setAttribute('name' , 'types'); 
     types.value = elements['task-type'].value;
     taskDIV.appendChild(types);

    //CREATE  youtube_video_url:
    const youtube_video_url = document.createElement('input'); 
    youtube_video_url.setAttribute('type' , 'hidden');
    youtube_video_url.setAttribute('name' , 'youtube_video_url'); 
    youtube_video_url.value = video.youtube_video_url + '&t=' + startTime + 's';
    taskDIV.appendChild(youtube_video_url);




         //TITLE UI
         const titleUI = document.createElement('p');
         titleUI.innerHTML = title.value; 
         taskDIV.appendChild(titleUI);

          //STATUS UI
        const statusUI = document.createElement('i');
        statusUI.classList.add(pickStatusClass(types.value));
        statusUI.classList.add('fa-solid');
        statusUI.classList.add('fa-circle');
        taskDIV.appendChild(statusUI);
        // TIME UI

        const timeUI = document.createElement('div');
        timeUI.innerHTML = time.value;
        timeUI.classList.add('task-time');
        taskDIV.appendChild(timeUI);
    




         container.appendChild(taskDIV); 
         updateDragList()
         cleanTaskForm()

    
    
    
}

//Exctracting the hidden values from the available tasks on the list and make them
//relocatbales

function extractResponse(){

    const container = document.getElementById('task-panel-container');
    const availableTask = container.querySelectorAll('.task'); 
    availableTask.forEach(task => {
        const inputs = task.querySelectorAll('input');
            var response = {
                    title: inputs[0].value,
                    time: inputs[1].value,
                    types: inputs[2].value,
                    youtube_video_url: inputs[3].value
                }
               
                responses.push(response)

        // console.log('each task', task)
        
    });
    //emptyTaskContainer()    
    console.log('all New Responses', responses)
}

// this sends all the create tasks to the server side: 
async function submitResponse() {
    extractResponse()
    console.log('information to submit', responses)
    const rawResponse = await fetch('/tasks/add' ,
        {
        method: 'POST',
        body: paramsDB,
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({id: paramsDB,
                                           data:responses})

      });
      const content = await rawResponse.json();
      console.log('reponse to DB')
      return content; 


}
function submitTasks(){
    submitResponse()
    emptyTaskContainer()
}





//this delete the task once dropping is done: 

function emptyTaskContainer(){
    const binContainer = document.getElementById('task-panel-container'); 
    binContainer.innerHTML =''; 
    console.log('this is the cleaning functin and reponse is: ', responses)

    while(responses.length>0){
        responses.pop()
    }
    console.log('responses after deletion: ', responses)

}

function emptyBin(){
    const binContainer = document.getElementById('task-panel-container-delete'); 
    binContainer.innerHTML =''; 
}


/// 
function changeCSS(){
    const binContainer = document.getElementById('task-panel-container-delete'); 
    binContainer.classList.add('delete-dragover-drop')
}





function closeFlash() { document.getElementById("myFlashCard").style.display = "none"; }
function openFlash() { document.getElementById("myFlashCard").style.display = "block"; } 

function closeFlashSec() { document.getElementById("myFlashCardSecond").style.display = "none"; }
function openFlashSec() { document.getElementById("myFlashCardSecond").style.display = "block"; } 
