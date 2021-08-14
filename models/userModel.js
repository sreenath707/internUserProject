const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sreenath:1234@cluster0.x9z2p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log('database connectedd!!!')})
.catch(e=>{console.log(e)});

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,        
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required  : true,
        unique : true
    }
});

const user = mongoose.model('Users',userSchema);

module.exports = user;