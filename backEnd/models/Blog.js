const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },

    userId: { // Add userId field
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

});

const Blog = mongoose.model('Blog', blogSchema);

module.exports=Blog;