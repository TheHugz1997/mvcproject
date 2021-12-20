//Import mysql
var mysql = require("mysql");

let UserActi = require('../models/lepanier');

let userList = [];

let panier = [];

let big_copy = [];

let formation_copy = [];

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'mvcdata'
});

//Get the list of lessons from mysql database
exports.FormationsList = function(req, res) {
    connection.query("SELECT id, formations_name, DATE_FORMAT(debut,'%e/%c/%Y') AS debut, DATE_FORMAT(fin,'%e/%c/%Y') AS fin, prix FROM mvcdata.formations;", function(error, result){
        if (error) console.log(error);
        formation_copy = result;
        res.render('formations_list.ejs', {lessons: result})
    })
};

//Get the login
exports.User = function(req, res) {
    res.render('login.ejs');
};

//When the user login with his name
exports.userSession = function(req, res) {
    req.session.user = req.body.user;
    res.redirect('/');
};


exports.userAddFormation = function(req, res) {
    if(req.session.user == null){
        res.redirect('/');
    }
    else{
        let useracti = new UserActi(req.session.user, Object.keys(req.body)[0]);
        userList.push(useracti);
        connection.query("SELECT id, formations_name, DATE_FORMAT(debut,'%e/%c/%Y') AS debut, DATE_FORMAT(fin,'%e/%c/%Y') AS fin, prix FROM mvcdata.formations;", function(error, result){
            if (error) console.log(error);
            let copy = [];
            let copy2 = [];
            for(let j=0; j<userList.length; j++){
                copy2.push(userList[j].activity.trim());
            }
            for(let i=0; i<result.length; i++){
                if(result[i].formations_name.trim() != Object.keys(req.body)[0].trim() && copy2.includes(result[i].formations_name.trim()) == false){
                    copy.push(result[i]);
                }
                else if (result[i].formations_name.trim() == Object.keys(req.body)[0].trim() && copy2.includes(result[i].formations_name.trim()) == true){
                    panier.push(result[i]);
                }
            }
            big_copy = copy.slice();
            res.render('formations_list.ejs', {lessons: copy})
        })
    }
};

exports.userPanier = function(req, res) {
    res.render('panier.ejs', {lessons: panier});
};


exports.Goback = function(req, res) {
    if(big_copy == null || big_copy.length == 0){
        res.render('formations_list.ejs', {lessons: formation_copy});
    }
    else{
        res.render('formations_list.ejs', {lessons: big_copy});
    }
};

exports.Delformation = function(req, res) {
    //if(Object.keys(req.body)[0].trim())
    for(let i=0; i<formation_copy.length; i++){
        if(formation_copy[i].formations_name.trim() == Object.keys(req.body)[0].trim()){
            big_copy.push(formation_copy[i]);
        }
    }
    let copy = userList.slice();
    for(let j=0; j<copy.length; j++){
        if(copy[j].activity.trim() == Object.keys(req.body)[0].trim()){
            panier.splice(j,1);
            userList.splice(j,1);
        }
    }
    res.render('formations_list.ejs', {lessons: big_copy});
};

exports.Sendpanier = function(req, res) {
    if(req.session.user != null){
        connection.query("DELETE FROM mvcdata.userformations WHERE username=?;",[req.session.user]);
        for(let i=0; i<panier.length; i++){
            var id = panier[i].id;
            var username = req.session.user.trim();
            connection.query(`INSERT INTO mvcdata.userformations(username, idformations) VALUES (?,?)`,[username, id]);
        }
        panier = [];
        userList = [];
    }
    res.render('answer.ejs');
};