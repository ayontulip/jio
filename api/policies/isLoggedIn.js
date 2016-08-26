module.exports = function(req, res, next) {
   if (req.session.authenticated) {
       res.locals.currentuser = req.session.currentuser;
        return next();
    }
    else{
        return res.redirect('/login');
    }
};