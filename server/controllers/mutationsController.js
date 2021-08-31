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
  console.log('line 15', mutation)
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
    // If this is a new conversation
    console.log('line 29', conversation)
    if(!conversation){

        const conversationInfo = {
          _id:id,
          updated_text: data.text,
          lastMutations: {
            updated_text: data.text,
            author: author,
            origin: origin,
            data: data,
            prev: null,
            next: null
          }
          // lastMutations: [{
          //   updated_text: data.text,
          //   author: author,
          //   origin: origin,
          //   data: data
          // }]
        }
        console.log('line 50' , conversationInfo)
        collabEditors.create(conversationInfo)
        .then((list)=>{
          console.log(list)
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
    
      }else{
        // If this is an existing conversation
        console.log('line 69 ', conversation, 'mutation' , mutation)
        const updatedMutation = convertMutations(mutation, conversation.lastMutations) 
        // // determin if transformation is necessary
        // const isTransformNeeded = determineIfTransformNeeded(mutation, conversation);
        // // if transformation is necessary, update the mutation
        // newMutation = (isTransformNeeded)? transform(mutation, conversation): mutation;
        // updatedString = editString(newMutation, conversation.updated_text);
        // // form retruning object
        collabEditors.findOneAndUpdate(
          {"_id": id}, 
          // {"updated_text": updatedString, $push:{"lastMutations":newMutation}}, 
          { "updated_text": updatedMutation.updated_text, "lastMutations" : updatedMutation}, 
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
            "text": updatedMutation
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
  Traverse the history and update 
  the conversation object
   (If history is in linked list)
**********************************/

// {
//   _id: {type: String,  required:true},
//   updated_text: {type: String, required:false},
/////////////
//   lastMutations: {
//     updated_text: {type: String, required:false},
//     author: {type: String,  required:false},
//     data: {
//       index: {type: Number,  required:false},
//       length: {type: Number,  required:false},
//       text: {type: String,  required:false},
//       type: {type: String,  required:false},
//     },
//     origin: {
//       alice: {type: Number,  required:false},
//       bob: {type: Number,  required:false},
//     },
//     next: {type: Object, required: false},
//     prev: {type: Object, required: false},
//   }
////////////////
// }

// 	Insert the mutation into that spot	
// 	update the inputted mutation based on the previous mutation (-1 position)	
// 	      the previous type is insert => add the lenght of the inserted char	
// 	      if delete => subtract the length of the deleted char  (if less than 0 need to be 0)	
// 	      increment author's orderNumber	
// 	      update the conversation	
// 	traverse through the rest of the mutations  * multiple times until the end	
// 	       update the index	
// 	       update the conversation	
// 	       increment author's orderNumber	
		
// else		
// 	if previous data is transformed	
// 	   if the previous type = insert, add the length of the previous mutation text to the previous index	

const convertMutations  = (currentMutation, lastMutations) => {
  const tempMutations = {...lastMutations}
  console.log('153 tempMutations', tempMutations)
  // If the number is less than or equal to the previous coordination		
  if (tempMutations.origin.alice > currentMutation.origin.alice ||tempMutations.origin.bob > currentMutation.origin.bob){
    // 	Find the spot where it should be inserted  => when currentMutation is younger than the previous one
    console.log('160')
    tempMutations =  {...lastMutations}
    tempMutations.data = currentMutation.data;
    tempMutations.origin = currentMutation.origin;
    tempMutations.author = currentMutation.author;
    tempMutations.updated_text = currentMutation.data.text;
    console.log('166 tempMutations', tempMutations)
    // while(pointedNode.next){
    //   if(pointedNode.next.origin.alice + 1 ===  currentMutation.origin.alice || pointedNode.next.origin.bob + 1 === currentMutation.origin.bob){
    //     //insert the currentMutation before pointNode.next
    //     currentMutation.next = pointedNode.next;
    //     pointedNode.next = currentMutation;
    //   }
    //   pointedNode.next = pointedNode.next.next;
    // }
  }else{
    // When currentMutation is older than the previous one, replace the lastMutations with currentMutation, adding lastMutations to currentMutation.next
    // determin if transformation is necessary
    const bool = determineIfTransformNeeded(currentMutation, tempMutations);
    // if transformation is necessary, update the mutation
    let updatedMutation = {...currentMutation};
    if(bool){
      updatedMutation = transform(updatedMutation, tempMutations)
    }
    // form retruning object
    let newString = editString(updatedMutation, tempMutations.updated_text);
    console.log('Now update the object with then new string ', updatedMutation)
    console.log('String: ', newString)
    tempMutations.updated_text = newString;
    tempMutations.data = updatedMutation.data;
    tempMutations.author = updatedMutation.author;
    tempMutations.origin = updatedMutation.origin;
    tempMutations.next = lastMutations;
 
    // currentMutation.next = null;
    // tempMutations.next = currentMutation;
  }
  console.log('line183',tempMutations)
  return tempMutations;

}


/*********************************
  Traverse the history and update 
  the conversation object
  (If history is in array)
**********************************/

// const convertMutations  = (currentMutation, historyArray) => {
//     // insert the array in the right position
//     console.log("line 106")
//     console.log(currentMutation)
//     console.log(historyArray)
//     for (let i = historyArray.length -1 ; i >= 0 ; i --){
//         if(currentMutation.origin.bob < historyArray[i].origin.bob || currentMutation.origin.alice < historyArray[i].origin.alice  ){
//           console.log(currentMutation.origin.bob,  historyArray[i].origin.bob , '-' ,currentMutation.origin.alice, historyArray[i].origin.alice)
//           historyArray.splice(i, 0, currentMutation);
//           break;
//         }
//     }

//     console.log('updated historyArray ' , historyArray)
// }


/******************************************
  Determin if Transform is Needed 
*******************************************/
const determineIfTransformNeeded = (mutation, previousMutation) => {
  console.log('Checking if the transformation is needed')
  // if the last mutation's origin is greater than current mutation
  let currentOriginA = mutation.origin[0];
  let currentOriginB = mutation.origin[1];

  let previousOriginA = previousMutation.origin[0];
  let previousOriginB = previousMutation.origin[1];

  // and author is different, return true (to update mutation)
  if (currentOriginA === previousOriginA && currentOriginB === previousOriginB && 
  previousMutation.author !== mutation.author){
    console.log('Yes transformation is needed')
    return true;
  }

  if (currentOriginA < previousOriginA || currentOriginB < previousOriginB) return true;
  console.log('No transformation is not needed')
  return false;
}


/**************************************************
  Transform mutation based on the last Mutation 
***************************************************/
const transform = (mutation, lastConversation) => {
    console.log('Transforming the mutation')
    console.log(' 260 mutation', mutation)
    console.log(' 261 lastConversation', lastConversation)
    let author = mutation.author
    let index  = mutation.data.index
    // *** if lastMutations are in array format, use these lines
    // if(lastConversation.lastMutations[0].data.type === 'delete'){
    //   mutation.data.index = index - lastConversation.lastMutations[0].data.length;
    // } else if (lastConversation.lastMutations.data.type === 'insert'){
    //   mutation.data.index = index + lastConversation.lastMutations[0].data.length + 1;
    // }else{
    //   throw error
    // }

    if(lastConversation.data.type === 'delete'){
      mutation.data.index = index - lastConversation.data.length;
    } else if (lastConversation.data.type === 'insert'){
      mutation.data.index = index + lastConversation.updated_text.length + 1;
    }else{
      throw error
    }

    mutation.origin[author] += 1;
    console.log('This is the new mutation: ', mutation)
    return mutation;
}

/**************************************************
  Edit String 
***************************************************/
const editString = (mutation, lastVersionText) => {
  console.log('Now editing the string A: ', mutation.data.text, ' from B: ', lastVersionText)
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
  console.log('This is the updated string!: ', string)
  return string
}


export default mutationController;