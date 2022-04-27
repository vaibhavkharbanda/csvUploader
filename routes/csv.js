const express = require('express');
const router = express.Router();
const csvController = require('../controllers/csvController');

//page routes
router.get('/displayfiles', csvController.displayfiles);

//action routes
router.post('/upload', csvController.upload);
router.get('/delete/:id', csvController.deleteFile);
router.get('/displaydata/:id', csvController.displayData);

// dummy api route
router.post('/api/upload', csvController.uploadViaApi);
module.exports = router;