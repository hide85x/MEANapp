const express = require('express');
const router = express.Router();
const multer = require('multer');

const fs = require('fs');
const isAuth = require('../middleware/is-auth')
const Post = require('../Models/Post');


module.exports.addPost= (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const userId = req.userData.userId
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: userId
    });
    newPost.save()
        .then(post => {
            res.status(201).json({
                message: " post created",
                post: {
                    id: post._id,
                    title: post.title,
                    content: post.content,
                    imagePath: post.imagePath
                } // chcemy go podac do angular service zeby miec dostep do id, zamiast podawac null
            })
        })
        .catch(err => {
            console.log(err)
            res.json({
                msg: err.message
            })
        })
}


module.exports.getPosts= async (req, res, next) => {
    const pageSize = +req.query.pageSize; // zawsze bedzie stringiem dlatego +
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery
        .then(posts => {
            fetchedPosts = posts
            // console.log(posts)
            return Post.countDocuments() // jesli zwracamy w then bloku promise type object to nie musimy pakowac go w kolejny then
        })
        .then(count => {
            console.log(count + " all of our posts")
            res.status(200).json({
                message: "Posts fecthed",
                posts: fetchedPosts,
                count: count
            });

        })
        .catch(err => console.log(err))
}

module.exports.getPost= (req, res, next) => {

    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                // console.log(post + ' in edit mode, from get single post endpoint')
                res.status(200).json(post)
            } else {
                res.status(404).json({ msg: "Post was not found!" })
            }
        })
        .catch(err => console.log(err))
}

module.exports.updatePost= (req, res, next) => {
    let imagePath = req.body.imagePath;

    // console.log("our file from  put request", req.file);

    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename

    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    })
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
        .then(result => {
            res.status(200).json({
                msg: "Post updated!"
            })
        })
        .catch(err => console.log(err))
}


module.exports.deletePost= (req, res, next) => {
    const postId = req.params.id;
    console.log(postId)
    Post.findOneAndDelete({ _id: postId })
        .then((results) => {
            console.log(results)
            console.log('post deleted !')
            res.status(200).json({
                msg: 'post deleted / msg from node server'
            })

        })
        .catch(err => console.log(err))
}