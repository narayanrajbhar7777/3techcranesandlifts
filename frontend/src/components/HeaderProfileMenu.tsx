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
        className="neu-btn flex items-center space-x-2 rounded-full py-1 pl-1 pr-3 focus:outline-none"
      >
        <div className="h-8 w-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
          {username.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-[color:var(--neu-text)]">{username}</span>
      </button>

      {open && (
        <div className="neu-card absolute right-0 mt-3 w-52 p-2 z-50">
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-semibold text-[color:var(--neu-text)] truncate">{username}</p>
            <p className="text-xs text-[color:var(--neu-muted)] truncate">{user?.role || 'Role'}</p>
          </div>
          <button 
            onClick={() => { setOpen(false); setModalOpen(true); }}
            className="w-full text-left px-3 py-2 text-sm flex items-center space-x-2 rounded-lg text-[color:var(--neu-text)] hover:bg-black/5 transition-colors"
          >
            <User size={16} />
            <span>My Profile</span>
          </button>
          <button 
            onClick={() => { setOpen(false); setModalOpen(true); }}
            className="w-full text-left px-3 py-2 text-sm flex items-center space-x-2 rounded-lg text-[color:var(--neu-text)] hover:bg-black/5 transition-colors"
          >
            <Key size={16} />
            <span>Change Password</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 mt-1 text-sm text-red-500 flex items-center space-x-2 rounded-lg hover:bg-red-500/10 transition-colors"
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
