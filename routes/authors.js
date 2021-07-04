const express = require('express');
const router = express.Router();
const Author = require('../models/author');


//new author route
router.get('/new', (req,res) => {
res.render('authors/new', {author: new Author() })
});

//all authors - route
router.get('/', async (req,res) => {
    let searchConstrains = {};
    if(req.query.name != null && req.query.name !=''){
        searchConstrains.name = new RegExp(req.query.name, 'i');
    }
    try{
        const authors = await Author.find(searchConstrains);
        res.render('authors/index', {
            authors: authors,
            searchConstrains: req.query
        })
    }
    catch{
       res.redirect('/');
    }
});

// Create Author Route
router.post('/', async (req, res) => {
    const author = new Author({
      name: req.body.name
    })
    try{
        const newAuthor = await author.save();
        //res.redirect(`authors/${newAuthor.id}`);
        res.redirect('authors');
    }catch{
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        });
    }
   /*  try {
      const newAuthor = await author.save()
      // res.redirect(`authors/${newAuthor.id}`)
      res.redirect(`authors`)
    } catch {
      res.render('authors/new', {
        author: author,
        errorMessage: 'Error creating Author'
      })
    } */
  })


module.exports = router;
