// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const fs = require("fs");

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static("public"));
// app.set("view engine", "ejs");

// // Route for the homepage
// app.get("/", (req, res) => {
//   const posts = getPosts(); // Retrieve all blog posts
//   res.render("index", { posts });
// });

// // Route for displaying a specific blog post
// app.get("/blog/:id", (req, res) => {
//   const postId = req.params.id;
//   const post = getPost(postId); // Retrieve the specific blog post
//   res.render("blog", { post });
// });

// // Route for adding a new blog post
// app.get("/add", (req, res) => {
//   res.render("add");
// });

// app.post("/add", (req, res) => {
//   const newPost = req.body;
//   savePost(newPost); // Save the new blog post
//   res.redirect("/");
// });

// // Route for editing an existing blog post
// app.get("/edit/:id", (req, res) => {
//   const postId = req.params.id;
//   const post = getPost(postId); // Retrieve the specific blog post
//   res.render("edit", { post });
// });

// app.post("/edit/:id", (req, res) => {
//   const postId = req.params.id;
//   const updatedPost = req.body;
//   updatePost(postId, updatedPost); // Update the existing blog post
//   res.redirect("/");
// });

// // Route for deleting a blog post
// app.post("/delete/:id", (req, res) => {
//   const postId = req.params.id;
//   deletePost(postId); // Delete the specific blog post
//   res.redirect("/");
// });

// // Route for adding a comment to a blog post
// app.post("/comment/:id", (req, res) => {
//   const postId = req.params.id;
//   const comment = req.body;
//   addComment(postId, comment); // Add the comment to the specific blog post
//   res.redirect("/blog/" + postId);
// });

// // Retrieve all blog posts from a JSON file
// function getPosts() {
//   const data = fs.readFileSync("posts.json");
//   return JSON.parse(data);
// }

// // Retrieve a specific blog post by ID
// function getPost(id) {
//   const posts = getPosts();
//   return posts.find((post) => post.id === id);
// }

// // Save a new blog post to the JSON file
// function savePost(newPost) {
//   const posts = getPosts();
//   newPost.id = Date.now().toString();
//   posts.push(newPost);
//   fs.writeFileSync("posts.json", JSON.stringify(posts));
// }

// // Update an existing blog post in the JSON file
// function updatePost(id, updatedPost) {
//   const posts = getPosts();
//   const index = posts.findIndex((post) => post.id === id);
//   if (index !== -1) {
//     posts[index] = { ...posts[index], ...updatedPost };
//     fs.writeFileSync("posts.json", JSON.stringify(posts));
//   }
// }

// // Delete a blog post from the JSON file
// function deletePost(id) {
//   const posts = getPosts();
//   const filteredPosts = posts.filter((post) => post.id !== id);
//   fs.writeFileSync("posts.json", JSON.stringify(filteredPosts));
// }

// // Add a comment to a specific blog post
// function addComment(id, comment) {
//   const posts = getPosts();
//   const index = posts.findIndex((post) => post.id === id);
//   if (index !== -1) {
//     posts[index].comments.push(comment);
//     fs.writeFileSync("posts.json", JSON.stringify(posts));
//   }
// }

// app.listen(3030, () => {
//   console.log("Server is running on port 3030");
// });

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Route for the homepage
app.get("/", (req, res) => {
  const posts = getPosts(); // Retrieve all blog posts
  res.render("index", { posts });
});

// Route for displaying a specific blog post
app.get("/blog/:id", (req, res) => {
  const postId = req.params.id;
  const post = getPost(postId); // Retrieve the specific blog post
  res.render("blog", { post });
});

// Route for adding a new blog post
app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", (req, res) => {
  const newPost = req.body;
  const validationErrors = validatePost(newPost); // Validate required fields
  if (validationErrors.length > 0) {
    res.render("add", { errors: validationErrors, post: newPost });
  } else {
    savePost(newPost); // Save the new blog post
    res.redirect("/");
  }
});

// Route for editing an existing blog post
app.get("/edit/:id", (req, res) => {
  const postId = req.params.id;
  const post = getPost(postId); // Retrieve the specific blog post
  res.render("edit", { post });
});

app.post("/edit/:id", (req, res) => {
  const postId = req.params.id;
  const updatedPost = req.body;
  const validationErrors = validatePost(updatedPost); // Validate required fields
  if (validationErrors.length > 0) {
    res.render("edit", { errors: validationErrors, post: updatedPost });
  } else {
    updatePost(postId, updatedPost); // Update the existing blog post
    res.redirect("/");
  }
});

// Route for deleting a blog post
app.post("/delete/:id", (req, res) => {
  const postId = req.params.id;
  deletePost(postId); // Delete the specific blog post
  res.redirect("/");
});

// Route for adding a comment to a blog post
app.post("/comment/:id", (req, res) => {
  const postId = req.params.id;
  const comment = req.body;
  const validationErrors = validateComment(comment); // Validate required fields
  if (validationErrors.length > 0) {
    const post = getPost(postId);
    res.render("blog", { post, errors: validationErrors });
  } else {
    addComment(postId, comment); // Add the comment to the specific blog post
    res.redirect("/blog/" + postId);
  }
});

// Retrieve all blog posts from a JSON file
function getPosts() {
  try {
    const data = fs.readFileSync("posts.json");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading posts.json:", error);
    return [];
  }
}

// Retrieve a specific blog post by ID
function getPost(id) {
  const posts = getPosts();
  return posts.find((post) => post.id === id);
}

// Save a new blog post to the JSON file
function savePost(newPost) {
  try {
    let posts = getPosts();
    if (!posts) {
      posts = []; // Initialize as an empty array if the file is empty or doesn't exist
    }
    newPost.id = Date.now().toString();
    posts.push(newPost);
    fs.writeFileSync("posts.json", JSON.stringify(posts));
  } catch (error) {
    console.error("Error saving new post:", error);
  }
}

// Update an existing blog post in the JSON file
function updatePost(id, updatedPost) {
  try {
    const posts = getPosts();
    const index = posts.findIndex((post) => post.id === id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updatedPost };
      fs.writeFileSync("posts.json", JSON.stringify(posts));
    }
  } catch (error) {
    console.error("Error updating post:", error);
  }
}

// Delete a blog post from the JSON file
function deletePost(id) {
  try {
    const posts = getPosts();
    const filteredPosts = posts.filter((post) => post.id !== id);
    fs.writeFileSync("posts.json", JSON.stringify(filteredPosts));
  } catch (error) {
    console.error("Error deleting post:", error);
  }
}

// Add a comment to a specific blog post
function addComment(id, comment) {
  try {
    const posts = getPosts();
    const index = posts.findIndex((post) => post.id === id);
    if (index !== -1) {
      if (!posts[index].comments) {
        posts[index].comments = []; // Initialize comments as an empty array if it doesn't exist
      }
      posts[index].comments.push(comment);
      fs.writeFileSync("posts.json", JSON.stringify(posts));
    }
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}

// Validate required fields for a blog post
function validatePost(post) {
  const errors = [];
  if (!post.title) {
    errors.push("Title is required.");
  }
  if (!post.content) {
    errors.push("Content is required.");
  }
  return errors;
}

// Validate required fields for a comment
function validateComment(comment) {
  const errors = [];
  if (!comment.author) {
    errors.push("Author name is required.");
  }
  if (!comment.text) {
    errors.push("Comment text is required.");
  }
  return errors;
}

app.listen(3020, () => {
  console.log("Server is running on port 3020");
});
