var express = require('express');

var bodyParser = require('body-parser');
var mysql = require('promise-mysql');
var RedditAPI = require('../reddit');

var app = express();

//built connection before RedditAPI
var connection = mysql.createPool({
    host     : 'localhost',
    user     : 'root', // CHANGE THIS :)
    password : '',
    database: 'reddit',
    connectionLimit: 10
});

//Then link API to myReddit
var myReddit = new RedditAPI(connection);

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'pug');

// EXERCISE 1
app.get('/hello', function(request, response) {            //requestuest handler
  response.send('<h1>Hello World!</>');
});


//Exercise 2
app.get('/hello', function (request, response) {
  if (request.query.name) {
    response.send('<h1>Hello ' + request.query.name + '!</h1>');
  }
  else {
    response.send('<h1>Hello World!</h1>'); 
  }

});


//Exercise 3
app.get('/calculator/:operation', function (request, response) {
  
  if (request.params.operation === 'add' || request.params.operation === 'multiply') {
    var operationResult = {
        operation     : request.params.operation,
        firstOperand  : Number(request.params.num1),
        secondOperand : Number(request.params.num2),
        solution      : myReddit.calculator(request.params.operation, Number(request.params.num1), Number(request.params.num2))
    };
        response.send(operationResult);
  } else {
        response.status(400).send('error 400 Bad Request');
    }
});



//Exercise 4
app.get('/posts', function(request, response) {

  myReddit.getAllPosts()
    .then(allPosts => {
      response.render('post-list', {allPosts: allPosts});
      // var postList = `
      // <div id="posts">
      //   <h1>List of posts</h1>
      //   <ul class="posts-list">
      //   ${allPosts.map(post => {
      //   return `
      //     <li class="post-item">
      //       <h2 class="post-item__${post.posts_title}" >
      //         <a href="http://${post.posts_url}/">${post.posts_title}</a>
      //       </h2>
      //       <p>Created by ${post.user.users_username }</p>
      //     </li>`;
      // }).join("")}
      //   </ul>
      // </div>`;

      // res.send(postList);
    });
});  


//Exercise 5
app.get('/new-post', function(request, response) {
    response.send(`
        <form action="/createPost" method="POST"><!-- why does it say method="POST" ?? -->
          <p>
            <input type="text" name="url" placeholder="Enter a URL to content">
          </p>
          <p>
            <input type="text" name="title" placeholder="Enter the title of your content">
          </p>
          <button type="submit">Create!</button>
        </form>
    `);
});


//Exercise 6
app.post('/createPost', function(request, response) {
    myReddit.createPost({
        url: request.body.url,
        title: request.body.title,
        subredditId: 1,
        userId: 1
    }).then(function(result) {
        response.redirect('posts');
    });
});


//Exercise 7
app.get('/createContent', function(request, response) {
    response.render('create-content');
});


//Exercise 8
//Done!!!!



/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  console.log('Example app listening at http://%s', process.env.C9_HOSTNAME);
});
