const deleteText = document.querySelectorAll('.fa-user-minus')
const updateText = document.querySelectorAll('.fa-pen-to-square')

Array.from(deleteText).forEach((element)=>{
    element.addEventListener('click', deleteBirthday)
})

Array.from(updateText).forEach((element)=>{
    element.addEventListener('click', updateBirthday)
})

async function deleteBirthday(){
    const friendName = this.parentNode.childNodes[5].innerText.slice(6)
    const birthday = this.parentNode.childNodes[7].innerText.slice(5)
    const age = this.parentNode.childNodes[9].innerText.slice(5)
    try{
        //fetch to the server to grab the name of who i want to delete
        //deleteFriend is the rout that is in the server side
        const response = await fetch('deleteFriend', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'friendName': friendName,
              'birthday': birthday,
              'age': age
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}


//update existing birthdays

async function updateBirthday(){
    console.log('updated')
    try{
    const response = await fetch('updateBirthday')

    }catch(err){
        console.log(err)
    }
}


// find birthday by name or surname 

const form = document.getElementById('form')
const resultDiv = document.getElementById('result')
const findBd = document.getElementById('findBd-btn')
findBd.addEventListener('click', findFriend)

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
    
    // //handle if no input are present
    // if (friendName === '' && friendSurname === '') {
    //     // The input field is empty or contains only whitespace
    //     resultDiv.innerText = 'Please enter a valid name'
    //     return
    // }

    // //handle if only name is present
    // if( friendName && !friendSurname ){
    //     try{
    //         const response = await fetch(`/findBirthday/${friendName}`)

    //         //this makes sure the response always json
    //         const data = await response.json()
    //         console.log(data)

    //         if (data.error) {
    //             resultDiv.innerText = data.error

    //         }else { 
    //             resultDiv.innerText = ` Name: ${data.friendName}
    //                                     Surname: ${data.friendSurname} 
    //                                     Birthday: ${data.birthday}
    //                                     Age: ${data.age} `
                
    //             console.log('Birthday found')
    //         }

    //     }catch(err){
    //         console.log(err)
    //     }
    //     return
    // }

    // //handle if only surname is present
    // if( !friendName && friendSurname ){
    //     try{
    //         const response = await fetch(`/findBirthday/${friendSurname}`)

    //         //this makes sure the response always json
    //         const data = await response.json()
    //         console.log(data)

    //         if (data.error) {
    //             resultDiv.innerText = data.error

    //         }else { 
    //             resultDiv.innerText = ` Name: ${data.friendName}
    //                                     Surname: ${data.friendSurname} 
    //                                     Birthday: ${data.birthday}
    //                                     Age: ${data.age} `
                
    //             console.log('Birthday found')
    //         }

    //     }catch(err){
    //         console.log(err)
    //     }
    //     return
    // }
    
    // if( friendName && friendSurname ){
    //     try{
    //         //fetch to the server to grab the name of who i want to delete
    //         //deleteFriend is the rout that is in the server side
    //         const response = await fetch(`/findBirthday/${friendName}/${friendSurname}`)
            
    //         //this makes sure the response always
    //         const data = await response.json()
    //         console.log(data)

    //         if (data.error) {
    //             resultDiv.innerText = data.error

    //         }else { 
    //             resultDiv.innerText = ` Name: ${data.friendName}
    //                                     Surname: ${data.friendSurname} 
    //                                     Birthday: ${data.birthday}
    //                                     Age: ${data.age} `
                
    //             console.log('Birthday found')
    //         }

    //     }catch(err){
    //         console.log(err)
    //     }
    // }
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