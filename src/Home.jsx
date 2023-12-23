import React, { useEffect, useState } from 'react';
import Create from './Create';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill } from 'react-icons/bs';
import './App.css'; // Assurez-vous d'importer votre fichier CSS ici

function Home() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/get')
      .then(result => setTodos(result.data))
      .catch(err => console.log(err));
  }, []);

  const handleEditTask = (id, isDone) => {
    const updatedDone = !isDone;

    axios.put(`http://localhost:3001/update/${id}`, { done: updatedDone })
      .then(result => {
        const updatedTodos = todos.map(todo => {
          if (todo._id === id) {
            return { ...todo, done: updatedDone };
          }
          return todo;
        });
        setTodos(updatedTodos);
      })
      .catch(err => console.log(err));
  };

  const handleEditPrompt = (id, currentTask) => {
    const updatedTask = prompt('Edit the task:', currentTask);

    if (updatedTask !== null && updatedTask.trim() !== '') {
      axios.put(`http://localhost:3001/update/${id}`, { task: updatedTask })
        .then(result => {
          const updatedTodos = todos.map(todo => {
            if (todo._id === id) {
              return { ...todo, task: updatedTask };
            }
            return todo;
          });
          setTodos(updatedTodos);
        })
        .catch(err => console.log(err));
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/delete/${id}`)
      .then(result => {
        const updatedTodos = todos.filter(todo => todo._id !== id);
        setTodos(updatedTodos);
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="home">
      <h2>Todo List</h2>
      <Create />
      {todos.length === 0 ? (
        <div><h2>No Record</h2></div>
      ) : (
        todos.map(todo => (
          <div className="task" key={todo._id}>
            <div className='task'>
              <div className='checkbox' onClick={() => handleEditTask(todo._id, todo.done)}>
                {todo.done ?
                  <BsFillCheckCircleFill className='icon'></BsFillCheckCircleFill>
                  : <BsCircleFill className='icon' />
                }
              </div>
              <p
                className={todo.done ? "task-text line_through" : "task-text"}
                onClick={() => handleEditPrompt(todo._id, todo.task)}
              >
                {todo.task}
              </p>
              <div>
                <span><BsFillTrashFill className='icon' onClick={() => handleDelete(todo._id)} /></span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
