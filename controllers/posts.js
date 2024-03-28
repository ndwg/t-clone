const Post = require('../models/post');

module.exports.index = async (req,res) => {
    const posts = await Post.find({}).populate('author');
    res.render('posts/index', {posts});
}

module.exports.renderNewPost = (req,res) => {
    res.render('posts/new');
    //console.log(req.user.posts);
}

module.exports.createPost = async (req,res,next) => {
    const post = new Post(req.body.post);
    const profile = req.user;
    post.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    post.author = req.user._id;
    profile.posts.push(post);
    await post.save();
    await profile.save();
    req.flash('success','Successfully made a new post!');
    res.redirect(`/posts/${post._id}`);
}

module.exports.showPost = async (req,res) => {
    const post = await Post.findById(req.params.id).populate({
        path: 'replies',
        populate: {path: 'author'}
    }).populate({
        path: 'parent',
        populate: {path: 'author'}
    }).populate('author');
    if(!post){
        req.flash('error','Cannot find that post!');
        return res.redirect('/posts');
    }
    res.render('posts/show', {post});
}

module.exports.renderNewEdit = async (req,res) => {
    const post = await Post.findById(req.params.id);
    if(!post){
        req.flash('error','Cannot find that post!');
        return res.redirect('/posts');
    }
    res.render('posts/edit', {post});
}

module.exports.renderNewReply = async (req,res) => {
    const post = await Post.findById(req.params.id);
    res.render('posts/reply', {post});
}

module.exports.updatePost = async (req,res) => {
    const{id} = req.params;
    const post = await Post.findByIdAndUpdate(id, {...req.body.post});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    post.images.push(...imgs);
    await post.save();
    req.flash('success','Successfully updated post!');
    res.redirect(`/posts/${post._id}`);
}

module.exports.createReply = async (req,res,next) => {
    const parent = await Post.findById(req.params.id);
    const post = new Post(req.body.post);
    const profile = req.user;
    post.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    post.parent = parent.id;
    parent.replies.push(post);
    post.author = req.user._id;
    profile.posts.push(post);
    await post.save();
    await parent.save();
    await profile.save();
    req.flash('success','Successfully made a new reply!');
    res.redirect(`/posts/${post._id}`);
}

module.exports.deletePost = async (req,res) =>{
    const{id} = req.params;
    //const profile = req.user;
    //await profile.posts.
    await Post.findByIdAndDelete(id);
    req.flash('success','Successfully deleted post!');
    res.redirect('/posts');
}