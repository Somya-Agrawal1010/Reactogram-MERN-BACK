const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    description: {
        type : String,
        required : true
    },
    location: {
        type: String,
        required: true
    },
    
    image: {
        type:  String,
        required : true
    },
    author: {
        type: ObjectId,
        ref: "User"
    }
});
 const PostModel = mongoose.model("PostModel" , postSchema);
 module.exports = PostModel