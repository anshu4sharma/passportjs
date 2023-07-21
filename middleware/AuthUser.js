class AuthUser {
  static async IsUserAuth(req, res, next) {
    console.log(req.user,req.isAuthenticated());
    try {
      if (!req.user) {
        return res.json({
          message: "You are not Authenticated ",
        });
      }
      next();
    } catch (error) {
      res.json(error);
    }
  }
}

exports.AuthUser = AuthUser;
