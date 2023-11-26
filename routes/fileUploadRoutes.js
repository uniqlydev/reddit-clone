const express = require('express');
const router = express.Router();
const { handleUpload, saveFileToGridFS } = require('../middleware/uploader');

router.post('/upload', handleUpload, saveFileToGridFS, (req, res) => {
    res.json({ message: 'File uploaded successfully!', fileId: req.file });
});

module.exports = router;
  