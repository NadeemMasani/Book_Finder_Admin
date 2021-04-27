const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const getCoordsForAddress = require('../util/location');
const Libaccount = require('../models/libaccount');
const Library = require('../models/library');


const signup = async (req, res, next) => {
    const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return next(
    //         new HttpError('Invalid inputs passed, please check your data.', 422)
    //     );
    // }

    const { name, email, password, address, country, city, zip, zip4 } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    let existingUser;
    try {
        existingUser = await Libaccount.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Signing up failed while trying to find existing user, please try again later.',
            500
        );
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
            'User exists already, please login instead.',
            422
        );
        return next(error);
    }

    let hashedPassword;
    console.log(password);
    console.log(name);
    console.log(zip4);
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError(
            'Could not create user, please try again.',
            500
        );
        return next(err);
    }

    const createdLibrary = new Library({
        name,
        address,
        location: coordinates,
        country,
        city,
        zip: parseInt(zip),
        zip4: parseInt(zip4),
        books: []
    });
    let createdUser;
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdLibrary.save({ session: sess });
        createdUser = new Libaccount({
            name,
            email,
            password: hashedPassword,
            lib: createdLibrary
        });
        await createdUser.save({ session: sess });
        await sess.commitTransaction()

    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not create Library.',
            500
        );
        return next(err);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            'supersecret_dont_share',
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(err);
    }

    res
        .status(201)
        .json({ userId: createdUser.id, email: createdUser.email, token: token, libid: createdLibrary.id });

};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await Libaccount.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            403
        );
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError(
            'Could not log you in, please check your credentials and try again.',
            500
        );
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            403
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            'supersecret_dont_share',
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }

    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        libId: existingUser.lib,
        token: token
    });
};

exports.signup = signup;
exports.login = login;