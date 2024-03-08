const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const{postSchema} = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const Post = require('../models/post');

const validatePost = (req,res,next) =>{
    const {error} = postSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

router.get('/', catchAsync(async (req,res) => {
    const posts = await Post.find({});
    res.render('posts/index', {posts});
}));

router.get('/new', (req,res) => {
    res.render('posts/new');
});

router.post('/', validatePost, catchAsync(async (req,res,next) => {
    //if(!req.body.post) throw new ExpressError('Invalid Post Data', 400);
    
    const post = new Post(req.body.post);
    await post.save();
    res.redirect(`/posts/${post._id}`);
}));

router.get('/:id', catchAsync(async (req,res) => {
    const post = await Post.findById(req.params.id).populate('replies').populate('parent');
    res.render('posts/show', {post});
}));

router.get('/:id/edit', catchAsync(async (req,res) => {
    const post = await Post.findById(req.params.id);
    res.render('posts/edit', {post});
}));

router.get('/:id/reply', catchAsync(async (req,res) => {
    const post = await Post.findById(req.params.id);
    res.render('posts/reply', {post});
}));

router.put('/:id', validatePost, catchAsync(async (req,res) => {
    const{id} = req.params;
    const post = await Post.findByIdAndUpdate(id, {...req.body.post});
    res.redirect(`/posts/${post._id}`);
}));

router.post('/:id', validatePost, catchAsync(async (req,res,next) => {
    //if(!req.body.post) throw new ExpressError('Invalid Post Data', 400);
    
    const parent = await Post.findById(req.params.id);
    const post = new Post(req.body.post);
    post.parent = parent.id;
    parent.replies.push(post);
    await post.save();
    await parent.save();
    //console.log(post);
    //console.log(parent);
    res.redirect(`/posts/${post._id}`);
}));

router.delete('/:id', catchAsync(async (req,res) =>{
    const{id} = req.params;
    await Post.findByIdAndDelete(id);
    res.redirect('/posts');
}));

module.exports = router;