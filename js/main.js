const list = document.querySelector('.list')
const item = document.querySelectorAll('.item')
const container = document.querySelectorAll('.card__container')

const renderList = (data, id) => {
  const newItem = `
    <div class="card__container">
    <div class="card item" data-id="${id}" draggable="true">
        <div class="card__title">${data.item}</div>
        <div class="btn__delete">
          <i class="fa-regular fa-trash-can icon__delete" data-id="${id}"></i>
        </div>
      </div>
    </div>
  `
  list.innerHTML += newItem
}

// remove item from DOM
const removeItem = (id) => {
  console.log('remove item triggered');
  const list = document.querySelector(`.list[data-id=${id}]`)
  list.remove()
}

new Sortable(list, {
  animation: 300
})