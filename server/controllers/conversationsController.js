import collabEditors from '../models/collabEditorModel.js';
const conversationsController = {};

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

conversationsController.deleteConversation = (req, res, next)=>{
  console.log("deleting",  [req.params.id])
  const id =  [req.params.id];
  console.log(id)
  if(!id){
    const err = new Error('missing id');
    err.statusCode = 400;
    next(err);
  }else{

    collabEditors.deleteOne({"_id":id})
    .then(conversations => {
      if(!conversations){
        const err = new Error('No data stored under the given Id');
        err.statusCode = 400;
        next(err);
      }else{
        res.locals.message = {
          "msg": "Successfully Deleted" + conversations.ok + " Conversations",
          "ok": true,
      };
        // console.log(res.locals.message);
        return next();
     };
    });
  };
};

export default conversationsController;

