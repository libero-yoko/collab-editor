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


  collabEditors.findOne({"_id": id})
  .then(conversation => {
    console.log(conversation)
    // determin if transformation is necessary
    const isTransformNeeded = determineIfTransformNeeded(mutation, conversation);
    // if transformation is necessary, update the mutation
    newMutation = (isTransformNeeded)? transform(mutation, conversation): mutation;
    // if (isTransformNeeded){
    //   newMutation = transform(mutation, conversation);
    // } else{
    //   newMutation = mutation;
    // }
    console.log('newMutation', newMutation)
    updatedString = editString(newMutation, conversation.content);
    console.log(updatedString)
    
  })
  .then(() => {
    // form retruning object
    console.log(updatedString)
    collabEditors.findOneAndUpdate({"_id": id}, {"content": updatedString, "lastMutation":newMutation}, (err) =>{
      console.log(err);
    })

    res.locals.updatedString = updatedString;
    return next();
  })
  .catch((e) => {
    console.log(e);
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

    if(lastConversation.lastMutation.data.type === 'delete'){
      mutation.data.index = index - lastConversation.lastMutation.data.length;
    } else if (lastConversation.lastMutation.data.type === 'insert'){
      mutation.data.index = index + lastConversation.lastMutation.data.length + 1;
    }else{
      throw error
    }
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
    string = [lastVersionText.slice(0, index + 1), text, lastVersionText.slice(index + 1)].join('');
  }else if (type === 'delete'){
    string = [lastVersionText.slice(0, index - 1), lastVersionText.slice(index + length)].join('');
  }
  return string
}

const storeDataInDB = (messageId, newText, mutation) => {
    // update DB
}




export default mutationController;