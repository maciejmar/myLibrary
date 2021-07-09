const mongoose = require('mongoose');
const path = require('path');
const coverImageBasePath="uploads/bookCovers"
const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    description:{
        type:String
        
    },
    publishDate:{
        type: Date,
        required: true
    },
    pageCount:{
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    cover: { 
        type: String,
        required: true,
        default: 'BookExample.jpg'
    }

});

bookSchema.virtual('coverImagePath').get(function() {
    if(this.coverImageName != null) {
        return path.join('/',coverImageBasePath,this.coverImageName)
    }
});


module.exports = mongoose.model('Book', bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;
