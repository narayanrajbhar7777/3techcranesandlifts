import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DailyTaskList from './DailyTaskList';
import DailyTaskForm from './DailyTaskForm';
import type { DailyTask } from '../api/dailyTaskApi';

const DailyTaskSchedule = () => {
  const [view, setView] = useState<'LIST' | 'FORM'>('LIST');
  const [editTask, setEditTask] = useState<DailyTask | null>(null);

  const handleAddNew = () => {
    setEditTask(null);
    setView('FORM');
  };

  const handleEdit = (task: DailyTask) => {
    setEditTask(task);
    setView('FORM');
  };

  const handleFormComplete = () => {
    setView('LIST');
  };

  const handleFormCancel = () => {
    setView('LIST');
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {view === 'LIST' && (
          <DailyTaskList onAddNew={handleAddNew} onEdit={handleEdit} />
        )}
        {view === 'FORM' && (
          <DailyTaskForm 
            editTask={editTask} 
            onComplete={handleFormComplete} 
            onCancel={handleFormCancel} 
          />
        )}
      </div>
    </div>
  );
};

export default DailyTaskSchedule;
