const express = require("express");
const bodyParser = require("body-parser")
const https = require("https")
const client = require("@mailchimp/mailchimp_marketing");
require('dotenv').config()

const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

const apikey = process.env.API_KEY
const listid = process.env.LIST_ID

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res){
    const firstname  =  req.body.firstname
    const lastname = req.body.lastname
    const emailAddress = req.body.email

    client.setConfig({
    apiKey: apikey,
    server: "us20",
    });

    const run = async () => {
    const response = await client.lists.batchListMembers(listid, {
        members: [
            {
                email_address: emailAddress,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ],
    });
    //This is a temporary fix. Response was a mess to read. 
    if (response != null){
        res.sendFile(__dirname + "/success.html")
    } else {
        res.sendFile(__dirname + "/failure.html")
    }
    };

    run();

});

app.post('/failure', function(req, res){
    console.log(res)
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function(){
    console.log("server is online boi! Go to http://localhost:3000")
})
