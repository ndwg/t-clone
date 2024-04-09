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

module.exports.follow = async (req,res) =>{
    const{id} = req.params;
    const currentUser = req.user;
    const profile = await User.findById(id);

    const i = currentUser.following.findIndex(p => p._id.toHexString() === profile._id.toHexString());

    if(i > -1){
        currentUser.following.splice(i,1);
        const j = profile.followers.findIndex(p => p._id.toHexString() === currentUser._id.toHexString());
        profile.followers.splice(j,1);
    }
    else{
        currentUser.following.push(profile);
        profile.followers.push(currentUser);
    }

    await profile.save();
    await currentUser.save();
    res.redirect(`/users/${profile._id}`);
}