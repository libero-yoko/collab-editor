import collabEditors from '../models/collabEditorModel.js';
const mutationController = {};

mutationController.postMutations = (req, res, next)=>{
  
  // destructure request body data
  const {author, conversationId, data, origin} = req.body;
  let mutation = {author, conversationId, data, origin};
  // console.log(mutation.conversationId);
  const id = mutation.conversationId;
  let updatedString;
  let newMutation;

  if(!author || !conversationId || !data || !origin){
    const err = new Error('missing field');
    err.statusCode = 400;
    next(err);
  }


  collabEditors.findOne({"conversationId": id})
  .then(conversation => {
    // new conversation
    if(!conversation){
       
        const conversationInfo = {
          content: data.text,
          conversationId: id,
          lastMutation: mutation
        }

        // console.log(conversationInfo)
        collabEditors.create(conversationInfo)
        .then((data)=>{
          res.locals.message = {
            "msg": "Successfully Created Conversation",
            "ok": true,
            "text": data.content
        }
          return next();
        })
        .catch((err) => {
          res.locals.message = {
              "msg": e,
              "ok": false,
              "text":conversationInfo.content
          };
          return next(err);
        })
      // existing conversation
      }else{
        // determin if transformation is necessary
        const isTransformNeeded = determineIfTransformNeeded(mutation, conversation);
        // if transformation is necessary, update the mutation
        newMutation = (isTransformNeeded)? transform(mutation, conversation): mutation;
        updatedString = editString(newMutation, conversation.content);
        // form retruning object
        collabEditors.findOneAndUpdate(
          {"conversationId": id}, 
          {"content": updatedString, "lastMutation":newMutation}, 
          (err) =>{
        console.log(err);
        res.locals.message = {
          "msg": "Successfully Updated Conversation",
          "ok": true,
          "text": updatedString
      };
        return next();
    })
    }
  })
  .catch((e) => {
    res.locals.message = {
      "msg": e,
      "ok": false,
      "text":mutation.content
  };
    return next();
  })
}


const determineIfTransformNeeded = (mutation, lastConversation) => {
    // if the last mutation's origin is the same as the current mutation
    // and author is different, return true (to update mutation)
    if (JSON.stringify(mutation.origin) === JSON.stringify(lastConversation.lastMutation.origin) && 
    lastConversation.lastMutation.author !== mutation.author){
      return true;
    }
    return false;
}

const transform = (mutation, lastConversation) => {
    // return combined mutation
    let author = mutation.author
    let index  = mutation.data.index
    // console.log("original index", index)
    if(lastConversation.lastMutation.data.type === 'delete'){
      mutation.data.index = index - lastConversation.lastMutation.data.length;
    } else if (lastConversation.lastMutation.data.type === 'insert'){
      mutation.data.index = index + lastConversation.lastMutation.data.length + 1;
    }else{
      throw error
    }
    // console.log("mutated index", mutation.data.index)
    // if the lastMutation was delete
    // if the lastMutation was insert
    mutation.origin[author] += 1;

    return mutation;
}

const editString = (mutation, lastVersionText) => {
  let string = '';
  let index = mutation.data.index;
  let length = mutation.data.length;
  let text = mutation.data.text;
  let type = mutation.data.type;

  if (type === 'insert'){
    string = [lastVersionText.slice(0, index), text, lastVersionText.slice(index)].join('');
  }else if (type === 'delete'){
    if(index === 0){
      // console.log("index === 0")
      string = lastVersionText.slice(index + length);
    }else if (index + length >= lastVersionText.length){
      // console.log("index + length >= lastVersionText.length")
      string = lastVersionText.slice(0, index);
    }else{
      // console.log("else")
      string = [lastVersionText.slice(0, index), lastVersionText.slice(index + length)].join('');
    }

  }
  return string
}

const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500);
  res.send({ error: err });
}


export default mutationController;