//requirements
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const color = require('colors');
const mongoose = require('mongoose');
const {Schema} = mongoose;
const session = require('express-session');
const flash = require('express-flash');
const port = process.env.PORT || 8000;
const app = express();

//build app
app
.use(express.static(path.join(__dirname, 'static')))
.use(bodyParser.urlencoded({extended:true}))
.use(session({
    secret:'dojo',
    resave: false,
    saveUninitialized: false,
    cookie: {secure:false, maxAge: 60000}
}))
.use(flash())
.set('view engine', 'ejs')
.set('views', path.resolve('views'))

//mongodb connection
mongoose.connect('mongodb://localhost:27017/piranha_gang', {useNewUrlParser:true});
mongoose.connection.on('connected', () => console.log('MongoDB connected'));

//schema
const eachPiranha = new Schema({
    name: {
        type: String,
        required: [true, 'Please name your piranha'],
        trim: true,
    },
    age: {
        type: Number,
        required: [true, 'What is the age of this creature in years?'],
    },
    about: {
        type: String,
        required: [true, 'Write something about it!']
    },
}, {timestamps:{createdAt: true, updatedAt: true}});
const Piranha = mongoose.model('Piranha', eachPiranha);

//routing
app.get('/', (request,response) => {
    Piranha.find({})
        .then(piranhas_db => {
            const piranhas = piranhas_db;
            response.render('index', {piranhas});
        })
        .catch(error => {
            for (let key in error.errors) {
                request.flash('get_error', error.errors[key].message)
                console.log(error.errors[key].message);
            }
        });
});
app.get('/piranha/new', (request,response) => {
    response.render('new');
});
app.post('/piranha/new', (request,response) => {
    Piranha.create(request.body)
        .then(piranha => {
            console.log('created ',piranha);
            response.redirect('/');
        })
        .catch(error => {
            for (let key in error.errors) {
                request.flash('create_error', error.errors[key].message);
            }
            response.redirect('/piranha/new');
        });
});
app.get('/piranha/:_id', (request, response) => {
    const which = request.params._id;
    Piranha.find({_id:which})
        .then((piranha_db) => {
            console.log(piranha_db);
            piranha = piranha_db;
            response.render('piranha', {piranha});
        })
        .catch(error => {
            console.log(error);
            response.redirect('/');
        });
});
app.get('/piranha/edit/:_id', (request,response) => {
    const which = request.params._id;
    Piranha.find({_id:which})
        .then((piranha_db) => {
            console.log(color.yellow(piranha_db));
            piranha = piranha_db;
            response.render('edit', {piranha});
        })
        .catch(error => {
            console.log(error);
            response.redirect('/');
        });
});
app.post('/piranha/edit/:_id', (request,response) => {
    const which = request.params._id;
    for ([entry,data] of Object.entries(request.body)) {
        if (data != '') {
            console.log(which,entry,data);
            let what = {entry:data};
            Piranha.findByIdAndUpdate(which,{$set:what})
                .then((piranha_db) => console.log(piranha_db))
                .catch(error => console.log(error));
        }
    }
    response.redirect('/');
});
app.get('/piranha/delete/:_id', (request,response) => {
    const which = request.params._id;
    Piranha.remove({_id:which})
        .then(() => {
            console.log('deleted successfully')
            response.redirect('/');
        })
        .catch((error) => console.log(error));
            response.redirect('/');

});

//port connection
app.listen(port, () => console.log(`Express listening on port ${port}`));

