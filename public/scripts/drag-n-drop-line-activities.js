const draggablesACT = document.querySelectorAll('.draggable'); 
const containersACT = document.querySelectorAll('.container-line-dragndrop');

function setAttributes(element, attributes){
          Object.keys(attributes).forEach(attr=>{
            element.setAttribute(attr,attributes[attr]);
          });
        }




// draggables.forEach(draggable=>{
//   draggable.addEventListener('dragend', function(){ 
//     //const form = document.querySelector('form');
//     // form.requestSubmit(); 
//     if (form.requestSubmit) {
//       form.requestSubmit();
//     } else {
//       form.submit();
//     }
//   });
// })



draggablesACT.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging')
    console.log('draggable parent', draggable.parentElement)
  })

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging')
  })
})

containersACT.forEach(container => {
  container.addEventListener('dragover', e => {
    e.preventDefault()
    const afterElement = getDragAfterElement(container, e.clientY)
    const draggable = document.querySelector('.dragging')
    if (afterElement == null) {
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
