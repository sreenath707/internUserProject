const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const path = require('path');
const mongoose = require('mongoose');
const users = require('./models/userModel');
const jwt = require('jsonwebtoken');

const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

mongoose.connect('mongodb+srv://sreenath:1234@cluster0.x9z2p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log('databse connectedd!!!')})
.catch(e=>{console.log(e)});

app.use(express.static(path.join(__dirname,'css')));
app.use(express.urlencoded({ extended: true }));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));

let presentToken = '';

app.get('/',(req,res)=>{
    res.redirect('/signup');
})

app.get('/signup',(req,res)=>{
  res.render('signup.ejs',{thisError : false});
})

app.get('/home',verifyToken,(req,res)=>{
    res.send(req.user);
})

app.post ('/signup',async (req,res)=>{
    const {username,email,password} = req.body;
    const allMails = await users.find({email : email});
    if(allMails.length > 0){
        res.render('signup.ejs',{thisError : true})
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password,salt);
    users.insertMany([{username : username,email : email,password : hashedPassword}])
    .then(data=>{
        console.log(data,"inserted");
        res.redirect('/login');
    }).catch(error=>{
        console.error(error);
    })
})

app.get('/login',(req,res)=>{
    res.render('signin.ejs',{password : true,email :true});
})

app.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    let user = null;
    try{
        user = await users.findOne({email : email});
    }catch(error){
        console.log(error);
    }
    if(user==null){
        res.render('signin.ejs',{password : true,email : false})
    } else{
        if(await bcrypt.compare(password,user.password)){
            console.log("user : ",user);
            const accessToken = jwt.sign(user.toJSON() ,JWT_TOKEN);
            presentToken = accessToken;
            res.json({accessToken : accessToken});
        }else{
            res.render('signin.ejs',{password : false,email :true });
        }
    }
})


app.listen(3000,()=>{
    console.log('listening at post  : 3000');
})

function verifyToken(req,res,next){
    let tokenHeader = req.headers['authorization'];
    if(!tokenHeader){
        res.sendStatus(403).send('try using authorization by including the token ')
    }
    let token = tokenHeader.split(' ')[1];
    
    jwt.verify(token,JWT_TOKEN,(error,user)=>{
        if(error){
            res.sendStatus(401)
        }else{
            req.user = user;
            next();
        }
    })
}