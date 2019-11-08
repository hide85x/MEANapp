const app= require('./backend/app');
const http= require('http');
const debug= require('debug')("node-angular");
const mongoose= require('mongoose');
// const postRoutes= require('./backend/Routes/posts')



const port= process.env.PORT || 3000
app.set('port', port)
// app.use(postRoutes)
mongoose.connect("mongodb+srv://hide:hide85x@cluster0-chy7b.mongodb.net/meanApp", { useNewUrlParser: true })
    .then(connection=> {
        console.log('mongo db connected')
        app.listen(port)
        console.log('server running on port :', port)
    })
