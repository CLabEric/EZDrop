const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;
const NFTMeta = connection.models.NFTMeta;
const NFTDrop = connection.models.NFTDrop;
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;

const jwt = require("jsonwebtoken"); 

function authenticateToken(req, res, next) {
    // Read the JWT access token from the request header
    console.log(req.headers)
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.USERFRONT_PUBLIC_KEY.replace(/\\n/g, '\n'), { algorithms: ["RS256"] }, (err, auth) => {     
        if (err) return res.sendStatus(403); // Return 403 if there is an error verifying
        req.auth = auth;
        next();
    }); 
}

/**
 * -------------- POST ROUTES ----------------
 */

// TODO drop must have unique name !!!!!!!
router.post('/create-drop', (req, res, next) => {
    const { title, userId, type } = req.body;
    const urlParam = title.replace(/'/g, '').replace(/\s/g , "-").toLowerCase();
    const newNFTDrop = new NFTDrop({ userId, title, urlParam, type });

    newNFTDrop.save()
    .then(nftDrop => {
        console.log('**', nftDrop);
        res.send(nftDrop);
    });
});

router.post('/configure-drop', (req, res, next) => {
    const { id, price, description, traits } = req.body;
    NFTDrop
    .findByIdAndUpdate(id, {price, description, traits}, {returnDocument: 'after'})
    .then(results => {
        console.log(results);
        res.send(results);
    })
    .catch(error => { 
        console.log(error);
        res.send(error);
    });
});

 router.post('/upload', async (req, res, next) => {
    const nftDrop = req.body.dropId;

    NFTDrop
    .findById(nftDrop)
    .then(drop => {
        const files = req.files;
        const itemData = {
            'name'        : req.body.name,
            'description' : req.body.description,
            'image'       : req.files.file.data,
            'traits'      : JSON.parse(req.body.traits)
        };
        const newNFTMeta = new NFTMeta({
            itemData, 
            nftDrop
        });

        newNFTMeta.save()
        .then((nftMeta) => {
            res.send(nftMeta);
        });
    })
    .catch(error => console.log('error:', error));
 });

 /**
 * -------------- GET ROUTES ----------------
 */

router.get('/', async (req, res, next) => {
    NFTDrop.find().then( results => {
        res.send( results )
    }).catch();
});

router.get('/drop', async (req, res, next) => {
    const urlParam = req.query.drop;
    NFTDrop
    .find({urlParam})
    .then(results => {
        const nftDrop = results[0]._id;
        const payload = {
            title: results[0].title
        }
        NFTMeta
        .find({nftDrop})
        .limit(5)
        .then(results => {
            payload.nfts = results;
            res.send(payload);
        })
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error));
});

router.get('/dashboard', authenticateToken, async (req, res, next) => {
    const { userId } = req.query;

    // first we get all drops for this user
    NFTDrop.find({userId}).then(results => {
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
            payload.drop = results[0];
            NFTMeta.find({nftDrop}).then(results => {
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

module.exports = router;