module.exports = function (req, res, next) {
    if (req.session.isClient) {
        return res.forbidden('You are not permitted to perform this action.');
    }
    else if (req.session.authenticated) {
        res.locals.currentuser = req.session.currentuser;
        return next();
    }
    else {
        return res.redirect('/');
    }
};