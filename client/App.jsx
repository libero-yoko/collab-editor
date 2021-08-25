import React, {useState, useEffect} from 'react';
function App(){
  const[conversation, setConversation] = useState([]);

  useEffect(() => {
    fetch('/conversations')
    .then(data => data.json())
    .then(dataList => {
      dataList.conversations.forEach(item => item.liked = false);
      setConversation(dataList.conversations);
      console.log(dataList.conversations)
    })
  },[]);
  

  const deleteData = (event) => {
    console.log("Deleting", event.target.parentElement.id)
    let updatedConv = [...conversation]
    updatedConv = updatedConv.filter(item => item._id !== event.target.parentElement.id);
    setConversation(updatedConv);
    event.target.parentElement.classname = "deleted"
  //   fetch('/conversations/', {
  //     method: 'DELETE',
  //     headers: {
  //         'Content-type': 'application/json'
  //     },
  //     body: JSON.stringify({id: id})
  // })
  //   .then(res => res.json())
  //   .then(res => {
  //     console.log(res)
  //     return res;
  //   })
  }

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
                      Author:{row.lastMutation[row.lastMutation.length-1].author}, <br/>
                      Type:{row.lastMutation[row.lastMutation.length-1].data.type}, <br/>
                      Length:{row.lastMutation[row.lastMutation.length-1].data.length}, <br/>
                      Index:{row.lastMutation[row.lastMutation.length-1].data.index}, <br/>
                      Text:{row.lastMutation[row.lastMutation.length-1].data.text}, <br/>
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