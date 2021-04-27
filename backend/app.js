const express = require('express');
const HttpError = require('./models/http-error');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/admin-routes');
const libraryRoutes = require('./routes/library-routes');

const app = express();
app.use(express.json()); //Used to parse JSON bodies


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/admin', adminRoutes);
app.use('/api/library', libraryRoutes);


app.use((req, res, next) => {
    const error = new HttpError("Could not find this route", 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({ message: error.message || "An Unknown error occured" });
});

mongoose.
    connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fycqf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`).
    then(() => {
        app.listen(process.env.PORT || 5000);
    }).
    catch(err => {
        console.log(err);
    });