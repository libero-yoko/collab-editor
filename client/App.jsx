import React, {useState, useEffect} from 'react';

function App(){
  const[conversation, setConversation] = useState([]);

  /************************************************ 
    First time loading, list conversations 
  *************************************************/
  useEffect(() => {
    fetch('/conversations')
    .then(data => data.json())
    .then(dataList => {
      dataList.conversations.forEach(item => item.liked = false);
      setConversation(dataList.conversations);
      console.log(dataList.conversations)
    })
  },[]);
  
 /************************************************ 
    On delete button click, detete conversation 
  ************************************************/
  const deleteData = (event) => {
    const convId = event.target.parentElement.id
    console.log("Deleting", convId)
    fetch('/conversations/' + convId, {
      method: "DELETE",
  })
    .then(res => res.json())
    .then(res => {
      let updatedConv = [...conversation]
      updatedConv = updatedConv.filter(item => item._id !== convId);
      setConversation(updatedConv);
      event.target.parentElement.classname = "deleted"
      console.log(res)
      return res;
    })
  }

  /************************************************ 
    On like button click, star conversation 
  ************************************************/
  const handleLike = (event) => {
    console.log("Liking",  event.target.parentElement.id)
    let updatedConv = [...conversation]
    event.target.innertext = "❤️"
    updatedConv.map(item =>{
      if(item._id == event.target.parentElement.id) {
        if(item.liked === true){
          item.liked = false
        }else{
          item.liked = true;
        };
      }
    });
    setConversation(updatedConv);
  }

  /************************************************ 
    Render 
  ************************************************/

  return(
    <>
      <h1>List of Conversations</h1>
        <ul>
          {conversation.map((row) => (
              <li key={row._id} id={row._id}>
                <div className="list-like" onClick = {handleLike}>
                {row.liked ? (
                  <>🌟</>
                ):(
                  <>☆</>
                )}
                </div>
                <div className="list-text">{row.updated_text}
                  <div className="last-mutation">
                      <strong>Last Mutation</strong><br/>
                      {row.updated_text}
                      {/* Author:{row.lastMutation[row.lastMutation.length-1].author}, <br/>
                      Type:{row.lastMutation[row.lastMutation.length-1].data.type}, <br/>
                      Length:{row.lastMutation[row.lastMutation.length-1].data.length}, <br/>
                      Index:{row.lastMutation[row.lastMutation.length-1].data.index}, <br/>
                      Text:{row.lastMutation[row.lastMutation.length-1].data.text}, <br/> */}
                  </div>
                </div>
                <button className="list-button" onClick={deleteData}>−</button>
              </li>
          ))}
        </ul>
    </>
  )
}

export default App;