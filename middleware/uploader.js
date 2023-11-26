const multer = require('multer');
const { gfs } = require('../models/database');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const handleUpload = (req,res,next) => {
    upload.single('file')(req,res, (req) => {
        // if file is not image

        if (err instanceof multer.MulterError) {
            res.status(400).json({ message: err.message });
            return;
        }else if (err) {
            res.status(400).json({ message: err.message });
            return;
        }

        req.fileData = {
            filename: req.file.originalname,
            data: req.file.buffer,
        };

        next();
    })
};

const saveFileToGridFS = (req, res, next) => {
    if (!req.fileData) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
  
    const writeStream = gfs.createWriteStream({
      filename: req.fileData.originalname,
    });
  
    writeStream.write(req.fileData.buffer);
    writeStream.end();
  
    writeStream.on('close', () => {
      req.fileId = writeStream.id; // Store the file ID on the request object if needed
      next();
    });
};


module.exports = {
    handleUpload,
    saveFileToGridFS,
};
