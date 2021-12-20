//Import express
let express = require('express');

//Initialize the app
let app = express();

app.use(express.urlencoded({extended:true}));

let session = require('express-session');

app.use(session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: true
    })
);

/*
//Send message for default URL
app.get('/', (req, res) =>{
    res.send('Hello World !');
});
*/

app.use(express.static('views'));

let router = require('./routes');
app.use('/', router);

//Launch app to listen on specified port
app.listen(80, function() {
    console.log('Runnings on port 80');
});