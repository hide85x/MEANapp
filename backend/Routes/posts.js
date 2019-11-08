const express = require('express');
const router = express.Router();
const fs = require('fs');

const isAuth = require('../middleware/is-auth')
const Post = require('../Models/Post');

const postsController= require('../controllers/post')
const extractFile= require('../middleware/multer_storage'); // nasz zaimportowany multerowy szajs


router.post('/', isAuth, extractFile, postsController.addPost  );

router.get('/', postsController.getPosts);

router.get('/:id', postsController.getPost)

router.put('/:id', isAuth, extractFile, postsController.updatePost)

router.delete('/:id', isAuth, postsController.deletePost)


module.exports = router