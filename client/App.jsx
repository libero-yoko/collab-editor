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
  

  const deleteData = (event, id) => {
    console.log("Deleting", event.target.parentElement.id)
    let updatedConv = conversation.filter(_id !== event.target.parentElement.id);
    console.log(updatedConv)
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

  const handleLike = (id, event) => {
    console.log("Liking", event.target)
    event.target.innertext = "❤️"
    // let mapped = conversation.map(item =>{
    //   return item.id == id ? { ...item, liked : item.liked} : {...item};
    // });
    // setConversation(mapped);
  }

  return(
    <>
      <h1>List of conversations</h1>
        <ul>
          {conversation.map((row) => (
            <li key={row.conversationId} id={row.conversationId}>
              <button onClick = {handleLike}>
              {row.liked ? (
                <>❤️</>
              ):(
                <>♡</>
              )}
              </button>
              <button onClick={deleteData}>DELETE</button>
              {row.content} 
            </li>
          ))}
        </ul>
    </>
  )
}

export default App;