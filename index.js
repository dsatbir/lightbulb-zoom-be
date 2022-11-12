const express = require('express');
const cors = require("cors");
const dotEnv = require("dotenv");

dotEnv.config();

const zoomRouter = require('./routes/zoomRouter');
const app = express();

app.use(cors());
app.use(express.json());

app.use("/zoomapi", zoomRouter);



app.listen(8000,function(err){
    if(err) throw err;
    console.log('Server is running on 8000');
})
