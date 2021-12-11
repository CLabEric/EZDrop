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
    // drop is created all at once vs one at a time
    const alreadyHasMeta = req.body.alreadyHasMeta;
    const newNFTDrop = new NFTDrop({ name, urlParam, alreadyHasMeta, user });

    newNFTDrop.save()
    .then(nftDrop => {
        console.log('**', nftDrop);
        res.send(nftDrop);
    });
});

 router.post('/upload', async (req, res, next) => {
    const nftDrop = req.body.dropId;

    NFTDrop
    .findById(req.body.dropId)
    .then(drop => {
        const files = req.files;
        const metadataObject = JSON.parse( files['metadata'].data.toString('utf-8') );

        if (drop.alreadyHasMeta) {
            Object.keys(metadataObject).forEach(metadataKey => {
                const singleMetaObject = metadataObject[metadataKey];
                const singleFilekey = `file-${singleMetaObject.edition}`;
                const image = files[singleFilekey].data;
                const itemData = {
                    'name'        : singleMetaObject.name,
                    'price'       : '0.0001',
                    'description' : singleMetaObject.description,
                    'image'       : image,
                    'attributes'  : singleMetaObject.attributes,
                    'txhash'      : ''
                };
                const newNFTMeta = new NFTMeta({
                    itemData, 
                    nftDrop
                });
                newNFTMeta.save()
                .then((nftMeta) => {
                    console.log(nftMeta.itemData.name, 'added to database');
                });
            });
            res.send('drop created');
        } else {
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
        }
    })
    .catch(error => console.log('error:', error));
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
            payload.drop.alreadyHasMeta = results[0].alreadyHasMeta;
            NFTMeta.find({nftDrop}).then(results => {
                
                payload.nfts = results;
                console.log('not empty', payload);
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