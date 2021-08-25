/************************************************ 
  Controller: conversations
*************************************************/

import collabEditors from '../models/collabEditorModel.js';
const conversationsController = {};

/***************************** 
  Get Conversations
******************************/

conversationsController.getConversations = (req, res, next)=>{
  
  collabEditors.find({})
  .then(conversations => {
    // console.log(conversations.length)
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
      // console.log(res.locals.message);
      return next();
    }
  })
}

/***************************** 
  Delete Conversations
******************************/

conversationsController.deleteConversation = (req, res, next)=>{
  const id =  [req.params.id];
  if(!id){
    const err = new Error('missing id');
    err.statusCode = 400;
    next(err);
  }else{

    collabEditors.deleteOne({"_id":id})
    .then(res => {
      if(res.deletedCount === 0){
        const err = new Error('No data stored under the given Id');
        err.statusCode = 400;
        next(err);
      }else{
        res.locals.message = {
          "msg": "Successfully Deleted" + res.deletedCount + " Conversations",
          "ok": true,
      };
        return next();
     };
    })
    .catch((err) => {
      err.statusCode = 400;
      next(err);
    })

  };
};

export default conversationsController;

