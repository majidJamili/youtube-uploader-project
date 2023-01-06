const draggablesACT = document.querySelectorAll('.draggable'); 
const containersACT = document.querySelectorAll('.container-line-dragndrop');

function setAttributes(element, attributes){
          Object.keys(attributes).forEach(attr=>{
            element.setAttribute(attr,attributes[attr]);
          });
        }

draggablesACT.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.parentElement.parentElement.draggable=false
    draggable.parentElement.classList.remove("container-line-dragndrop")

    draggable.classList.add('dragging')

  })

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging')
    draggable.parentElement.parentElement.draggable=true
    draggable.parentElement.classList.add("container-line-dragndrop")





  })
})

containersACT.forEach(container => {
  container.addEventListener('dragover', e => {
    e.preventDefault()
    const afterElement = getDragAfterElement(container, e.clientY)
    const draggable = document.querySelector('.dragging')
    if (afterElement == null) {
      console.log("draggable inclusions: ", draggable)
      container.appendChild(draggable)
      
    } else {
      container.insertBefore(draggable, afterElement)
    }
  })
})

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect()
    const offset = y - box.top - box.height / 2
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }
    } else {
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
}
