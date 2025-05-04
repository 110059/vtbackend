const express = require('express');
const multer = require('multer');
const { hugFaces } = require('./../utils/facehug');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage }); 

router.post('/', upload.fields([{ name: 'image1' }, { name: 'image2' }]), async (req, res) => {
  try {
    const image1 = req.files['image1'][0].buffer;
    const image2 = req.files['image2'][0].buffer;

    const huggedBuffer = await hugFaces(image1, image2);

    res.set('Content-Type', 'image/jpeg');
    res.send(huggedBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error hugging faces');
  }
});

module.exports = router;
