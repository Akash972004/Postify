# Postify
A simple social media-style web app built with **Node.js**, **Express**, **MongoDB**, and **EJS**. Users can register, log in, create posts, like/unlike posts, and edit their content.

## 🚀 Features
- **User Authentication** – Secure login/register with **JWT** and **bcrypt**
- **Profile Page** – View your posts and likes
- **Like/Unlike System** – Toggle likes on posts
- **Edit Posts** – Update your post content anytime
- **Secure Routes** – Only logged-in users can post or like
- **EJS Templates** – Server-side rendered views
- **MongoDB Database** – Store users and posts

## 🛠 Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt.js, cookie-parser
- **Templating:** EJS
- **Styling:** CSS, Public Assets
- **Other:** Path, dotenv

## 📂 Project Structure
.
├── models
│   ├── user.js
│   └── post.js
├── public
│   ├── css/
│   └── js/
├── views
│   ├── index.ejs
│   ├── profile.ejs
│   ├── login.ejs
│   └── edit.ejs
├── app.js
└── package.json

## ⚙️ Installation & Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/postify.git
   cd postify
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Setup environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=shhhhhhh
   PORT=3000
   ```
4. **Run the app**
   ```bash
   node app.js
   ```
   Or with nodemon:
   ```bash
   npx nodemon app.js
   ```
5. **Open in browser**
   Visit http://localhost:3000
