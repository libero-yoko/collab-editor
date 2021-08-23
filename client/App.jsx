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

  const deleteData = (id) => {
    fetch('/conversations/' + id, {
      method: 'DELETE',
    })
    .then(res => res.json())
    .then(res => console.log(res))}

  return(
    <>
      <h2>List of conversation</h2>
      {conversation.map((row) => (
            <li key={row.conversationId}>
              <button onClick={e => deleteData(row.conversationId)}>Delete</button>
              {row.content} 
            </li>
          ))}
    </>
  )
}

export default App;