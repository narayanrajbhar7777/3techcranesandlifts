import React, { useState, useRef, useEffect } from 'react';
import { User, Key, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileModal from './ProfileModal';

const HeaderProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const username = user?.username || 'User';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('employeeId');
    navigate('/login');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-full py-1 pl-1 pr-3 hover:bg-gray-100 transition-colors focus:outline-none"
      >
        <div className="h-8 w-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
          {username.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-700">{username}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 border border-gray-100 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">{username}</p>
            <p className="text-xs text-gray-500 truncate">{user?.role || 'Role'}</p>
          </div>
          <button 
            onClick={() => { setOpen(false); setModalOpen(true); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <User size={16} />
            <span>My Profile</span>
          </button>
          <button 
            onClick={() => { setOpen(false); setModalOpen(true); }} // Use same modal for now, tabbed
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <Key size={16} />
            <span>Change Password</span>
          </button>
          <div className="border-t border-gray-100 my-1"></div>
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}

      {modalOpen && <ProfileModal onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default HeaderProfileMenu;
