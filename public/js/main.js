const deleteText = document.querySelectorAll('.fa-user-minus')
const updateText = document.querySelectorAll('.fa-pen-to-square')

Array.from(deleteText).forEach((element)=>{
    element.addEventListener('click', deleteBirthday)
})

Array.from(updateText).forEach((element)=>{
    element.addEventListener('click', updateBirthday)
})

//fix delete because html has changed 
async function deleteBirthday(){

    const friendName = this.closest('li').querySelector('.friend-name').textContent
    const surname = this.closest('li').querySelector('.surname').textContent
    const birthday = this.closest('li').querySelector('.birthday').textContent
    const age = this.closest('li').querySelector('.age').textContent
    try{
        //fetch to the server to grab the name of who i want to delete
        //deleteFriend is the rute that is in the server side
        const response = await fetch('deleteFriend', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'friendName': friendName,
                'friendSurname': surname,
                'birthday': birthday,
                'age': age
            })
          })
        console.log(friendName, surname, birthday, age)
        const data = await response.json()
        location.reload()
    }catch(err){
        console.log(err)
    }
}


//update existing birthdays

async function updateBirthday(){
    const friendId = this.closest('li').querySelector('.id').textContent
    console.log('updated')
    try{
        const response = await fetch(`updateBirthday/${friendId}`, {
            method: postMessage,
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({friendId})
        })
    }catch(err){
        console.log(err)
    }
}


// find birthday by name or surname 

const form = document.getElementById('form')
const resultDiv = document.getElementById('result')
const findBd = document.getElementById('findBd-btn').addEventListener('click', findFriend)

form.addEventListener('submit', (event) => {
    event.preventDefault()
})

async function findFriend(){
    const friendName = document.getElementById('friendName').value.toLowerCase().trim()
    const friendSurname = document.getElementById('friendSurname').value.toLowerCase().trim()

    //handle if no input are present or contains only whitespace
    if (friendName === '' && friendSurname === '') {
        resultDiv.innerText = 'Please enter a valid name'
        return
    }

    const url = `/findBirthday/${friendName}/${friendSurname ? friendSurname : ''}`

    try{
        const response = await fetch(url)

        //this makes sure the response always json
        const data = await response.json()
        console.log(data)

        if (data.error) {
            resultDiv.innerText = data.error

        }else { 
            resultDiv.innerText = ` Name: ${data.friendName}
                                    Surname: ${data.friendSurname} 
                                    Birthday: ${data.birthday}
                                    Age: ${data.age} `
            
            console.log('Birthday found')
        }

    }catch(err){
        console.log(err)
    }
}

const inputErrorDiv = document.getElementById('inputError')
const addBdBtn = document.getElementById('add-btn')
addBdBtn.addEventListener('click', addBd)

async function addBd() {
    const friendName = document.getElementById('addName').value.toLowerCase().trim()
    const friendSurname = document.getElementById('addSurname').value.toLowerCase().trim()
    const dateBd = document.getElementById('dateBd').value

    if (friendName === '' || friendSurname === '' || dateBd === '' ) {
        // The input field is empty or contains only whitespace
        inputErrorDiv.innerText = 'Please enter a valid Name/Date'
    }
}