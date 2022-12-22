
function closeForm() {
    document.getElementById("myForm").style.display = "none";
}
function openForm() {
    document.getElementById("myForm").style.display = "block";
}

document.getElementById('end-time-input').oninput = function (){
    var max = parseInt(this.max); 

    if(parseInt(this.value)> max){
        this.value = max; 
        document.getElementById('end-time-warning').innerHTML = 'END TIME EXCEEDS VIDEO DURATION'
    }else{
        document.getElementById('end-time-warning').innerHTML = ''

    }

}

function closeFlash() { document.getElementById("myFlashCard").style.display = "none"; }
function openFlash() { document.getElementById("myFlashCard").style.display = "block"; } 

function closeFlashSec() { document.getElementById("myFlashCardSecond").style.display = "none"; }
function openFlashSec() { document.getElementById("myFlashCardSecond").style.display = "block"; } 