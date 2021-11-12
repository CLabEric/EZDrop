module.exports.isAuth = (req, res, next) => {
    console.log(req.session);
    if (req.isAuthenticated()) {
        next();
    } else {
        console.log('not logged in....');
        res.status(401).json({ msg: 'You are not authorized to view this resource' });
    }
}

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.admin) {
        next();
    } else {
        res.status(401).json({ msg: 'You are not authorized to view this resource because you are not an admin.' });
    }
}