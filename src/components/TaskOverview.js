import React from 'react';

const TaskOverview = ({ taskStatus }) => {
    const totalTasks = taskStatus.todo + taskStatus.inProgress + taskStatus.done;
    const todoPercentage = totalTasks ? Math.round((taskStatus.todo / totalTasks) * 100) : 0;
    const inProgressPercentage = totalTasks ? Math.round((taskStatus.inProgress / totalTasks) * 100) : 0;
    const donePercentage = totalTasks ? Math.round((taskStatus.done / totalTasks) * 100) : 0;

    return (
        <div className="task-overview">
            <div className="task-status">
                <div className="status-item">
                    <h4>To Do</h4>
                    <div className="progress-bar">
                        <div 
                            className="progress" 
                            style={{ width: `${todoPercentage}%`, backgroundColor: '#ff6b6b' }}
                        />
                    </div>
                    <span>{taskStatus.todo} tasks ({todoPercentage}%)</span>
                </div>
                <div className="status-item">
                    <h4>In Progress</h4>
                    <div className="progress-bar">
                        <div 
                            className="progress" 
                            style={{ width: `${inProgressPercentage}%`, backgroundColor: '#4dabf7' }}
                        />
                    </div>
                    <span>{taskStatus.inProgress} tasks ({inProgressPercentage}%)</span>
                </div>
                <div className="status-item">
                    <h4>Done</h4>
                    <div className="progress-bar">
                        <div 
                            className="progress" 
                            style={{ width: `${donePercentage}%`, backgroundColor: '#51cf66' }}
                        />
                    </div>
                    <span>{taskStatus.done} tasks ({donePercentage}%)</span>
                </div>
            </div>
        </div>
    );
};

export default TaskOverview; 