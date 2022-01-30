const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const NFTMeta = connection.models.NFTMeta;
const NFTDrop = connection.models.NFTDrop;
const isAuth = require('./authMiddleware').isAuth;
const path = require('path');
const jwt = require("jsonwebtoken"); 
const fs = require('fs');

function authenticateToken(req, res, next) {
    // Read the JWT access token from the request header
    // console.log(req.headers)
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
    const newNFTDrop = new NFTDrop(
        { userId, title, urlParam, type, published: false }
    );

    newNFTDrop.save()
    .then(nftDrop => {
        res.send(nftDrop);
    });
});

router.post('/configure-drop', (req, res, next) => {
    const { id, price, blurb, description, traits } = req.body;
    const data = { price, blurb, description, traits: JSON.parse(req.body.traits) };
    if (req.files) data.thumbnail = req.files.file.data;
    NFTDrop
    .findByIdAndUpdate(id, data, {returnDocument: 'after'})
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

// array gets overloaded if this is called multiple times
// see if can check for uniqueness of layers in array in db
// can I use await for layers.mv? Can I do this w fs?
router.post('/upload-layers', (req, res, next) => {
    const { id, attribute } = req.body;
    const files = req.files;

    // no error handler in for loop, it doesnt play with db call so come up w
    // another way to validate layers were added correctly
    for (const file in files) {
        const layer = files[file];
        layer.mv( 
            `${path.join(__dirname, '../')}uploads/${id}/${attribute}/${layer.name}`
        );
    }

    NFTDrop
    .findByIdAndUpdate(
        id,
        { $push: {
            layers: attribute
        }},
        {returnDocument: 'after'}
    )
    .then(results => {
        res.send(results);
    })
    .catch(error => {
        console.error(error);
        res.send(error);
    });

});

router.delete('/delete', async (req, res, next) => {
    NFTMeta
    .findByIdAndDelete( req.body.currentId )
    .then( result => res.send(result) )
    .catch(error => console.error(error));
});

router.post('/contract', (req, res, next) => {
    const { id, abi, address } = req.body;

    NFTDrop
    .findByIdAndUpdate(id, {abi: JSON.parse(abi), address}, {returnDocument: 'after'})
    .then(results => {
        res.send(results);
    })
    .catch(error => { 
        console.log(error);
        res.send(error);
    });
});

router.post('/publish', (req, res, next) => {
    const { id } = req.body;

    NFTDrop
    .findByIdAndUpdate(id, {published: true}, {returnDocument: 'after'})
    .then(results => {
        console.log(results);
        res.send(results);
    })
    .catch(error => { 
        console.log(error);
        res.send(error);
    });

});

 /**
 * -------------- GET ROUTES ----------------
 */

router.get('/', async (req, res, next) => {
    NFTDrop
    .find()
    .where('published')
    .equals(true)
    .then(results => {
        res.send( results )
    })
    .catch(error => console.log(error));
});

router.get('/single', async (req, res, next) => {
    // maybe randomize?
    // also delete from db
    NFTMeta.findOne()
    .then(response => res.send(response))
    .catch(error => console.error(error));
});

router.get('/drop', async (req, res, next) => {
    const urlParam = req.query.drop;
    NFTDrop
    .find({urlParam})
    .then(results => {
        const nftDrop = results[0]._id;
        const payload = {
            title: results[0].title,
            description: results[0].description,
            price: results[0].price,
            abi: results[0].abi,
            address: results[0].address
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

router.get('/random-image', async (req, res, next) => {
    const id = req.query.id;
    const dropPath = `${path.join(__dirname, '../')}uploads/${id}/`;
    const dropFolder = await fs.readdirSync(dropPath);
    const singleNftTraits = [];

    dropFolder.forEach(traitFolder => {
        const traitFile = fs.readdirSync(`${dropPath}${traitFolder}`)[0];
        const trait = fs.readFileSync(`${dropPath}${traitFolder}/${traitFile}`);
        
        singleNftTraits.push(trait);
    });
    res.setHeader('Content-Type', 'image/png');
    res.send(singleNftTraits);
});

module.exports = router;