const findBirthday = document.getElementById('button')
const deleteText = document.querySelectorAll('.fa-user-minus')
const updateText = document.querySelectorAll('.fa-pen-to-square')

Array.from(deleteText).forEach((element)=>{
    element.addEventListener('click', deleteBirthday)
})

Array.from(updateText).forEach((element)=>{
    element.addEventListener('click', updateBirthday)
})

async function deleteBirthday(){
    console.log('done')

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


async function updateBirthday(){
    console.log('updated')
    // const sName = this.parentNode.childNodes[1].innerText
    // const bName = this.parentNode.childNodes[3].innerText
    // const tLikes = Number(this.parentNode.childNodes[5].innerText)
    // try{
    //     const response = await fetch('addOneLike', {
    //         method: 'put',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify({
    //           'stageNameS': sName,
    //           'birthNameS': bName,
    //           'likesS': tLikes
    //         })
    //       })
    //     const data = await response.json()
    //     console.log(data)
    //     location.reload()

    // }catch(err){
    //     console.log(err)
    // }
}

// try to make the find birthday work 
const resultDiv = document.getElementById('result');
const friendName = document.getElementById('friendName')
findBirthday.addEventListener('click', findBd)

async function findBd(){
    console.log('clicked')
    const name = friendName.vlaue
    console.log(name)
    try{
        //fetch to the server to grab the name of who i want to delete
        //deleteFriend is the rout that is in the server side
        const response = await fetch(`findBirthday/${name}`, {
            method: 'get',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: JSON.stringify({
              'friendName': name,
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

