const fs = require('fs');
const path = require('path');

const routes = ['auth', 'room', 'booking'];

routes.forEach(route => {
  // Controller
  const controllerCode = `
exports.placeholder = (req, res) => {
  res.json({ message: '${route} route working' });
};
  `;
  fs.writeFileSync(path.join(__dirname, 'controllers', `${route}.controller.js`), controllerCode.trim());

  // Route
  const routeCode = `
const express = require('express');
const router = express.Router();
const ${route}Controller = require('../controllers/${route}.controller');

router.get('/', ${route}Controller.placeholder);

module.exports = router;
  `;
  fs.writeFileSync(path.join(__dirname, 'routes', `${route}.routes.js`), routeCode.trim());
});

console.log('Backend routes and controllers setup successfully.');
