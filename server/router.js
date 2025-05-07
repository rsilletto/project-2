const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getTasks', mid.requiresLogin, controllers.Task.getTasks);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Task.makerPage);
  app.get('/maker', mid.requiresLogin, controllers.Task.getTasks);
  app.post('/maker', mid.requiresLogin, controllers.Task.makeTasks);

  app.post('/removeTask', mid.requiresLogin, controllers.Task.removeTask);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
