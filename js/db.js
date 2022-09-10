// offline data
db.enablePersistence()
.catch(function(err) {
  if(err.code == 'failed-precondition') {
    // probable multiple tabs open
    console.log('presistence failed')
  } else if(err.code == 'unimplemented') {
    // lack of browser support
    console.log('persistence is not available')
  }
})

// real time listener
// when there's a change it takes a snapshot (like data in API calls)
// 'list' is the name of the collection in the firebase database
db.collection('list').onSnapshot((snapshot) => {
  snapshot.docChanges().forEach(change => {
   // console.log(change, change.doc.data(), change.doc.id)
    if(change.type === 'added') {
      // add doc to webpage
      renderList(change.doc.data(), change.doc.id)
      // console.log(data, id)
    }
    if(change.type === 'removed') {
      // remove doc from webpage
      removeItem(change.doc.id)
    }
  })
})

// add new item
const btnAdd = document.querySelector('.btn__add')
const inputText = document.querySelector('.input__text')
btnAdd.addEventListener('click', handleEvent)
inputText.addEventListener('keyCode === 13', handleEvent)

// TODO add department with the name of the item.
// TODO Similar to the recipe. Name (recipe title) dept (ingredients)

function handleEvent(e) {
  e.preventDefault()
  const newItem = {
    item: inputText.value,
  }

  db.collection('list').add(newItem)
  .catch(err => console.log(err))

  inputText.value = ''
}

// delete item
const listContainer = document.querySelector('.list');
listContainer.addEventListener('click', evt => {
  // console.log(evt.target.tagName) test this to target the tagName you want
  if(evt.target.tagName === 'I'){
    const id = evt.target.getAttribute('data-id')
    console.log(id)
    db.collection('list').doc(id).delete()
  }
})