const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const reg = new RegExp('\\.js$', 'i');

//path to models
const models_path = path.resolve('server/models');

//mongodb connection
mongoose.connect('mongodb://localhost:27017/books_api', {useNewUrlParser:true});
mongoose.connection.on('connected', () => console.log('MongoDB connected to books API'));

fs.readdirSync(models_path).forEach(file => {
    if (reg.test(file)) {
        console.log('requiring file');
        require(path.join(models_path, file));
    }
});

