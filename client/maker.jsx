const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleTask = (e, onTaskAdded) => {
    e.preventDefault();

    const name = e.target.querySelector('#taskName').value;
    const time = e.target.querySelector('#taskTime').value;
    const category = e.target.querySelector("#taskCat").value;

    if(!name || !time || !category){
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {name, time, category}, onTaskAdded);
    return false;
}

const TaskForm = (props) => {
    return(
        <form id='taskForm'
            onSubmit={(e) => handleTask(e, props.triggerReload)}
            name='taskForm'
            action='/maker'
            method='POST'
            className='taskForm'
        >
            <label htmlFor='name'>Task: </label>
            <input id='taskName' type='text' name='name' placeholder='Task Name' />
            <label htmlFor='time'>Time (m): </label>
            <input id='taskTime' type='number' min='0' name='time' />
            <label htmlFor="category">Category: </label>
            <input id='taskCat' type="text" name='category' placeholder='Task Category' />
            <input className='taskSubmit' type='submit' value='Create Task' />  
        </form>
    );
};

const TaskList = (props) => {
    let [tasks, setTasks] = useState(props.tasks);

    useEffect(() => {
        const loadTasksFromServer = async () => {
            const response = await fetch('/getTasks');
            const data = await response.json();
            setTasks(data.tasks);
        };
        loadTasksFromServer();
    }, [props.reloadTasks]);

    if(tasks.length === 0){
        return (
            <div className='taskList'>
                <h3 className='emptyList'>No Tasks Yet!</h3>
            </div>
        );
    }

    const removeTask = (index, id) => {
       const deleteFromServer = async () => {
                const response = await fetch('/removeTask', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: id,
                  });
                const data = await response.json();
                setTasks(data.tasks);
        };
        deleteFromServer();
        
        // setTasks(tasks.filter((_, i) => i !== index)); // sourced from StackOverflow
        // setTasks(tasks.filter((task) => task.id !== id)); // not working
        // const newArr = tasks.filter(task => task.id !== id);
        // setTasks(newArr);

        setTasks(tasks => {
            return tasks.filter((_, i) => i !== index);
        }); 
    }

    const taskNodes = tasks.map((task, index) => {
        return (
            <div key={task.id} className='task'>
                <h3 className='taskName'>Name: {task.name}</h3>
                 <button 
                    className='delTask'
                    onClick={() => removeTask(index, task.id)}
                >Delete Task</button>
                <h3 className='taskTime'>Time: {task.time} minutes</h3>
                <h3 className='taskCat' >Category: {task.category}</h3>
            </div>
        );
    });

    return (
        <div className='taskList'>
            {taskNodes}
        </div>
    );
};

const App = () => {
    const [reloadTasks, setReloadTasks] = useState(false);

    return (
        <div>
            <div id='makeTask'>
                <TaskForm triggerReload={() => setReloadTasks(!reloadTasks)} />
            </div>
            <div id='tasks'>
                <TaskList tasks={[]} reloadTasks={reloadTasks} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload = init;