// authMiddleware.js
function isAuthenticatedDriver(req, res, next) {
  if (req.session.user && req.session.user?.user_type === "Driver") {
    return next();
  } else if (!req.session.user) {
    res.redirect("/login");
  } else {
    if (req.session.user?.user_type === "Admin") {
      res.redirect("/appointment");
    } else {
      res.redirect("/examiner");
    }
  }
}

function isNotAuthenticated(req, res, next) {
  if (req.session.user) {
    res.redirect("/g2-test");
  } else {
    return next();
  }
}

function isUserAdmin(req, res, next) {
  if (req.session.user && req.session.user?.user_type === "Admin") {
    return next();
  } else if (!req.session.user) {
    res.redirect("/login");
  }
  else {
    if (req.session.user?.user_type === "Examiner") {
      res.redirect("/examiner");
    } else {
      res.redirect("/g2-test");
    }
  }
}

function isAuthenticatedExaminer(req, res, next) {
  if (req.session.user && req.session.user?.user_type === "Examiner") {
    return next();
  } else if (!req.session.user) {
    res.redirect("/login");
  } else {
    if (req.session.user?.user_type === "Driver") {
      res.redirect("/g2-test");
    } else {
      res.redirect("/appointment");
    }
  }
}

export { isAuthenticatedDriver, isNotAuthenticated, isUserAdmin, isAuthenticatedExaminer };
