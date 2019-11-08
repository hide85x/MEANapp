const mongoose= require('mongoose');

const Schema= mongoose.Schema;

const PostSchema= Schema({
    title: String,
    content: String,
    imagePath: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports= mongoose.model("Post", PostSchema)