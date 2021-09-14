//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require('lodash');
const time = require(`${__dirname}/time.js`)

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/blogpostDB', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const postSchema = mongoose.Schema({
  postTitle: String,
  postBody: String,
  updated: {
    type: Date,
    default: Date.now
  }
})

const Post = mongoose.model('post', postSchema)

const posts = []
app.get('/', (req, res) => {
  res.render('home', {
    title: 'Home Page',
    homeContent: homeStartingContent,
    addPosts: posts
  })
})

app.get('/about-us', (req, res) => {
  res.render('about', {
    title: 'About us',
    aboutContent: aboutContent
  })
})

app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact us',
    contactContent: contactContent
  })
})

app.get('/compose', (req, res) => {
  res.render('compose', {
    title: 'Add New Post'
  })
})

app.post('/compose', (req, res) => {
  var newTitle = req.body.postTitle
  var newBody = req.body.postBody

  var post = {
    title: newTitle,
    body: newBody
  }
  posts.push(post)
  console.log(posts)

  const addPost = Post({
    postTitle: newTitle,
    postBody: newBody,
    updated: Date.now()

  })
  addPost.save()
  res.redirect('/')
})

app.get('/post/:title', (req, res) => {
  const title = _.lowerCase([req.params.title])
  posts.map((item) => {
    const numberOfWords = item.body.length
    if (title === _.lowerCase([item.title])) {
      res.render('post', {
        title: item.title,
        postPage: item.body,
        timeOfReading: time.estimatedTime(numberOfWords)
      })
    }

  })

})


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
