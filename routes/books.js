const express = require('express');
//const author = require('../models/author');
const router = express.Router();
const Book = require('../models/book');

const Author = require('../models/author');


const imageMimeTypes =['image/jpeg','image/png', 'images/gif'];

// New book route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book())
})

//all books route
router.get('/', async (req,res) => {
  let query = Book.find();
  if(req.query.title != null && req.query.title !='') {
    query = query.regex('title', new RegExp(req.query.title, 'i') );
  }

  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter);
  }



    try{
      const books = await query.exec();
      res.render('books/index', {
        books: books,
        searchConstrains: req.query
      })
    }
    catch{
      res.redirect('/');
    }
  
});

// Create Book Route
router.post('/', async (req, res) => {
    
    const fileName = req.file != null ? req.file.filename : null;


    const book = new Book ({
      title: req.body.title,
      author: req.body.author,
      publishDate: new Date(req.body.publishDate),
      pageCount: req.body.pageCount,
      coverImageName: fileName,
      description: req.body.description
    })
    saveCover(book, req.body.cover);
    try{ 
      const newBook = await book.save();
      res.redirect(`books/${newBook.id}`)
      
    }
    catch{  
      renderNewPage(res,book, true); 
     }
    });

    //Show book route
    router.get('/:id', async(req, res)=>{
      try{
        const book = await Book.findById(req.params.id).populate('author').exec();
        res.render('books/show',{
          book:book
        });
      }catch{
        res.redirect('/');
      }
    });

    // Edit book route
    router.get('/:id/edit', async (req,res) => {
      try{
        const book = await Book.findById(req.params.id);
        renderEditPage(res, book)
      }
      catch{
        res.redirect('/');
      }
    
    });




    // Update Book Route
  router.put('/:id', async (req, res) => {
  let book
  
  try{ 
  const paramId = req.params.id;
  if(paramId.length > 25){
   let _id = paramId.substring(2, 26);
  }
  else _id = req.params.id;
  _id= _id.trim();
  
  
    
    book = await Book.findById(_id);
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishDate = new Date(req.body.publishDate);
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;
    if(req.body.cover != null && req.body.cover !== ''){
      saveCover(book, req.body.cover);
    }
    //await console.log("req.params.id", req.params.id)
    await book.save();
    res.redirect(`/books/${book.id}`)
    
  }
  catch(e){  
    console.log(e);
    if(book != null){
    renderEditPage(res,book, true); 
    }
    else{ 
      redirect('/');
    }
   }
  });

  // Delete book page
router.delete('/:id', async (req, res) => {
  let book
  try {
    book = await Book.findById(req.params.id)
    await book.remove()
    res.redirect('/books')
  } catch {
    if (book != null) {
      res.render('books/show', {
        book: book,
        errorMessage: 'Error! I can not remove the book!'
      })
    } else {
      res.redirect('/')
    }
  }
})

    async function renderNewPage(res, book, hasError = false){
      renderFormPage(res, book, 'new', hasError);
    }

    async function renderEditPage(res, book, hasError = false){
      renderFormPage(res, book, 'edit', hasError);
    }

    async function renderFormPage(res, book, form,  hasError = false){
      try{
        const authors = await Author.find({});
        const params = { 
          authors: authors,
          book: book
        };
        if(hasError) {
          if(form === 'edit'){
            params.errorMessage ="Error updating book";
          } else {
            params.errorMessage = "Error creating book";
          }
        }
        
        res.render(`books/${form}`,params);
      }catch{
        res.redirect('/books');
      }
    }
 
function saveCover(book, coverEncoded) {
  if( coverEncoded ==null ) return;
  const cover = JSON.parse(coverEncoded);
  if( cover !=null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64');
    book.coverImageType = cover.type;
  }
}

module.exports = router;
