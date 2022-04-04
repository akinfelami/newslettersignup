const express = require("express");
const bodyParser = require("body-parser")
const https = require("https")

const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res){
    const firstname  =  req.body.firstname
    const lastname = req.body.lastname
    const emailAddress = req.body.email
    const data = {
        members: [
            {
                email_address: emailAddress,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const url = "https://us20.api.mailchimp.com/3.0/lists/LISTID/"
    const options = {
        method: "POST",
        auth: "API KEY"
    }
    const request = https.request(url, options, function(response){
        response.on('data', function(data){
        })
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
    })
    request.write(jsonData);
    request.end();
});

app.post('/failure', function(req, res){
    console.log(res)
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function(){
    console.log("server is online boi! Go to http://localhost:3000")
})
