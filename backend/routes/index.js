const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;
const NFTMeta = connection.models.NFTMeta;
const NFTDrop = connection.models.NFTDrop;
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

// TODO drop must have unique name !!!!!!!
router.post('/create-drop', (req, res, next) => {
    const name = req.body.name;
    const urlParam = name.replace(/'/g, '').replace(/\s/g , "-").toLowerCase();
    const user = req.user._id;
    const newNFTDrop = new NFTDrop({ name, user, urlParam });

    newNFTDrop.save()
    .then(nftDrop => {
        res.send(nftDrop);
    });
});

 router.post('/upload', async (req, res, next) => {
    const nftDrop = req.body.dropId;
    const itemData = {
        'name'        : req.body.name,
        'price'       : req.body.price,
        'description' : req.body.description,
        'image'       : req.files.file.data,
        'txhash'      : ''
    };
    const newNFTMeta = new NFTMeta({
        itemData, 
        nftDrop
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
    NFTDrop.find().then( results => {
        res.send( results )
    }).catch();
});

router.get('/login', (req, res, next) => {
    res.send('already logged in');
});

router.get('/register', isAuth, (req, res, next) => {
    res.send('already logged in');
});

router.get('/dashboard', isAuth, async (req, res, next) => {
    const user = req.user._id;
    console.log('!!!', user);
    NFTDrop.find({user}).then(results => {
        const length = results.length;
        if (length === 0) {
            console.log('empty');
            res.send('empty');
        } else {
            // only show first drop for now
            const payload = {
                drop: {}
            };
            const nftDrop = results[0]._id;
            payload.drop.name = results[0].name;
            payload.drop.id = nftDrop;
            NFTMeta.find({nftDrop}).then(results => {
                console.log('not empty');
                payload.nfts = results;
                res.send(payload);
            })
            .catch();
        }
        // else {} multiple drops, implement later?
    }).catch();
});

router.get('/logout', isAuth, (req, res, next) => {
    req.logout();
    res.send('logged out');
});

router.get('/login-success', (req, res, next) => {
    res.send('success');
});

router.get('/login-failure', (req, res, next) => {
    console.log('login failure');
    res.send('failure');
});

router.get('/:drop', async (req, res, next) => {
    const urlParam = req.params.drop;
    NFTDrop.find({urlParam}).then( results => {
        const nftDrop = results[0]._id;
        NFTMeta.find({nftDrop}).then(results => {
            res.send( results )
        }).catch();
    }).catch();
});

module.exports = router;