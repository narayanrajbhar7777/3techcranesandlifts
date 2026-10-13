import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, User as UserIcon } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Employee');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('employeeId');
    navigate('/login');
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `neu-nav flex items-center space-x-3 px-4 py-3 ${isActive ? 'neu-nav-active' : ''}`;

  return (
    <div className="neu-sidebar w-64 text-white min-h-screen flex flex-col z-10">
      <div className="p-6 flex items-center space-x-3">
        <div className="neu-nav-active p-2 rounded-xl flex items-center justify-center">
          <Users className="text-white h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight">EmpManage</h1>
          <p className="text-xs text-emerald-300/80">Pro Dashboard</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4">
          <p className="text-xs font-semibold text-emerald-300/70 tracking-wider mb-3 px-2 uppercase">Menu</p>
          <nav className="space-y-2">
            <NavLink to="/dashboard" className={navClass}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/employees" className={navClass}>
              <Users size={20} />
              <span>Employees</span>
            </NavLink>
            <NavLink to="/employee" className={navClass}>
              <UserIcon size={20} />
              <span>My Profile</span>
            </NavLink>
          </nav>
        </div>

        <div className="mb-6 px-4">
          <h3 className="px-2 text-xs font-semibold text-emerald-300/70 uppercase tracking-wider mb-3">
            HRMS Modules
          </h3>
          <nav className="space-y-2">
            <NavLink to="/leaves" className={navClass}>
              <UserIcon size={20} />
              <span>Leave Management</span>
            </NavLink>
            <NavLink to="/attendance" className={navClass}>
              <UserIcon size={20} />
              <span>Attendance</span>
            </NavLink>
            <NavLink to="/payroll" className={navClass}>
              <UserIcon size={20} />
              <span>Payroll</span>
            </NavLink>
            <NavLink to="/daily-tasks" className={navClass}>
              <UserIcon size={20} />
              <span>Daily Task Schedule</span>
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="p-4">
        <div className="neu-sidebar-chip p-3 flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 text-white h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm">
              {userName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{userName}</p>
              <p className="text-xs text-gray-400 truncate">Administrator</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="neu-nav flex items-center space-x-2 px-4 py-2 w-full text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
