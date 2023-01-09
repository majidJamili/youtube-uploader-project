const draggablesWC = document.querySelectorAll('.draggableWC'); 
const containersWC = document.querySelectorAll('.containerWC');
console.log('containersWC', containersWC)


function setAttributes(element, attributes){
          Object.keys(attributes).forEach(attr=>{
            element.setAttribute(attr,attributes[attr]);
          });
        }



function getWorkenterSequence(){
  const lineContainer = document.getElementById('line-container'); 
  for (let i = 0; i < lineContainer.children.length; i++) {
    const element = lineContainer.children[i].children[0].children[0];
    const sequence = lineContainer.children[i].children[0].children[1]; 

    console.log('sequence', sequence)

    sequence.innerHTML = i;
    element.innerHTML = "WC" + i; 
    
  }

}


draggablesWC.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging')
  })

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging')
    getWorkenterSequence()
  })
})

containersWC.forEach(container => {
  container.addEventListener('dragover', e => {
    e.preventDefault()
    const afterElement = getDragAfterElement(container, e.clientX)
    //console.log('e.clientY',e.clientY );
    const draggable = document.querySelector('.dragging')
    if (afterElement == null) {
      container.appendChild("child nodes: ", draggable.childNodes)
    } else {
      container.insertBefore(draggable, afterElement)
    }
  })
})

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggableWC:not(.dragging)')]

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect()
    const offset = y - box.left - box.width / 2
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }
    } else {
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
}
