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

const IPFS = require("ipfs-core"); // we may not need this after testing?



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
            'image'       : req.files.file,
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
router.post('/upload-layers', async (req, res, next) => {
    const { id, attribute, rank } = req.body;
    const files = req.files;

    
    // this will set up a folder in ipfs
    const ipfs = await IPFS.create()

    const testPath = `${path.join(__dirname, '../')}uploads/${id}/Arms`;
    const filesArray = await fs.readdirSync(testPath);
    const filesURIArray = [];

    filesArray.forEach(async f => {
        const fp = `${testPath}/${f}`;
        const file = fs.readFileSync(fp);
        const fo = {
            path: `${f}`,
            content: file
        }
        filesURIArray.push(fo);
    });

    // hallelujah!!!!
    for await (const result of ipfs.addAll(filesURIArray, {wrapWithDirectory: true})) {
        console.log(result)
    }
    // end folder setup in ipfs



    // NFTDrop
    // .findByIdAndUpdate(
    //     id,
    //     { 
    //         $push: {
    //             layers: { [attribute] : parseInt(rank) }
    //         } 
    //     },
    //     {returnDocument: 'after'}
    // )
    // .then(results => {
    //     res.send(results);
    // })
    // .catch(error => {
    //     console.error(error);
    //     res.send(error);
    // });

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

// should I put 1x1 images on file system or keep them in db
router.post('/publish-meta-onebyone', async (req, res, next) => {
    const { id } = req.body;
    // const ipfs = await IPFS.create();

    // console.log(path);
    NFTMeta
    .find({nftDrop: id})
    .then(async res => {
        const metaPath = `${path.join(__dirname, '../')}metadata/${id}`;

        if (!fs.existsSync(metaPath)) {
            fs.mkdirSync(metaPath, {
                recursive: trueipfsipfs
            });
        }

        res.forEach(async item => {
            // const image = Buffer.from(item.itemData.image);
            // const imageUri = await ipfs.add(image);
            const imgPath = `ipfs://QmT88DpLEgqRzU5Y2ESMrkW84raBa3YFQHSamWj6Co915r/${item.itemData.image.name}`;
            const metadataFile = item.itemData.image.name.split('.')[0];
            const metadata = {
                name: item.itemData.name,
                description: item.itemData.description,
                image: imgPath,
                traits: item.itemData.traits
            };
            console.log( JSON.stringify(metadata) );
            // fs.writeFileSync(`${metaPath}/${metadataFile}`, JSON.stringify(metadata));
        });
    })
    .catch(err => console.error(err));
});

 /**
 * -------------- GET ROUTES ----------------
 */

router.get('/', async (req, res, next) => {
    const { userId } = req.query;
    let params = { $or:
        [{published: true}, { userId }]
    };
    
    if ( userId === '5' ) params = {};

    NFTDrop
    .find(params)
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
    const { userId } = req.query;

    let params = {
        $and: [
            { urlParam },
            { 
                $or: [{published: true}, {userId}]
            }
        ]
    };

    if ( userId == '5' ) params = {};

    NFTDrop
    .find(params)
    .then(results => {
        const nftDrop = results[0]._id;
        const payload = {
            title: results[0].title,
            description: results[0].description,
            price: results[0].price,
            abi: results[0].abi,
            address: results[0].address,
            type: results[0].type
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

    NFTDrop
    .findById(id)
    .then(async drop => {
        const { layers } = drop;
        const sortedLayerItems = [];
        const randomized = JSON.parse( fs.readFileSync(`${dropPath}randomized`) );
        const randomIdx = Math.floor(Math.random() * randomized.length);
        const random = randomized[randomIdx];

        // sort layers by order
        layers.sort((layer1, layer2) => {
            const attribute1 = Object.keys(layer1)[0];
            const attribute2 = Object.keys(layer2)[0];
            const rank1 = layer1[attribute1];
            const rank2 = layer2[attribute2];

            return rank1 - rank2;
        })
        
        for (let i = 0; i < random.length; i++) {
            const layer = Object.keys(layers[i])[0];
            const imgIdx = random[i];
            const imageName = fs.readdirSync(`${dropPath}${layer}`)[imgIdx - 1];
            const image = fs.readFileSync(`${dropPath}${layer}/${imageName}`);
            sortedLayerItems.push(image)
        }


        res.send(sortedLayerItems);
    })
    .catch(err => console.error(err));
});

// for generative drops
router.get('/randomize-traits', (req, res, next) => {
    const id = req.query.id; // id of drop
    const dropPath = `${path.join(__dirname, '../')}uploads/${id}/`;

    const combineArrays = ( array_of_arrays ) => {
        // First, handle some edge cases
        if( !array_of_arrays || !Array.isArray(array_of_arrays) || array_of_arrays.length == 0 ) return [];
        for( let i = 0 ; i < array_of_arrays.length; i++ ){
            if( ! Array.isArray(array_of_arrays[i]) || array_of_arrays[i].length == 0 ){
                // If any of the arrays in array_of_arrays are not arrays or zero-length, return an empty array...
                return [];
            }
        }
    
        // Start "odometer" with a 0 for each array in array_of_arrays.
        let odometer = new Array( array_of_arrays.length );
        odometer.fill( 0 ); 
    
        let output = [];
        let newCombination = formCombination( odometer, array_of_arrays );
    
        output.push( newCombination );
    
        while ( odometer_increment( odometer, array_of_arrays ) ){
            newCombination = formCombination( odometer, array_of_arrays );
            output.push( newCombination );
        }
    
        return output;
    }/* combineArrays() */
    
    // Translate "odometer" to combinations from array_of_arrays
    const formCombination = ( odometer, array_of_arrays ) => {
        // In Imperative Programmingese (i.e., English):
        // let s_output = "";
        // for( let i=0; i < odometer.length; i++ ){
        //    s_output += "" + array_of_arrays[i][odometer[i]]; 
        // }
        // return s_output;
    
        // In Functional Programmingese (Henny Youngman one-liner):
        return odometer.reduce(
          function(accumulator, odometer_value, odometer_index){
            return "" + accumulator + array_of_arrays[odometer_index][odometer_value];
          },
          ""
        );
    }/* formCombination() */
    
    const odometer_increment = ( odometer, array_of_arrays ) => {
    
        // Basically, work you way from the rightmost digit of the "odometer"...
        // if you're able to increment without cycling that digit back to zero,
        // you're all done, otherwise, cycle that digit to zero and go one digit to the
        // left, and begin again until you're able to increment a digit
        // without cycling it...simple, huh...?
    
        for( let i_odometer_digit = odometer.length-1; i_odometer_digit >=0; i_odometer_digit-- ){ 
            let maxee = array_of_arrays[i_odometer_digit].length - 1;         
            if( odometer[i_odometer_digit] + 1 <= maxee ){
                // increment, and you're done...
                odometer[i_odometer_digit]++;
                return true;
            }
            else{
                if( i_odometer_digit - 1 < 0 ){
                    // No more digits left to increment, end of the line...
                    return false;
                }
                else{
                    // Can't increment this digit, cycle it to zero and continue
                    // the loop to go over to the next digit...
                    odometer[i_odometer_digit]=0;
                    continue;
                }
            }
        }/* for( let odometer_digit = odometer.length-1; odometer_digit >=0; odometer_digit-- ) */
    
    }/* odometer_increment() */

    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    NFTDrop
    .findById(id)
    .then(async drop => {
        const { layers } = drop;
        const sortedLayerItems = [];

        // sort layers by order
        layers.sort((layer1, layer2) => {
            const attribute1 = Object.keys(layer1)[0];
            const attribute2 = Object.keys(layer2)[0];
            const rank1 = layer1[attribute1];
            const rank2 = layer2[attribute2];

            return rank1 - rank2;
        })
        
        const traits = fs.readdirSync(dropPath);

        layers.forEach(layer => {
            const layerName = Object.keys(layer)[0];
            const traits = fs.readdirSync(`${dropPath}${layerName}`);
            traits.forEach((trait, index) => {
                traits[index] = index + 1;
            });
            sortedLayerItems.push(traits);
        })

        const permutations = combineArrays(sortedLayerItems);
        shuffleArray(permutations);
        fs.writeFileSync(`${dropPath}randomized`, JSON.stringify(permutations));
        console.log(permutations);
        
    })
    .catch(err => console.error(err));
});

module.exports = router;