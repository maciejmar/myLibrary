const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');


//new author route
router.get('/new', (req,res) => {
res.render('authors/new', {author: new Author() })
});

//all authors route
router.get('/', async (req,res) => {
    let searchConstrains = {};
    if(req.query.name != null && req.query.name !==''){
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
        res.redirect(`authors/${newAuthor.id}`);
        
    }catch{
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        });
    }

  });

  router.get('/:id', async (req,res)=> {
    try{
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id}).limit(6).exec();
        res.render ('authors/show', {
          author: author,
          booksByAuthor: books
        });
    }catch(e){
      console.log(e);
      res.redirect('/');
    }
    
  });

  router.get('/:id/edit', async(req,res)=> {
    try{
      const author = await Author.findById(req.params.id);
      res.render('authors/edit', { author: author});
    }
    catch{
      res.redirect('/authors');
    }
  });
  router.put('/:id', async (req,res)=> {   
    let author;
    
    try{
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`);
        
    }catch{
        if( author == null){
          res.redirect('/');
        } else{
           res.render('authors/edit', {
            author: author,
            errorMessage: 'Error updating Author'
        });
        }       
    }

    });

    router.delete('/:id', async (req, res) => {
      let author;
      
      try {
        let authorId = String(req.params.id);
        console.log('authorId-',authorId);
        
        console.log('nowy string -', makeString(authorId));
        //console.log('authorNew=', authorNew);
        let str = makeString(authorId);
        let str2 = str.join('');
        str2 = str2.trim();
        author = await Author.findById(str2);
        await author.remove()
        res.redirect('/authors')
      } catch {
        if (author == null) {
          res.redirect('/')
        } else {
          res.redirect(`/authors/${author.id}`)
        }
      }
    })

    function makeString(str){
      let newString=[];
      for(var i = 0;i<str.length; i++){
        if (  (str[i] >='0' && str[i]<='9' ) ||(str[i].match(/[a-z]/i))  ) {
          newString[i] = str[i];
        }
      }
      
      return newString;
    }
module.exports = makeString;
module.exports = router;
