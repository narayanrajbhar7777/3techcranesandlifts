import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, User as UserIcon } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Employee');

  useEffect(() => {
    // Attempt to get user info if we had it, or we can fetch it. 
    // We'll just display a placeholder or fetch from localStorage if stored.
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('employeeId');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-[var(--color-sidebar)] text-white min-h-screen flex flex-col shadow-xl z-10">
      <div className="p-6 flex items-center space-x-3 border-b border-[var(--color-sidebar-active)]/30">
        <div className="bg-white p-1.5 rounded-lg flex items-center justify-center">
          <Users className="text-[var(--color-sidebar)] h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight">EmpManage</h1>
          <p className="text-xs text-green-200">Pro Dashboard</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-6">
          <p className="text-xs font-semibold text-green-200 tracking-wider mb-4 px-2 uppercase">Menu</p>
          <nav className="space-y-1.5">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-[var(--color-sidebar-active)] text-white font-medium shadow-md shadow-black/10' 
                    : 'text-green-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/employees"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-[var(--color-sidebar-active)] text-white font-medium shadow-md shadow-black/10' 
                    : 'text-green-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Users size={20} />
              <span>Employees</span>
            </NavLink>
            <NavLink
              to="/employee"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-[var(--color-sidebar-active)] text-white font-medium shadow-md shadow-black/10' 
                    : 'text-green-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <UserIcon size={20} />
              <span>My Profile</span>
            </NavLink>
          </nav>
        </div>

        <div className="mb-6">
          <h3 className="px-4 text-xs font-semibold text-green-200 uppercase tracking-wider mb-2 opacity-80">
            HRMS Modules
          </h3>
          <nav className="space-y-1.5">
            <NavLink
              to="/leaves"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-[var(--color-sidebar-active)] text-white font-medium shadow-md shadow-black/10' : 'text-green-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <UserIcon size={20} />
              <span>Leave Management</span>
            </NavLink>
            <NavLink
              to="/attendance"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-[var(--color-sidebar-active)] text-white font-medium shadow-md shadow-black/10' : 'text-green-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <UserIcon size={20} />
              <span>Attendance</span>
            </NavLink>
            <NavLink
              to="/payroll"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-[var(--color-sidebar-active)] text-white font-medium shadow-md shadow-black/10' : 'text-green-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <UserIcon size={20} />
              <span>Payroll</span>
            </NavLink>
            <NavLink
              to="/daily-tasks"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-[var(--color-sidebar-active)] text-white font-medium shadow-md shadow-black/10' : 'text-green-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <UserIcon size={20} />
              <span>Daily Task Schedule</span>
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-[var(--color-sidebar-active)]/30">
        <div className="bg-white text-gray-800 rounded-xl p-3 flex items-center justify-between shadow-lg mb-3">
          <div className="flex items-center space-x-3">
            <div className="bg-[var(--color-sidebar)] text-white h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm">
              {userName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 w-full text-sm font-medium text-green-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
