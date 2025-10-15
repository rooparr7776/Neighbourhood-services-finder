const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Set storage location
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/', upload.single('photo'), (req, res) => {
    res.json({ filename: req.file.filename });
});

module.exports = router;
