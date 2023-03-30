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


app.get('/',(request, response)=>{
    db.collection('friends').find().sort({likes: -1}).toArray()
    .then(data => {
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})


app.post('/addBirthday', (request, response) => {
    db.collection('friends').insertOne({friendName: request.body.friendName,
    birthday: request.body.birthday, likes: 0})
    .then(result => {
        console.log('Birthday Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//--------------------

app.get('/findBirthday/:name', (request, response) => {
    const name = request.query.name
    // check if name is present in DB
    db.collection('friends').findOne({friendName: name})
    .then(data => {
        console.log(data)
        response.render('index.ejs', {info: data})
        console.log('Birthday found')
        //response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/addOneLike', (request, response) => {
    db.collection('rappers').updateOne({stageName: request.body.stageNameS, birthName: request.body.birthNameS,likes: request.body.likesS},{
        $set: {
            likes:request.body.likesS + 1
          }
    },{
        sort: {_id: -1},
        upsert: true
    })
    .then(result => {
        console.log('Added One Like')
        response.json('Like Added')
    })
    .catch(error => console.error(error))

})


app.delete('/deleteRapper', (request, response) => {
    db.collection('rappers').deleteOne({stageName: request.body.stageNameS})
    .then(result => {
        console.log('Rapper Deleted')
        response.json('Rapper Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

//-----------------

app.get('/seeListBirthdays', (request, response) => {
    db.collection('friends').find().toArray()
      .then(data => {
        console.log(data)
        response.render('index.ejs', {info: data})
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error retrieving data from database');
      });
  });