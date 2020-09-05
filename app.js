const express = require('express')
const app = express()
const fs = require('fs')
const { config } = require('process')
const crypto = require('crypto')
const filename = './db.json'

app.use(express.urlencoded({ extended: false }))// server to understand what app data is
app.use(express.json())
app.use(express.static(__dirname))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html') //returns the absoute path of index.html
})


app.post('/signup', (req, res) => {


    let userDetails = req.body
    let data = fs.readFileSync(filename)
    let db = JSON.parse(data)

    db.users.forEach(user => {
        
        if (userDetails.email === user.email) {
            res.send('Email Id already exists!')
            return
        }
    })
    userDetails.password = crypto.createHash('sha256').update(userDetails.password).digest("hex")
    db.users.push(userDetails)

    fs.writeFile(filename, JSON.stringify(db, null, '\t'), (err) => {
        if (err) console.log(err)
        res.send('Signup Successful!')
    })
})

app.post('/login', (req, res) => {

    let userDetails = req.body
    let data = fs.readFileSync(filename)
    let db = JSON.parse(data)

    db.users.forEach(user => {
        
        if (userDetails.email === user.email) {
            if(crypto.createHash('sha256').update(userDetails.password).digest("hex") === user.password){
                res.send(`Login successful! Welcome ${user.name}! <br> Your email is ${user.email}.`)
            }
            else{
                res.send('Password Incorrect!')
            }
        }
    })
    res.send('Email not found!')     
    
})

app.listen(4000, () => console.log('Server is running'))