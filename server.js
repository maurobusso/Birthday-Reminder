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

//set EJS for views    
app.set('view engine', 'ejs')

//Stati folder
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


// the get root checks if todays is someones birthday 
//and also count the number of element in the DB

app.get('/', async (request, response) => {
    const birthdays = await checkBirthdays(db)
    db.collection('friends').countDocuments()
    .then(count => {
        response.render('index.ejs', { count: count, birthdays: birthdays});
      })
      .catch(error => {
        console.error(error);
        response.render('index', { count: null, error: 'Failed to retrieve count' });
      });
    
})

async function checkBirthdays(db) {
    const today = new Date()
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    const todayDate = today.toLocaleDateString('en-US', options).replace(/\//g, '-')
    const dateParts = todayDate.split('-')
    const yyyyMmDd = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`
    
    const result = await db.collection('friends').find( {birthday: yyyyMmDd}).toArray()

    if (result.length > 0) {
        console.log('Today is the birthday of:', result.map(r => r.friendName).join(' , '))
        // Replace this console.log statement with your own alert or notification code
    } else {
        console.log('No birthdays today.')
    }

    return result
}


//this is to add a friend and a birthday date

app.post('/addBirthday', async(request, response) => {

    const friendName = request.body.friendName.toLowerCase()
    const friendSurname = request.body.friendSurname.toLowerCase()
    const birthday = request.body.birthday
    const existingFriends = await db.collection('friends').findOne({ $and: [ { friendName: friendName }, { friendSurname: friendSurname } ] })
    //const existingFriends = await db.collection('friends').findOne({ $and: [ { friendName: { $exists: true } }, { friendSurname: { $exists: true } }, { friendName: friendName }, { friendSurname: friendSurname } ] })
    
    //handles if there is no name or date
    if( friendName === '' || friendSurname === '' || birthday === '' ){
        //response.status(400).send('insert valid inputs')
        return
    }

    //handle if the name is alredy in the database
    if( existingFriends !== null ){
        response.status(400).send('someone with that name already exist')
        return
    }else{

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
        friendSurname: friendSurname,
        birthday: birthday, 
        age: calcAge(birthday)
    }

    db.collection('friends').insertOne(document)
    
    .then(result => {
        console.log('Birthday Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
    }
})


// find a birthday by name 

app.get('/findBirthday/:name?/:surname?', (request, response) => {
    let name = request.params.name
    let surname = request.params.surname

    //check if name and surname are not undefinet then use lowercase and trim
    if (typeof name !== 'undefined') {
        name = name.toLowerCase().trim()
    }
    if (typeof surname !== 'undefined') {
        surname = surname.toLowerCase().trim()
    }

    // a better way to build the query would be to use an object like here
    const query = {}

    if (name) {
        query.friendName = { $regex: name || '', $options: 'i' }
    }
    if (surname) {
        query.friendSurname = { $regex: surname || '', $options: 'i' }
    }

    //this was the previus way of building the query (not very mantainable and clear)
    // db.collection('friends').findOne({ $and: [ { friendName: { $regex: name || '', $options: 'i' } }, { friendSurname: { $regex: surname || '', $options: 'i' } } ] })

    // check if name is present in DB it is been changed so that even partials strings will be valid
    // db.collection('friends').findOne({ $or: [ query, {} ] })

    db.collection('friends').findOne(query)


    .then(data => {
        if (data) {
            response.send( data )
            console.log('Birthday found')
        } else {
            response.send('No birthday found')
        }
    })
    .catch(error => console.error(error))
})

//sanitize input




// delete a birthday 

app.delete('/deleteFriend', (request, response) => {
    //console.log(request)
    db.collection('friends').deleteOne({friendName: request.body.friendName})
    .then(result => {
        console.log('Friend Deleted')
        response.json('Friend Deleted')
    })
    .catch(error => console.error(error))

})



// this is to display the full list of people in the databe

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


//update existing birthdays

app.post('/updateBirthday', async(request, response) => {
//might need the id of the document 
    response.send('updatedBd.ejs')
        
})



//listen on port ...

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})


//to fix
// when inserting a name and the wrog surname it still find the person with the same name 
//sometimes button value is null in main.js
//make the update path
//