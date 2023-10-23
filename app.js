const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const nodemon = require('nodemon');
const session = require('express-session');
const {v4: uuidv4} = require('uuid');
const app = express();
const Model = require('./model/schema');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}))
const methodOverride = require('method-override');
app.use(methodOverride('_method'))

app.get('/', (req, res)=>{
     res.render('home')
});
app.get('/user', (req, res)=>{
    res.render('contact')
});

app.get('/login', (req, res)=>{
    res.render('login')
});
app.post('/log', async (req, res)=>{
    try{
    const checkIfExists =await Model.findOne({email: req.body.email})
            console.log(checkIfExists);
           if(checkIfExists){
            req.session.user = req.body.email;
            res.redirect('dashboard')

           }else{
                res.send('email does not exit')
           }
} catch (e) {
  console.log(e);
}      
})
  app.get('/dashboard', (req, res) => {
    if(req.session.user){
        res.render('dashboard');
    }else {
        res.send('unauthorised user'); 
    }
});

    

  app.post('/users', async(req, res)=>{
    try{
    const checkIfExists = Model.findOne({Email: req.body.email})
            console.log(checkIfExists)
           if(checkIfExists===true){
            res.send(`This E-mail ${req.body.email} already exists. Please click this link to <a href= "/user">
            Sign up </a>   with another email `)
            }
                 const user = await new Model({
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email
                 })
                     user.save()
                        res.redirect('/login')
    }
                       catch(err){
                          console.log(err)
    }
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