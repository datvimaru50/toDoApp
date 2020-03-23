import React, { useState, useEffect } from 'react';
import './App.css';

export default function App(props) {

  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [todoItems, setTodoItems] = useState([]);

  const [dataUpdated, setDataUpdated] = useState(false);

  function fetchData(){
    fetch('http://localhost:5000/apicenter/todos')
    .then(
      res => res.json()
    )
    .then(
      (result) => {
        setIsLoaded(true);
        setTodoItems(result);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    )
  }

  function handleFinish(e) {
    setDataUpdated(!dataUpdated);
    const TODO_ID = e.target.getAttribute('dataid');
    fetch(`http://localhost:5000/apicenter/todos/finish/${TODO_ID}`, {
      method: 'post',
      headers: {'Content-Type':'application/json'}
    })
  }

  function handleUrgent(e) {
    setDataUpdated(!dataUpdated);
    const TODO_ID = e.target.getAttribute('dataid');
    fetch(`http://localhost:5000/apicenter/todos/urgent/${TODO_ID}`, {
      method: 'post',
      headers: {'Content-Type':'application/json'}
    })
  }
  function handleDelete(e) {
    setDataUpdated(!dataUpdated);
    const TODO_ID = e.target.getAttribute('dataid');
    fetch(`http://localhost:5000/apicenter/todos/delete/${TODO_ID}`, {
      method: 'delete',
      headers: {'Content-Type':'application/json'}
    })
  }
  function handleSubmit(event) {
    event.preventDefault();
    setDataUpdated(!dataUpdated);
    const getTitle = document.querySelector('input[name="title"]').value;
    const getDesc = document.querySelector('textarea[name="description"]').value;
    const data = {'title': getTitle, 'description': getDesc};

    fetch(`http://localhost:5000/apicenter/todos/add`, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body:  JSON.stringify(data)
    })
  }

  useEffect(()=>{fetchData();},[dataUpdated])

  if (!isLoaded) {
    return (
      <div>...Loading</div>
    )
  } else if (error) {
    return (
    <div>{error.message}</div>
    )
  } else {
    return (
      <div className="App">
        <div className='wrapper'>
  
        
        <h1>My to do list</h1>
        <form id='addTaskForm' >
          <label>Tên task</label>
          <input type='text' placeholder='Ví dụ: Đi chợ' name='title' />
          <label>Mô tả cụ thể task</label>
          <textarea name='description' placeholder='Ví dụ: Đi chợ mua rau muốn nấu canh, mua bí làm mứt, mua cá về kho và mua con cho cu Tý. Tiện thể ghé qua đòi nợ' />
          <input type="checkbox" id="urgent" name="urgent" value="true" /><label htmlFor="urgent">Mark as urgent</label>
          <button type='submit' onClick={handleSubmit}>Thêm task</button>
        </form>
        <hr />
        
        <ul>
            {todoItems.map((item) => (
              <li key={item.id} className={item.urgent && item.done ? 'urgent done' : item.urgent ? 'urgent' : item.done ? 'done' : ''}>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <span onClick={handleDelete} dataid={item.id}>Delete</span>
                  <span onClick={handleUrgent} dataid={item.id} className='setUrgent'>{item.urgent ? 'Mark as not urgent!' : 'Mark as urgent!'}</span>
                  <span onClick={handleFinish} dataid={item.id} className='setFinish'>{item.done ? 'Un-Done' : 'Done!'}</span>
              </li>
            ))}
        </ul>
        </div>
      </div>
    );
  }
}
