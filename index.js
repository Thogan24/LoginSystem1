const express = require('express');
const bcrypt = require('bcrypt');
const path = require("path");
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(session({
    secret: "secretKey",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false
}));

var users = [];

app.get("/", function(req, res){
    return res.render("index");
})

app.get("/login", function(req, res){
    return res.render("login");
})

app.get("/register", function(req, res){
    return res.render("register");
})

app.listen(8000, function(){
    console.log("app started on port 8000");
})

app.post("/register", async function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    if(users.find((data) => username === data.username)){
        res.redirect("/")
    }
    else{
        let hashPassword = await bcrypt.hash(password, 10);
        var newuser = {
            username: username, password: hashPassword, money: 100
        }
        users.push(newuser);
        console.log(users);
        return res.redirect("/")
    }
})

app.get("/index", function(req, res){
    res.render("/index", {Userlist: 1});
    var sortedUserList = [];
    // USE SELECTION SORT OR INSERTION SORT TO SORT 
    // users.forEach(e => {            
    //     if(){
            
    //     }
    // })

})

app.post("/login", async function(req, res){
    var username = req.body.username
    var password = req.body.password;
    var founduser = users.find((data) => username === data.username)
    if(founduser){
        
        if(await bcrypt.compare(password, founduser.password)){
            req.session.user = {username: username, money: founduser.money}
            res.redirect("home");
        }
        else{
            res.redirect("/")
        }

    }
    else{
        res.redirect("/");
    }
})

app.get("/home", function(req, res){    
    if (req.session.user){
        return res.render("home", {username: req.session.user.username, money: req.session.user.money});
    }
    else{
        res.redirect("/login");
    }
    //const button = document.getElementById('btn');

    //button.addEventListener('click', function addMoney(){
    //    console.log('element clicked!!!!!');
    //});
    
})

app.get("/addmoney", function(req, res){    
    if (req.session.user){
        req.session.user.money += 100;
        users.forEach(e => {            
            if(e.username==req.session.user.username){
                e.money+=100;
            }
        })
        console.log(users);
        return res.redirect("/home");        
    }
    else{
        res.redirect("/login");
    }
    
    
})

app.get("/logout", function(req, res){
    req.session.destroy();
    res.redirect("/");
    
})