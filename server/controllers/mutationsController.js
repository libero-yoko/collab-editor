/************************************************ 
  Controller: mutations
*************************************************/
import collabEditors from '../models/collabEditorModel.js';
const mutationController = {};

/***************************** 
  Post Mutations
******************************/
mutationController.postMutations = (req, res, next)=>{
  
  // destructure request body data
  const {author, conversationId, data, origin} = req.body;
  let mutation = {author, conversationId, data, origin};

  if(!author || !conversationId || !data || !origin){
    const err = new Error('missing field');
    err.statusCode = 400;
    next(err);
  }

  const id = conversationId;
  let updatedString;
  let newMutation;

  collabEditors.findOne({"_id": id})
  .then(conversation => {
    // new conversation
    if(!conversation){
        const conversationInfo = {
          updated_text: data.text,
          _id:id,
          lastMutation: [{
            author: author,
            origin: origin,
            data: data
          }]
        }

        collabEditors.create(conversationInfo)
        .then((list)=>{
          res.locals.message = {
            "msg": "Successfully Created Conversation",
            "ok": true,
            "text": list.updated_text
        }
          return next();
        })
        .catch((err) => {
          res.locals.message = {
              "msg": err,
              "ok": false,
              "text":conversationInfo.updated_text
          };
          return next(err);
        })
      // existing conversation
      }else{
        // determin if transformation is necessary
        const isTransformNeeded = determineIfTransformNeeded(mutation, conversation);
        // if transformation is necessary, update the mutation

        newMutation = (isTransformNeeded)? transform(mutation, conversation): mutation;
        updatedString = editString(newMutation, conversation.updated_text);
        // form retruning object
        collabEditors.findOneAndUpdate(
          {"_id": id}, 
          {"updated_text": updatedString, $push:{"lastMutation":newMutation}}, 
          (err) =>{
            console.log(err);
            res.locals.message = {
              "msg": err,
              "ok": false,
              "text": data.text
            };
          })  
          res.locals.message = {
            "msg": "Successfully updated",
            "ok": true,
            "text": updatedString
          };
          return next();
        }
  })
  .catch((err) => {
    res.locals.message = {
      "msg": err,
      "ok": false,
      "text":data.text
    };
    return next(err);
  })
}

/*********************************
  Determin if Transform is Needed
**********************************/
const determineIfTransformNeeded = (mutation, lastConversation) => {
    // if the last mutation's origin is the same as the current mutation
    // and author is different, return true (to update mutation)
    if (JSON.stringify(mutation.origin) === JSON.stringify(lastConversation.lastMutation[0].origin) && 
    lastConversation.lastMutation[0].author !== mutation.author){
      return true;
    }
    return false;
}

/**************************************************
  Transform mutation based on the last Mutation 
***************************************************/
const transform = (mutation, lastConversation) => {
    // return combined mutation
    let author = mutation.author
    let index  = mutation.data.index

    if(lastConversation.lastMutation[0].data.type === 'delete'){
      mutation.data.index = index - lastConversation.lastMutation[0].data.length;
    } else if (lastConversation.lastMutation.data.type === 'insert'){
      mutation.data.index = index + lastConversation.lastMutation[0].data.length + 1;
    }else{
      throw error
    }
    mutation.origin[author] += 1;

    return mutation;
}

/**************************************************
  Edit String 
***************************************************/
const editString = (mutation, lastVersionText) => {
  let string = '';
  let index = mutation.data.index;
  let length = mutation.data.length;
  let text = mutation.data.text;
  let type = mutation.data.type;

  if (type === 'insert'){
    string = [lastVersionText.slice(0, index), text, lastVersionText.slice(index)].join('');
  }else if (type === 'delete'){
    console.log('deleting')
    if(index === 0){
      console.log("index === 0")
      string = lastVersionText.slice(index + length);
    }else if (index + length >= lastVersionText.length){
      console.log("index + length >= lastVersionText.length")
      string = lastVersionText.slice(0, index);
    }else{
      console.log("else")
      string = [lastVersionText.slice(0, index), lastVersionText.slice(index + length)].join('');
    }

  }
  return string
}


export default mutationController;