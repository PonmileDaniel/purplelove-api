const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const dotenv = require("dotenv");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const cors = require('cors');



//To upload Multiple Files
const multer = require("multer")
const path = require("path")

dotenv.config();


//Middleware
app.use(cors({
    origin: 'https://purplelove.onrender.com'
  }));
  

//How to connect to Mongodb
mongoose.connect( process.env.MONGO_URL , { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Db Connection Succesful"))
.catch((err) => {
    console.log(err)
});

app.use("/images", express.static(path.join(__dirname, "public/images")));

//Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
//For the Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
    cb(null, req.body.name);
    
    },
})

//To upload Images 

const upload = multer({ storage: storage});
app.post("/api/upload", upload.single("file"), (req, res) =>{
    try{
   return res.status(200).json("File Uploaded Successfully")
    }catch(error){
        console.log(error);
    }
})

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);


//How to run Backend Server
app.listen(3030, () =>{
    console.log("Backend Server is Running");
})