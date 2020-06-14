const express = require('express')
const app = express()
const mongoose = require('mongoose')

app.use(express.json())

const db = "mongodb+srv://mezen123:mezen123@vocaby-xrouw.mongodb.net/<dbname>?retryWrites=true&w=majority"
mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if(err) throw err
    console.log('Database connected...!')
})



app.use('/api/user', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/word', require('./routes/words'))



app.listen(5000, () => console.log('Server is listening on port 5000...'))