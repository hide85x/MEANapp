const mongoose= require('mongoose');
const mongooseValidator= require('mongoose-unique-validator')
const Schema= mongoose.Schema;

const UserSchema=  new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }   
})

UserSchema.plugin(mongooseValidator); // dostaniemty error jesli sprobujemy zapisac istniejacego usera

module.exports= mongoose.model("User", UserSchema);