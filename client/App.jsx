import React, {useState, useEffect} from 'react';

function App(){
  const[conversation, setConversation] = useState([]);

  useEffect(() => {
    fetch('/conversations')
    .then(data => data.json())
    .then(dataList => {
      setConversation(dataList.conversations);
      console.log(dataList.conversations)
    })
  },[]);
  
  const deleteData = (event, id) => {
    fetch(`/conversations/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
    .then(res => res.json())
    .then(res => {
      console.log(res)

    })}

  return(
    <>
      <h2>List of conversations</h2>
      {conversation.map((row) => (
            <li key={row.conversationId} id={row.conversationId}>
              <button onClick={event => deleteData(event,row.conversationId)}>Delete</button>
              {row.content} 
            </li>
          ))}
    </>
  )
}

export default App;