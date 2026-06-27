import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';

const EmployeeManagement = () => {
  const [view, setView] = useState<'LIST' | 'FORM'>('LIST');
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddNew = () => {
    setEditingId(null);
    setView('FORM');
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
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
          <EmployeeList onAddNew={handleAddNew} onEdit={handleEdit} />
        )}
        {view === 'FORM' && (
          <EmployeeForm 
            employeeId={editingId} 
            onComplete={handleFormComplete} 
            onCancel={handleFormCancel} 
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;
