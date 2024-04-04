const User = require('../models/user');

module.exports.renderRegister = (req,res) => {
    res.render('users/register');
}

module.exports.register = async (req,res) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username, 
            pfp:{
                url: 'https://res.cloudinary.com/dcgrlgof8/image/upload/v1712183302/T-Clone/huyoh7fmjdwwzmyqrqja.png',
                filename: 'T-Clone/huyoh7fmjdwwzmyqrqja'
            }
        });
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, err=>{
            if(err) return next(err);
            req.flash('success','Welcome to T-Clone!');
            res.redirect('/posts');
        });
    }catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req,res) => {
    res.render('users/login');
}

module.exports.login = (req,res) => {
    req.flash('success','Welcome back!');
    const redirectUrl = res.locals.returnTo || '/posts';
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res) => {
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/posts');
    });
}