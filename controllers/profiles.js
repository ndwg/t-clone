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
    let flag = true;

    for(let i = 0; i < currentUser.following.length; i++){
        if(currentUser.following[i]._id.toHexString()===profile._id.toHexString()){
            currentUser.following.splice(i,1);
            flag = false;
            for(let j = 0; j < profile.followers.length; j++){
                if(profile.followers[j]._id.toHexString()===currentUser._id.toHexString()){
                    profile.followers.splice(j,1);
                    break;
                }
            }
            break;
        }
    }

    if(flag){
        currentUser.following.push(profile);
        profile.followers.push(currentUser);
    }

    console.log(profile);
    console.log(currentUser);

    await profile.save();
    await currentUser.save();
    res.redirect(`/users/${profile._id}`);
}