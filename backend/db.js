
const mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/inotebook"

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to mongo successfully")
    })
}

module.exports = connectToMongo

// const mongoURI = "mongodb://localhost:27017/test";
// const database = "test";

// const connectToMongo = async () => {
//     try{
//         await mongoose.connect(`connectToMongo://${mongoURI}/${database}`,{
//         console.log("MongoDB connected!!!!");
//         useNewUrlParser:true,
//         useUnifiedTopology:true
//     },(err)=>{
//         console.log("Faild to connect to MongoDB", err);
//     }
// })

// module.exports = connectToMongo;