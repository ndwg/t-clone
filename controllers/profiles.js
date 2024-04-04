const User = require('../models/user');

module.exports.renderProfile = async (req,res) => {
    const profile = await User.findById(req.params.id).populate({
        path: 'posts',
        populate: {path: 'author'}
    });
    if(!profile){
        req.flash('error','Cannot find that user!');
        return res.redirect('/posts');
    }
    res.render('profiles/show', {profile});
}

module.exports.renderNewEdit = async (req,res) => {
    const profile = await User.findById(req.params.id);
    if(!profile){
        req.flash('error','Cannot find that user!');
        return res.redirect('/posts');
    }
    res.render('profiles/edit', {profile});
}

module.exports.updateProfile = async (req,res) => {
    const{id} = req.params;
    const profile = await User.findByIdAndUpdate(id, {...req.body.user});
    profile.pfp = {
        url: req.file.path,
        filename: req.file.filename
    };
    await profile.save();
    req.flash('success','Successfully updated profile!');
    res.redirect(`/users/${profile._id}`);
}