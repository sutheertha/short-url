const express = require("express")
const {connectToMongoDB} = require("./connect");
const app = express();
const urlRoute  = require("./routes/url");
const URL = require('./models/url');
const PORT = 8001;
require('dotenv').config();

app.use(express.json());


app.use("/url", urlRoute);

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/short-url";

connectToMongoDB(mongoUri)
.then(() => console.log("MongoDB connected"));




app.get('/:shortId',async (req,res)=>{
    try{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },
    {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            }
        },
    }
    );
    res.redirect(entry.redirectURL);
}
    catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
  });

app.listen(PORT,()=>console.log(`Server stared at PORT:${PORT}`));