// routes/route.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust the path as necessary
const Blog = require('../models/Blog');
const router = express.Router();

// console.log("All environment variables in route.js:", process.env); 
// const jwtSecret = process.env.JWT_SECRET;
const jwtSecret = "";//write ur jwt secret
 // Ensure JWT_SECRET is set in your .env file
// console.log("JWT Secret:", jwtSecret);
// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        console.log("No token found");
        return res.redirect('/login');
    }
    return jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            console.log("Invalid token");
            return res.redirect('/login');
        }
        req.user = user;
        console.log("Authenticated user:", req.user);
        next();
    });
};

// Routes
router.get('/signUp', (req, res) => {
    res.render('Blog_v1/signUp');
});

router.get('/login', (req, res) => {
    res.render('Blog_v1/loginPage');
});

router.get('/home', authenticateToken, (req, res) => {
    res.render('Blog_v1/homeScreen');
});
// GET route to display the dashboard with all posts
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log("Fetching posts for userId:", userId);//extra
        const posts = await Blog.find({ userId,status: 'published' }).sort({ createdAt:-1 });
        const drafts = await Blog.find({ userId,status: 'draft' }).sort({ createdAt: -1 });
         // Fetch all posts, including the new one
        // res.render('Blog_v1/dashboard', { posts: allPosts }); // Pass posts to the view
        res.render('Blog_v1/dashboard', { posts, drafts });
    } catch (error) {
        console.error("Error retrieving posts:", error);
        res.status(500).send("Error loading dashboard");
    }
});



router.get('/create-blog', (req, res) => {
    res.render('Blog_v1/createBlog'); // Assuming the EJS file is named create-blog.ejs
});
router.get('/ai-blog-generator', (req, res) => {
    res.render('Blog_v1/aiUse'); // Render the AI blog generator EJS file
});



// Route to view a specific blog post by ID
router.get('/view-blog/:id', authenticateToken, async (req, res) => {
    try {
        // Extract post ID from URL parameters
        const postId = req.params.id;
        
        // Find the post by its ID
        const post = await Blog.findById(postId);

        // If the post is not found, return a 404 error
        if (!post) {
            return res.status(404).send("Post not found");
        }

        // Render the 'view-blog' template and pass the post data
        res.render('Blog_v1/view-blog', { post });
    } catch (error) {
        console.error("Error retrieving post:", error);
        res.status(500).send("Error loading post");
    }
});

// Edit route
router.get('/edit-blog/:id', authenticateToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Blog.findById(postId); // Find the post by ID

        if (!post) {
            return res.status(404).send("Post not found");
        }

        // Render the edit page and pass the post data
        res.render('Blog_v1/edit-blog', { post });
    } catch (error) {
        console.error("Error fetching post for editing:", error);
        res.status(500).send("Error fetching post for editing");
    }
});
// Update route
router.post('/update-blog/:id', authenticateToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, content, status } = req.body;

        const updatedPost = await Blog.findByIdAndUpdate(postId, {
            title,
            content,
            status
        }, { new: true }); // The { new: true } option returns the updated document

        if (!updatedPost) {
            return res.status(404).send("Post not found");
        }

        // Redirect to the updated post's page or dashboard
        res.redirect('/dashboard');
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).send("Error updating post");
    }
});


// Mixture of client and server-side rendering
router.post('/signUp', async (req, res) => {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    try {
        if (user) {
            return res.redirect('/signUp');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        user = new User({
            name,
            email,
            password: hashedPassword,
        });
        await user.save();
        return res.status(201).json({ message: 'User added successfully' });
    } catch (err) {
        console.error('Error saving user:', err.message);
        res.status(400).send('Error: ' + err.message);
        res.redirect('/signUp');
    }
});

// Server-side rendering for login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt with email:", email);

    const user = await User.findOne({ email });
    if (!user) {
        console.log("User not found");
        return res.redirect('/signUp');
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        console.log("Password does not match");
        return res.redirect('/signUp');
    }

    const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        jwtSecret
    );

    res.cookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });
    console.log("Login successful, token generated");
    res.redirect('/dashboard');
});



router.post('/post-blog',  authenticateToken,async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.userId;
    console.log(userId);//extra
    console.log("Received post data:", { title, content }); // Log received data

    if (!title || !content) {
        return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    try {
        const newPost = new Blog({ title, content , userId ,status: 'published',createdDate: new Date() });
        await newPost.save();
        console.log("Blog post posted successfully:", newPost); // Log saved post data
        res.redirect('/dashboard');
    } catch (error) {
        console.error("Error saving blog post:", error.message);
        res.status(500).json({ success: false, message: "Error saving blog post", error: error.message });
    }
});

router.post('/save-draft', authenticateToken, async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.userId;
    console.log(userId);
    console.log("Received post data:", { title, content });
    if (!title || !content) {
        return res.status(400).json({ success: false, message: "Title and content are required" });
    }
    try {  
      const draft = new Blog({ title,content,userId,status: 'draft'});
      await draft.save();
    //   res.json({ success: true });
    console.log("Blog saved successfully:", draft); // Debug log
        // res.status(200).json({ success: true, message: "Blog saved successfully" });
      res.redirect('/dashboard');  // Redirect or respond with a success message
    } catch (error) {
      console.error(error);
      res.status(500).send('Error saving draft');
    }
  });
  

  router.delete('/delete-blog/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        await Blog.findByIdAndDelete(postId);
        res.status(200).send("Post deleted successfully"); // Send a 200 status without redirect
    } catch (error) {
        console.error("Error deleting the post:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Delete Draft Route
router.delete('/delete-draft/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Assuming the 'status' field is used to distinguish between draft and published
        const draft = await Blog.findOneAndDelete({ _id: id, status: 'draft' }); 

        if (!draft) {
            return res.status(404).json({ message: 'Draft not found or already deleted' });
        }

        res.status(200).json({ message: 'Draft deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// routes/route.js

// Read List Page - Display all published blogs for every user
// routes/blogRoutes.js (or similar)
router.get('/read-list', async (req, res) => {
    try {
        // Retrieve published posts
        const posts = await Blog.find({ status: 'published' }).sort({ createdAt: -1 });
        
        // Pass posts to the view
        res.render('Blog_v1/readList', { posts });
    } catch (error) {
        console.error("Error fetching published posts:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/signUp');
});

module.exports = router;
