const express = require("express");
const app = express ();
app.use.apply(express.json());
app.get("/",(req,res)=>{
    res.send("Our common backend is running !");

});
app.listen(5000,()=>{
    console.log("Server running on port 5000");
});

