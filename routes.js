//Import express
let express = require('express');

//Import router
let router = express.Router();

let session = require('express-session');

let catalogue = require('./controllers/catalogue.js');

router.get('/', catalogue.FormationsList);
router.get('/login', catalogue.User);
router.get('/return', catalogue.Goback);
router.post('/login/test', catalogue.userSession);
router.post('/addformation', catalogue.userAddFormation);
router.post('/panier', catalogue.userPanier);
router.post('/delformation', catalogue.Delformation);
router.post('/final', catalogue.Sendpanier);

//Export router to use it on server.js
module.exports = router;