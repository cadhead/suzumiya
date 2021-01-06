import { page, user } from './commonvars';

export const before = async (req, res, next) => {
  Object.assign(res.locals, {
    user: req.session.user || user,
    page
  });

  Object.assign(res.locals.page, {
    messages: req.flash('messages'),
    css: req.app.locals.staticFiles.css,
    js: req.app.locals.staticFiles.js
  });

  next();
};