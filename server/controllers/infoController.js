const infoController = {};

infoController.getInfo = (req, res, next) => {
  const values = {
    "ok": true,
    "author": {
      "email": "yokokawamoto@gmail.com",
      "name": "Yoko Kawamoto"
    },
    "frontend": {
      "url": "string, the url of your frontend."
    },
    "language": "node.js",
    "sources": "https://github.com/libero-yoko/collab-editor.git",
    "answers": {
      "1": "string, answer to the question 1",
      "2": "string, answer to the question 2",
      "3": "string, answer to the question 3"
    }
  }

  res.locals.info = values;
  return next();

}

export default infoController