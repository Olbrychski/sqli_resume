const express = require("express");
const path = require("path");
const parser = require("body-parser");
const res = require("express/lib/response");
const connection = require('./db');

const app = express();
app.use(express.urlencoded({extended: false}));

const PORT = 3000;

app.unsubscribe(express.static(path.join(__dirname,'static')));
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.get("/views/sql.html", (req, res) => {
    res.sendFile(__dirname + "/views/sql.html");
});

// Secure query
app.post("/api", (req, res) => {
    console.log(req.body);
    const username = req.body.user;
    const password = req.body.password;
    connection.query("INSERT INTO sql_inj (user, password) VALUES (?,?)",
    [username,password],
    (err, result) => {
        console.log(err);
    }
)});

//Vulnerable query
app.post("/login", function(req, res){
    const username1 = req.body.user1
    const password1 = req.body.password1
    connection.query("SELECT * FROM sql_inj WHERE user = '" + req.body.user1 + "' AND password = '" + req.body.password1 + "'",
    [username1, password1],
      (err, result) => {
        if (err){
          res.send({err: err});
        }
    
          if (result.length > 0) {
            res.send({Message: "Logged in"})
          } else {
            res.send({Message: "Invalid username/password"})
          }
      }
    ); 
}) 

app.listen(PORT, function(){
    console.log("Server UP");

    connection.connect(function(err){
        if(err) throw err;
        console.log("Database working");
    });
})

