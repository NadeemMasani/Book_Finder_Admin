const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/auth-controller');

router.post('/signup', authController.signup);

router.post('/login', authController.login);

module.exports = router;