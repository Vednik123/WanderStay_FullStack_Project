const mongoose = require("mongoose");

const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderstay";

main().then(()=>{
    console.log("Connected to DB");
}).catch(err=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}


const initDB = async () =>{
    // pehle kuch data ho to use delete krne ke liye
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"68051e711159f8aa38d59c9d"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();