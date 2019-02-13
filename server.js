const express = require('express');
const app = express();
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
  });

let posts = [
    {
        id: 1,
        content: "This is my first post."
    },
    {
        id: 2,
        content: "Feeling really awesome today."
    },
    {
        id: 3,
        content: "Seems like love is in the air."
    }
]

app.get('/api/posts', (req, res)=>{
    res.send(JSON.stringify(posts));
});

app.get('/api/posts/:id', (req, res)=>{
    let post = posts.find(p=> p.id === parseInt(req.params.id));
    if(post) res.send(post);
    else res.status(404).send("Requested post does not exist.");
});

app.post('/api/posts', (req, res)=>{
    let postContent = req.body.content.trim();
    let post = {};
    if(postContent && postContent.length>3)
    {
        post = {
            id: posts.length+1,
            content: postContent
        };
        posts.push(post);
        res.send(post);
    }
    else 
    {
        res.status(400).send("Please add some post content and make sure it is more than 3 characters.");
    }
});

app.put('/api/posts/:id', (req, res)=>{
    let post = posts.find(p=> p.id === parseInt(req.params.id));
    let postContent = req.body.content.trim();
    
    if(!post)
    {
        res.status(404).send("Requested post could not be found.");
        return;
    }

    if(postContent && postContent.length>3)
    {
        post.content = postContent;
        res.send(post);
        return;
    }
    else
    {
        res.status(400).send("Please add some post content and make sure it is more than 3 characters.");
    }

});

app.delete('/api/posts/:id', (req, res)=>{
    let post = posts.find(p=> p.id === parseInt(req.params.id));
    
    if(!post)
    {
        res.status(404).send("Requested post could not be found.");
        return;
    }
    
    posts.splice(posts.indexOf(post), 1);
    res.send(post);
});

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", port " + server_port )
});