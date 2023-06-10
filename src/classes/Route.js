const { ensureAuthenticated } = require('../middlewares');
const { errorHandler, notFoundHandler } = require('../middlewares');

class Route {
  constructor(path) {
    if (!path) throw new Error('Path is required');
    this.router = require('express').Router();
    this.path = path;
  }

  get(path, ...handlers) {
    this.router.get(path, ...handlers);
    return this;
  }

  post(path, ...handlers) {
    this.router.post(path, ...handlers);
    return this;
  }

  put(path, ...handlers) {
    this.router.put(path, ...handlers);
    return this;
  }

  delete(path, ...handlers) {
    this.router.delete(path, ...handlers);
    return this;
  }

  routes() {
    this.router.use(errorHandler, notFoundHandler);
    return this.router
  }
}


module.exports = {
  Route,
}
