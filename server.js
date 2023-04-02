const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'birthday'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// app.get('/',(request, response)=>{
//     db.collection('friends').find().sort().toArray()
//     .then(data => {
//         response.render('index.ejs', { info: data })
//     })
//     .catch(error => console.error(error))
// })

app.get('/',(request, response) => {
    db.collection('friends').countDocuments()
    .then(count => {
        // console.log('Count:', count);
        response.render('index.ejs', { count: count});
      })
      .catch(error => {
        console.error(error);
        response.render('index', { count: null, error: 'Failed to retrieve count' });
      });
    
})

//this is to add a friend and a birthday date

app.post('/addBirthday', async(request, response) => {

    const friendName = request.body.friendName
    const birthday = request.body.birthday
    const existingFriends = await db.collection('friends').findOne({friendName: friendName})
    
    //handles if there is no name or date
    if( !friendName || !birthday ){
        response.status(400).send('insert valid inputs')
        return
    }
    //handle if the name is alredy in the database

    if( existingFriends !== null ){
        response.status(400).send('same name already exist')
        return
    }

    // this function will calculate the age of a person

    function calcAge(birthday) {
        // Parse birthdate string into Date object
        const dob = new Date(birthday);
      
        // Calculate time difference in milliseconds between dob and today's date
        const diffMs = Date.now() - dob.getTime();
      
        // Convert time difference to years
        const ageDate = new Date(diffMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        
        return age
      }

    const document = {
        friendName: friendName,
        birthday: birthday, 
        age: calcAge(birthday)
    }

    db.collection('friends').insertOne(document)
    
    .then(result => {
        console.log('Birthday Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//--------------------

app.get('/findBirthday/:name', (request, response) => {
    const name = request.params.name.toLowerCase()

    //handle if no input is given
    if(name == ''){
        response.status(400).send('insert valid name')
        return
    }
    // check if name is present in DB
    db.collection('friends').findOne({friendName: name})
    .then(data => {
        console.log(data)
        if (data) {
            response.send( data )
            console.log('Birthday found')
        } else {
            response.send('No birthday found')
        }
        //response.redirect('/')
    })
    .catch(error => console.error(error))
})



// app.put('/addOneLike', (request, response) => {
//     db.collection('rappers').updateOne({stageName: request.body.stageNameS, birthName: request.body.birthNameS,likes: request.body.likesS},{
//         $set: {
//             likes:request.body.likesS + 1
//           }
//     },{
//         sort: {_id: -1},
//         upsert: true
//     })
//     .then(result => {
//         console.log('Added One Like')
//         response.json('Like Added')
//     })
//     .catch(error => console.error(error))

// })

// delete a birthday 

app.delete('/deleteFriend', (request, response) => {
    console.log(request)
    db.collection('friends').deleteOne({friendName: request.body.friendName})
    .then(result => {
        console.log('Friend Deleted')
        response.json('Friend Deleted')
    })
    .catch(error => console.error(error))

})

//listen on port ...

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})


// htis is to display the full list of people in the databe

app.get('/seeListBirthdays', (request, response) => {
    //this sort order the friend from youngest
    db.collection('friends').find().sort({age: +1}).toArray()
      .then(data => {
        response.render('list.ejs', {friend: data})
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error retrieving data from database');
      });
  });