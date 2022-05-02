const express = require("express");
const bodyParser = require("body-parser")
const mailchimp = require('@mailchimp/mailchimp_marketing');



require('dotenv').config()

const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

const apikey = process.env.API_KEY

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res){
    const firstname  =  req.body.firstname
    const lastname = req.body.lastname
    const emailAddress = req.body.email

    mailchimp.setConfig({
    apiKey: apikey,
    server: "us20",
    });


    const run = async () => {
        const response = await mailchimp.lists.batchListMembers("4a63955524", {
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
        //This is a temporary fix. 
        if (response!=null){
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
