
function submitEditForm(){
    const form = document.getElementById('edit-form-collapsible'); 

    form.submit(); 
    document.getElementById("myFlashCardSecond").style.display = "none"; 
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}
function openForm() {
    document.getElementById("myForm").style.display = "block";
}







function closeFlash() { document.getElementById("myFlashCard").style.display = "none"; }
function openFlash() { document.getElementById("myFlashCard").style.display = "block"; } 

function closeFlashSec() { document.getElementById("myFlashCardSecond").style.display = "none"; }
function openFlashSec() { document.getElementById("myFlashCardSecond").style.display = "block"; } 