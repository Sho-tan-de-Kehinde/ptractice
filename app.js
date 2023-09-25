const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const nodemon = require('nodemon');
const app = express();
const Model = require('./model/schema');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
const methodOverride = require('method-override');
app.use(methodOverride('_method'))

app.get('/', (req, res)=>{
     res.render('contact')
});


app.post('/users', (req, res)=>{
    const user = new Model(req.body)
    user.save()
    .then((result)=>{
        res.redirect('users')
    })
    .catch((err)=>{
        console.log(err)
    })
})


app.get('/users', (req, res)=>{
    const user = Model.find()
    .then((result)=>{
        res.render('index', {blogs: result})
    })
    .catch((err)=>{
        console.log(err)
    })
})
app.get('/users/:id', (req, res)=>{
    const id = req.params.id   
    Model.findById(id)
    .then((result)=>{
        res.render('dashboard', {blog: result})
    })
    .catch((err)=>{
        console.log(err)
    })
})


app.delete('/users/:id', (req, res)=>{
    const id = req.params.id   
   const user =Model.findById(id)
    user.deleteOne()
    .then((result)=>{
        res.render('team', {blog: result})
    })
    .catch((err)=>{
        console.log(err)
    })
})









const uri = "mongodb+srv://kenny:kenny.12@projects.dnjyzrl.mongodb.net/ASSIGN"
mongoose.connect(uri)
.then(()=>{
    app.listen(5500,()=>{
        console.log('listening on port 3000')
    })
    
    console.log('Database Connected')
})
.catch((err)=>{
    console.log(err)
})