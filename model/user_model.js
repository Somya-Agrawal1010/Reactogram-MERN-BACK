const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required : true,
    },
    password: {
        type : String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    profileImg :{
        type : String,
        default:" https://media.istockphoto.com/id/1359866213/photo/a-young-woman-gives-a-beautiful-portrait-of-herself-she-has-a-lovely-smile-she-looks-like-she.webp?s=2048x2048&w=is&k=20&c=lk_DhWxGR6hNPm62WsBDKA2_kviKUIuVSHRoyqsQgy0"
        
    }
});
const User = mongoose.model('User' , userSchema);
module.exports = User;