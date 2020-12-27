let express = require('express'),
    multer = require('multer'),
    mongoose = require('mongoose'),
    router = express.Router();

const DIR = './public';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

var upload = multer({
    storage: storage,
});


let File = require('../models/file.model');

router.post('/upload', upload.array('files', 10), (req, res, next) => {
    const reqFiles = []
    const url = req.protocol + '://' + req.get('host')
    for (var i = 0; i < req.files.length; i++) {
       reqFiles.push(url + '/public/' + req.files[i].filename)
    }
    
    const file = new File({
        files: reqFiles,
    });
    file.id = req.body.id,

    file
        .save(file)
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Done upload!",
                fileCreated: {
                    files: result.files,
                    id: result.id
                }
            })
        }).catch(err => {
            console.log(err),
                res.status(500).json({
                    error: err
                });
        })
}),

module.exports = router;