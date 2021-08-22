const infoController = {};

infoController.getInfo = (req, res, next) => {
  const values = {
    "ok": true,
    "author": {
      "email": "yokokawamoto@gmail.com",
      "name": "Yoko Kawamoto"
    },
    "frontend": {
      "url": "http://54.212.195.53/"
    },
    "language": "node.js",
    "sources": "https://github.com/libero-yoko/collab-editor.git",
    "answers": {
      "1": "First I setup the backend environment with Node.js/Express/Webpack/MongoDB(MongoAtlas), then started working on the server settings, separating routers, models and controllers. After everything connected I worked on the actual logic of mutation in the mutationsController.js where you can see how the texts gets mutated. I used Postman to test locally, and setup AWS Lightsail to host the backend/frontend. I modified the Apache setteings in the config file so Apache redirects the trafic to the Node.js. Finally connected MongoAtlas to Lightsail.",
      "2": "I probaly spent too much time on the configuration. I would love to start implementing the frontend",
      "3": "I would probably reduce the volume of the work by 30%?"
    }
  }

  res.locals.info = values;
  return next();

}

export default infoController