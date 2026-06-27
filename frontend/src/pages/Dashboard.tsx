import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Users, UserCheck, Briefcase, Activity, CheckCircle, Clock, LayoutTemplate, Shield, Plus } from 'lucide-react';
import { getDashboardStats } from '../api/dashboardApi';
import type { DashboardStats } from '../api/dashboardApi';
import HeaderProfileMenu from '../components/HeaderProfileMenu';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-8 shadow-sm border-b border-gray-200 z-0" style={{ backgroundColor: 'var(--color-header)' }}>
          <h1 className="text-xl font-bold text-[var(--text-header)]">Dashboard Overview</h1>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-[var(--text-stat-card)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
              <span>Import Data</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm shadow-[var(--color-primary)]/30">
              <Plus size={16} />
              <span>New Record</span>
            </button>
            <div className="border-l border-gray-200 h-8 mx-2"></div>
            <HeaderProfileMenu />
          </div>
        </header>

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-500">Loading live data...</span>
            </div>
          ) : stats ? (
            <>
              {/* Stats Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow bg-[var(--color-stat-card)]">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-500">
                    <Users size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-stat-card)] opacity-70">Total Employees</p>
                    <h3 className="text-2xl font-bold text-[var(--text-stat-card)]">{stats.totalEmployees}</h3>
                  </div>
                </div>
                
                <div className="rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow bg-[var(--color-stat-card)]">
                  <div className="p-3 bg-green-50 rounded-lg text-green-500">
                    <UserCheck size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-stat-card)] opacity-70">Active Employees</p>
                    <h3 className="text-2xl font-bold text-[var(--text-stat-card)]">{stats.activeEmployees}</h3>
                  </div>
                </div>

                <div className="rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow bg-[var(--color-stat-card)]">
                  <div className="p-3 bg-purple-50 rounded-lg text-purple-500">
                    <LayoutTemplate size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-stat-card)] opacity-70">Departments</p>
                    <h3 className="text-2xl font-bold text-[var(--text-stat-card)]">{stats.departments}</h3>
                  </div>
                </div>

                <div className="rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow bg-[var(--color-stat-card)]">
                  <div className="p-3 bg-indigo-50 rounded-lg text-indigo-500">
                    <Briefcase size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-stat-card)] opacity-70">Contractors</p>
                    <h3 className="text-2xl font-bold text-[var(--text-stat-card)]">{stats.contractors}</h3>
                  </div>
                </div>
              </div>

              {/* Stats Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow bg-[var(--color-stat-card)]">
                  <div className="p-3 bg-orange-50 rounded-lg text-orange-500">
                    <Clock size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-stat-card)] opacity-70">Today's Attendance</p>
                    <h3 className="text-2xl font-bold text-[var(--text-stat-card)]">{stats.todayAttendance}</h3>
                  </div>
                </div>
                
                <div className="rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow bg-[var(--color-stat-card)]">
                  <div className="p-3 bg-cyan-50 rounded-lg text-cyan-500">
                    <Activity size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-stat-card)] opacity-70">Scheduled Tasks (Today)</p>
                    <h3 className="text-2xl font-bold text-[var(--text-stat-card)]">{stats.dailyScheduledTasks}</h3>
                  </div>
                </div>

                <div className="rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow bg-[var(--color-stat-card)]">
                  <div className="p-3 bg-yellow-50 rounded-lg text-yellow-500">
                    <Clock size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-stat-card)] opacity-70">Pending Tasks</p>
                    <h3 className="text-2xl font-bold text-[var(--text-stat-card)]">{stats.pendingTasks}</h3>
                  </div>
                </div>

                <div className="rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow bg-[var(--color-stat-card)]">
                  <div className="p-3 bg-emerald-50 rounded-lg text-emerald-500">
                    <CheckCircle size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-stat-card)] opacity-70">Completed Tasks</p>
                    <h3 className="text-2xl font-bold text-[var(--text-stat-card)]">{stats.completedTasks}</h3>
                  </div>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="rounded-xl shadow-sm border border-gray-100 overflow-hidden bg-[var(--color-main-card)]">
                <div className="px-6 py-4 border-b border-gray-100/10 flex justify-between items-center opacity-90">
                  <h2 className="text-lg font-bold text-[var(--text-header)] flex items-center space-x-2">
                    <Clock size={18} className="text-[var(--color-primary)]" />
                    <span>Recent Scheduled Tasks</span>
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {stats.recentActivities.length === 0 ? (
                    <p className="text-sm text-[var(--text-main-card)] opacity-70 py-4 px-6">No recent tasks scheduled.</p>
                  ) : (
                    stats.recentActivities.map((activity, i) => (
                      <div key={activity.id} className="px-6 py-4 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                            {i + 1}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[var(--text-header)]">{activity.title}</p>
                            <p className="text-xs text-[var(--text-main-card)] opacity-60 mt-0.5">{new Date(activity.time).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-green-100 text-green-700 uppercase tracking-wide">
                            Created
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-red-500">Error loading dashboard stats</div>
          )}
        </main>
        {/* Footer */}
        <footer className="h-12 border-t border-gray-200 flex items-center justify-center text-sm text-[var(--text-main-card)] opacity-70 shadow-inner z-0 bg-[var(--color-footer)]">
          © 2026 3Tech Cranes and Lift Pvt. Ltd. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
