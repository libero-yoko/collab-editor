import fs from 'fs';
import path from 'path'
const mutationController = {};

mutationController.postMutations = (req, res, next)=>{
  let storedData;
  // read from the previously sotred data
  let storedRawData = fs.readFileSync(path.resolve('server/models/conversations.json'), (err, data) => {
    if(err) throw err;
    storedData = JSON.parse(storedRawData);
  });

  // destructure request body data
  const {author, conversationId, data, origin} = req.body;
  let mutation = {author, conversationId, data, origin};
  console.log(mutation);

  // get last text data using conversasionID
  let lastConversation = storedData.find(conversation => conversation.message_id === mutation.conversationId);
  let updatedString = '';

  // determin if transformation is necessary
  const isTransformNeeded = determineIfTransformNeeded(mutation, lastConversation);

  // if transformation is necessary, update the mutation
  if (isTransformNeeded){
    console.log('transformation needed')
    let newMutation = transform(mutation, lastConversation);
    updatedString = editString(newMutation, lastConversation.content);
  } else{
    updatedString = editString(mutation, lastConversation.content);
  }
  // form retruning object
  res.locals.updatedString = updatedString;
  return next();
}


const determineIfTransformNeeded = (mutation, lastConversation) => {
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
    console.log(mutation);
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
    string = [lastVersionText.slice(0, index - 1), lastVersionText.slice(index + length)].join('');
  }
  console.log(string)
  return string
}

const storeDataToJson = (messageId, newText, mutation) => {
    // update json
}




export default mutationController;

// {
//   "author": "alice | bob",
//   "conversationId": "string",
//   "data": {
//     "index": "number",
//     "length": "number | undefined",
//     "text": "string | undefined",
//     "type": "insert | delete"
//   },
//   "origin": {
//     "alice": "integer",
//     "bob": "integer"
//   }
// }

// 201 {
//   "msg": "an error message, if needed",
//   "ok": "boolean",
//   "text": "string, the current text of the conversation, after applying the mutation"
// }