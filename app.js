const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const nodemon = require('nodemon');
const app = express();
const Model = require('./model/schema');
const session = require('express-session');
const {v4:uuidv4} = require('uuid');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: uuidv4(),
  resave: true,
  saveUninitialized: true
}))

app.get('/', (req, res)=>{
     res.render('home')
});
app.get('/users', (req, res)=>{
    res.render('contact')
});

app.get('/login', (req, res)=>{
    res.render('login')
});


  app.post('/register', async(req, res)=>{
    try{
        const ifExists = await Model.findOne({email: req.body.email})   
        if(ifExists){
            res.send(`This Email: ${req.body.email} is already existing. Please choose another email <a href="/users">Sign up</a>`);
        }
              const user = await Model.create({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
              })
                    res.redirect('/login')
                }
                  catch(err){
                          console.log(err)
                          res.redirect('/users')
    }
})

app.post('/log', async(req, res) => {
    const ifUserExist =  await Model.findOne({email: req.body.email}, {email: req.body.password})
    if(ifUserExist){
        req.session.user = req.body.email
        res.redirect('/dashboard')
    } else {
        res.send("invalid user");
    }
})

app.get('/dashboard', (req, res) => {
    if(req.session.user){
        res.render('dashboard', { user: req.session.user})

    }else{
        res.send("unauthorized user")
    }
})
app.get('/logout', (req, res) => {
    req.session.destroy(function(err) {
        if(err){
            console.log(err)
            res.send('Error')
        }else{
            res.render('base', {title: 'Express', logout: 'Logout Sucessfully'})
        }
    }) 
})

 app.post('/task', async(req, res)=>{
    try{ 
        const task =await Model.create({
            taskName: req.body.taskName,
   
        })
        if(task){
           
            res.redirect('/task')
         }
        } catch(err){
        console.log(err)    
     }
})

app.get('/task', async(req, res)=>{
    try{
   const tasks = await Model.findOne({taskName: req.body.taskName});
    res.render('taskboard', { tasks})
    }catch(err){
        console.log(err)
    }      
})     
     

 



const uri = "mongodb+srv://kenny:kay.12@projects.dnjyzrl.mongodb.net/ASSIGN"
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