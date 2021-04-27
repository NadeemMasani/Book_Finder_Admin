const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const libController = require('../controllers/library-controller');
const checkAuth = require('../middleware/check-auth');

router.get('/:lid', libController.getLibraryById);
router.get('/:lid/books', libController.getBooksByLibrary);
router.get('/book/:bid', libController.getBookByID);
// router.use(checkAuth);

router.post('/:lid', libController.addBook);
router.patch('/book/:bid', libController.updateBook);

router.delete('/book/:lid/:bid', libController.deleteBook);


module.exports = router;