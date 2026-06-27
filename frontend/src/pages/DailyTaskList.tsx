import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { getTasks, deleteTask } from '../api/dailyTaskApi';
import type { DailyTask } from '../api/dailyTaskApi';
import { CircularProgress, Pagination, Typography } from '@mui/material';
import HeaderProfileMenu from '../components/HeaderProfileMenu';

interface DailyTaskListProps {
  onAddNew: () => void;
  onEdit: (task: DailyTask) => void;
}

const DailyTaskList: React.FC<DailyTaskListProps> = ({ onAddNew, onEdit }) => {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await getTasks(page, 10, search);
      setTasks(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [page, search]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        loadTasks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <>
      <header className="h-16 flex items-center justify-between px-8 shadow-sm border-b border-gray-200 z-0 bg-[var(--color-header)]">
        <h1 className="text-xl font-bold text-[var(--text-header)]">Daily Task Schedule</h1>
        <div className="flex items-center space-x-4">
          <button onClick={onAddNew} className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} />
            <span>Add Task</span>
          </button>
          <div className="border-l border-gray-200 h-8 mx-2"></div>
          <HeaderProfileMenu />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="bg-[var(--color-main-card)] rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center opacity-90 border-opacity-20">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--text-main-card)] bg-transparent"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-main-card)] border border-gray-300 text-[var(--text-main-card)] rounded-lg text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-black/5 dark:bg-white/5 border-b border-gray-200 border-opacity-20 text-[var(--text-main-card)] opacity-70">
                <tr>
                  <th className="px-6 py-4 font-semibold">Task</th>
                  <th className="px-6 py-4 font-semibold">Employee</th>
                  <th className="px-6 py-4 font-semibold">Area / Location</th>
                  <th className="px-6 py-4 font-semibold">Schedule</th>
                  <th className="px-6 py-4 font-semibold">Priority</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 divide-opacity-20">
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-8"><CircularProgress size={24} /></td></tr>
                ) : tasks.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-[var(--text-main-card)] opacity-70">No tasks found.</td></tr>
                ) : tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[var(--text-main-card)]">{task.taskTitle}</p>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-main-card)] opacity-90">{task.employee?.name}</td>
                    <td className="px-6 py-4 text-[var(--text-main-card)] opacity-90">{task.area} - {task.location}</td>
                    <td className="px-6 py-4 text-xs">
                      <div className="text-[var(--text-main-card)] opacity-90">{new Date(task.fromDateTime).toLocaleString()}</div>
                      <div className="text-[var(--text-main-card)] opacity-60">to {new Date(task.toDateTime).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                        task.priority === 'High' ? 'bg-red-100 text-red-700' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-main-card)] opacity-90">{task.status}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => onEdit(task)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(task.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 border-opacity-20 flex justify-between items-center">
            <Typography variant="body2" color="text.secondary">
              Page {page} of {totalPages || 1}
            </Typography>
            <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} color="primary" size="small" />
          </div>
        </div>
      </main>
    </>
  );
};

export default DailyTaskList;
