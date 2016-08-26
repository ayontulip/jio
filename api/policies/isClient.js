module.exports = function (req, res, next) {
    if (req.session.isClient) {
        res.locals.currentuser = req.session.currentuser;
        return next();
    }
    else if (req.session.authenticated) {
        return res.forbidden('You are not permitted to perform this action.');
    }
    else {
        return res.redirect('/client');
    }
};