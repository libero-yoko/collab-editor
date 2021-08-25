/************************************************ 
  Controller: info
*************************************************/
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
      "1": "First I setup the backend environment with Node.js/Express/Webpack/MongoDB(MongoAtlas) and tested endpoints with Postman. As for algorythm part, I could only implement with one collision case when the previous mutation coodinate has the same coordinate with the current one. Here is my spreadsheet how to approach the multiple collision cases. https://docs.google.com/spreadsheets/d/14R3Z7MqMdV5DkcnEovkaRBJJQlHa-WEfg-5qWRtBXAQ/edit?usp=sharing I think this can be solved either with linked list or traversing through the array of objeects.",
      "2": "I would like to continue working on the backend algorythm",
      "3": "Since this was the significant amont of work, I would probably reduce the volume of the work by 30%."
    }
  }

  res.locals.info = values;
  return next();

}

export default infoController