const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const userModel = require('./models/user');
const postModel = require('./models/post');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/profile', isLoggedin, async (req, res) => {
    try {
        let user = await userModel
            .findOne({ email: req.user.email })
            .populate("posts");
        res.render("profile", { user });
    } catch (err) {
        res.status(500).send(err.message);
    }
});
app.get('/like/:id', isLoggedin, async (req, res) => {
    try {
        let post = await postModel
            .findOne({ _id: req.params.id })
            .populate("user");
            if(post.likes.indexOf(req.user.userid) === -1){
                post.likes.push(req.user.userid);
            }
            else{
                post.likes.splice(post.likes.indexOf(req.user.userid), 1);
            }
            await post.save();
            res.redirect("/profile")
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// Show edit form
app.get("/edit/:id", async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id); // ✅ fixed
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.render("edit", { post });
    } catch (err) {
        console.error("Error fetching post:", err);
        res.status(500).send("Server Error");
    }
});

// Handle edit submission (POST)
app.post("/edit/:id", async (req, res) => {
    try {
        await postModel.findByIdAndUpdate(req.params.id, { content: req.body.content }); // ✅ fixed
        res.redirect("/profile");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});



app.post('/post', isLoggedin, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        let { content } = req.body;

        // Create post and store in variable
        let post = await postModel.create({
            user: user._id,
            content
        });

        // Push the post's ID into user's posts array
        user.posts.push(post._id);
        await user.save();

        res.redirect('/profile');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/register', async (req, res) => {
    try {
        let { username, email, password, name, age } = req.body;

        // Check if user already exists
        let existingUser = await userModel.findOne({ email });
        if (existingUser) return res.status(400).send("User already exists");

        // Hash password
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt);

        // Create user
        let createdUser = await userModel.create({
            name,
            username,
            email,
            password: hash,
            age
        });

        // Generate JWT
        let token = jwt.sign({ email }, "shhhhhhh");
        res.cookie("token", token);

        res.send(createdUser);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/login", (req, res) => {
    res.render('login');
});

app.post("/login", async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("User not found");

        let match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            let token = jwt.sign({ email: user.email }, "shhhhhhh");
            res.cookie("token", token);
            res.redirect("/profile");
        } else {
            res.status(400).send("Invalid password");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
});

function isLoggedin(req, res, next) {
    if (!req.cookies.token) {
        return res.redirect("/login");
    }
    try {
        let data = jwt.verify(req.cookies.token, "shhhhhhh");
        req.user = data;
        next();
    } catch (err) {
        res.redirect("/login");
    }
}

app.listen(3000, () => console.log("Server running on port 3000"));
