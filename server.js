if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');
const bodyParser = require('body-parser');

app.set('view engine' , 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);


// Parsers for POST data
app.use(express.urlencoded({extended: false})); 
app.use(express.json());   
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public')); 

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser:true,
    useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', error => console.error(error));
    db.once('open', () => console.log('Connected to the database'))

app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);

app.listen(process.env.PORT || 3000);