const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;
const NFTMeta = connection.models.NFTMeta;
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;

/**
 * -------------- POST ROUTES ----------------
 */

 router.post('/login', passport.authenticate(
    'local', 
    { 
        failureRedirect: '/login-failure', 
        successRedirect: 'login-success' 
    }));

 router.post('/register', (req, res, next) => {
    const saltHash = genPassword(req.body.pw);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.uname,
        email: req.body.email,
        hash: hash,
        salt: salt,
        admin: true
    });

    newUser.save()
        .then((user) => {
            console.log('sucess !!!!');
            console.log(user);
        });

    res.send('user stored in db');
 });

 router.post('/upload', async (req, res, next) => {
     console.log(typeof req.files.file.data)
    const itemData = {
        'name'        : req.body.name,
        'price'       : req.body.price,
        'description' : req.body.description,
        'image'       : req.files.file.data,
        'txhash'      : ''
    };
    const newNFTMeta = new NFTMeta({
        itemData: itemData
    });

    newNFTMeta.save()
        .then((nftMeta) => {
            res.send(nftMeta);
        });

 });

 router.post('/setHash', (req, res, next) => {
    NFTMeta.updateOne({ 
        _id: req.body.id 
    }, {
        $set: { 
            'itemData.txhash': req.body.txHash
        }
    })
    .then((status) => {
        res.send(status);
    });
 });

 /**
 * -------------- GET ROUTES ----------------
 */

router.get('/', async (req, res, next) => {
    NFTMeta.find().then( results => {
        res.send( results )
    }).catch();
});

router.get('/login', isAuth, (req, res, next) => {
    res.send('already logged in');
});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', isAuth, (req, res, next) => {
    res.send('already logged in');
});

router.get('/dashboard', isAuth, async (req, res, next) => {
    NFTMeta.find().then( results => {
        res.send( results )
    }).catch();
});

// Visiting this route logs the user out
router.get('/logout', isAuth, (req, res, next) => {
    req.logout();
    res.send('logged out');
});

router.get('/login-success', (req, res, next) => {
    res.send('success');
});

router.get('/login-failure', (req, res, next) => {
    res.send('failure');
});

module.exports = router;