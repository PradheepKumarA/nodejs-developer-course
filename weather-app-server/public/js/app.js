
const formElement = document.querySelector('form');
const searchField = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');

formElement.addEventListener('submit', (e) => {
    e.preventDefault();

    let searchText = searchField.value;

    fetch('/weather?search=' + searchText).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error;
                messageTwo.textContent = '';
            } else {
                messageOne.textContent = data.place;
                messageTwo.textContent = data.forcast;
            }
        })
    })
})
