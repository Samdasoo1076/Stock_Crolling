import React, { useState } from 'react';

function ToDoListTile() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    const handleInputChange = (event) => {
        setNewTask(event.target.value);
    };

    const addTask = () => {
        if (newTask.trim() !== '') {
            setTasks([...tasks, { text: newTask, completed: false }]);
            setNewTask('');
        }
    };

    const toggleTaskCompletion = (index) => {
        const updatedTasks = tasks.map((task, i) => 
            i === index ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
    };

    const deleteTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

    return (
        <div className="tile">
            <h2>할 일 목록</h2>
            <div>
                <input
                    type="text"
                    value={newTask}
                    onChange={handleInputChange}
                    placeholder="새 할 일 추가"
                />
                <button onClick={addTask}>추가</button>
            </div>
            <ul>
                {tasks.map((task, index) => (
                    <li key={index} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                        <span onClick={() => toggleTaskCompletion(index)} style={{ cursor: 'pointer' }}>
                            {task.text}
                        </span>
                        <button onClick={() => deleteTask(index)} style={{ marginLeft: '10px' }}>삭제</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ToDoListTile;
