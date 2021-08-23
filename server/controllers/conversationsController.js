import collabEditors from '../models/collabEditorModel.js';
const conversationsController = {};

conversationsController.getConversations = (req, res, next)=>{
  
  collabEditors.find({})
  .then(conversations => {
    console.log(conversations.length)
    if(conversations.length === 0){
      const err = new Error('No data stored under the given Id');
      err.statusCode = 400;
      next(err);
    }else{
      res.locals.message = {
        "msg": "Successfully Retreived Conversations",
        "ok": true,
        "conversations": conversations
    };
      console.log(res.locals.message);
      return next();
    }
  })
  // .catch((err) => {
  //   return next(err);
  // })
}



export default conversationsController;