const mongoose = require('mongoose');
const Users = require('./models/userModel');
mongoose.connect('mongodb+srv://sreenath:1234@cluster0.x9z2p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log('database connectedd!!!')})
.catch(e=>{console.log(e)});

const sreenath = new Users({username : 'sreenath',email : 'slsl',password : 'aslsl'});
sreenath.save().then(e=>{
    console.log("inserted!!!!");
    console.log(e);
})
