import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Plus } from 'lucide-react';
import { getEmployee } from '../api/employeeApi';
import type { Employee as EmployeeType } from '../types';
import HeaderProfileMenu from '../components/HeaderProfileMenu';

const Employee = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [employeeData, setEmployeeData] = useState<EmployeeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const id = localStorage.getItem('employeeId');
        if (!id) throw new Error('No employee ID found. Please login again.');
        const data = await getEmployee(parseInt(id));
        setEmployeeData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, []);

  if (loading) return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar />
      <div className="flex-1 flex justify-center items-center"><div className="text-xl font-semibold text-gray-500 animate-pulse">Loading employee data...</div></div>
    </div>
  );
  
  if (error) return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar />
      <div className="flex-1 flex justify-center items-center"><div className="text-xl text-red-500 font-semibold bg-red-50 px-6 py-4 rounded-lg">{error}</div></div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[var(--text-header)] border-b border-gray-100 pb-3">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
              <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Employee Code</label><p className="mt-1.5 text-[var(--text-main-card)] font-semibold">{employeeData.employeeCode}</p></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label><p className="mt-1.5 text-[var(--text-main-card)] font-semibold">{employeeData.name}</p></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Nick Name</label><p className="mt-1.5 text-[var(--text-main-card)] font-semibold">{employeeData.nickName || 'N/A'}</p></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Employee Type</label><p className="mt-1.5 text-[var(--text-main-card)] font-semibold">{employeeData.employmentType?.name}</p></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile No</label><p className="mt-1.5 text-[var(--text-main-card)] font-semibold">{employeeData.mobileNo}</p></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Emergency Contact</label><p className="mt-1.5 text-[var(--text-main-card)] font-semibold">{employeeData.emergencyContactNo}</p></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label><p className="mt-1.5 text-[var(--text-main-card)] font-semibold">{employeeData.email}</p></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Role</label><p className="mt-1.5 text-[var(--text-main-card)] font-semibold">{employeeData.role?.name}</p></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Department</label><p className="mt-1.5 text-[var(--text-main-card)] font-semibold">{employeeData.department?.name}</p></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Designation</label><p className="mt-1.5 text-[var(--text-main-card)] font-semibold">{employeeData.designation?.name}</p></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Date of Birth</label><p className="mt-1.5 text-[var(--text-main-card)] font-semibold">{employeeData.dob ? new Date(employeeData.dob).toLocaleDateString() : 'N/A'}</p></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Date of Joining</label><p className="mt-1.5 text-[var(--text-main-card)] font-semibold">{employeeData.doj ? new Date(employeeData.doj).toLocaleDateString() : 'N/A'}</p></div>
            </div>
          </div>
        );
      case 'address':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-header)] border-b border-gray-100 pb-3">Current Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 mt-6">
                <div className="lg:col-span-2"><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Street</label><p className="mt-1.5 text-[var(--text-main-card)] font-medium">{employeeData.address?.currentStreet}</p></div>
                <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Pin Code</label><p className="mt-1.5 text-[var(--text-main-card)] font-medium">{employeeData.address?.currentPin}</p></div>
                <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">City</label><p className="mt-1.5 text-[var(--text-main-card)] font-medium">{employeeData.address?.currentCity}</p></div>
                <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">District</label><p className="mt-1.5 text-[var(--text-main-card)] font-medium">{employeeData.address?.currentDist}</p></div>
                <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">State</label><p className="mt-1.5 text-[var(--text-main-card)] font-medium">{employeeData.address?.currentState}</p></div>
                <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Country</label><p className="mt-1.5 text-[var(--text-main-card)] font-medium">{employeeData.address?.currentCountry}</p></div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-header)] border-b border-gray-100 pb-3">Permanent Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 mt-6">
                <div className="lg:col-span-2"><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Street</label><p className="mt-1.5 text-[var(--text-main-card)] font-medium">{employeeData.address?.permanentStreet}</p></div>
                <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Pin Code</label><p className="mt-1.5 text-[var(--text-main-card)] font-medium">{employeeData.address?.permanentPin}</p></div>
                <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">City</label><p className="mt-1.5 text-[var(--text-main-card)] font-medium">{employeeData.address?.permanentCity}</p></div>
                <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">District</label><p className="mt-1.5 text-[var(--text-main-card)] font-medium">{employeeData.address?.permanentDist}</p></div>
                <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">State</label><p className="mt-1.5 text-[var(--text-main-card)] font-medium">{employeeData.address?.permanentState}</p></div>
                <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Country</label><p className="mt-1.5 text-[var(--text-main-card)] font-medium">{employeeData.address?.permanentCountry}</p></div>
              </div>
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[var(--text-header)] border-b border-gray-100 pb-3">Documents</h3>
            {(!employeeData.documents || employeeData.documents.length === 0) ? (
              <p className="text-gray-500 italic">No documents uploaded.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {employeeData.documents.map((doc, idx) => (
                  <li key={idx} className="py-4 flex justify-between items-center hover:bg-gray-50 px-2 rounded-lg transition-colors">
                    <span className="text-sm font-semibold text-gray-700">{doc.documentName}</span>
                    <a href={doc.documentPath.startsWith('http') ? doc.documentPath : `http://localhost:5000${doc.documentPath}`} target="_blank" rel="noreferrer" className="text-sm text-[var(--color-primary)] font-medium cursor-pointer hover:underline">
                      View Document
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-8 shadow-sm border-b border-gray-200 z-0" style={{ backgroundColor: 'var(--color-header)' }}>
          <h1 className="text-xl font-bold text-[var(--text-header)]">Employee Details</h1>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
              <span>Edit Profile</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm shadow-[var(--color-primary)]/30">
              <Plus size={16} />
              <span>Add Document</span>
            </button>
            <div className="border-l border-gray-200 h-8 mx-2"></div>
            <HeaderProfileMenu />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="rounded-xl shadow-sm border border-gray-100 overflow-hidden" style={{ backgroundColor: 'var(--color-main-card)' }}>
            <div className="flex border-b border-gray-100/10 opacity-90">
              <button
                className={`flex-1 py-4 text-sm font-bold text-center transition-all ${
                  activeTab === 'personal' 
                    ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent' 
                    : 'text-gray-500 hover:text-[var(--text-header)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                onClick={() => setActiveTab('personal')}
              >
                Personal Details
              </button>
              <button
                className={`flex-1 py-4 text-sm font-bold text-center transition-all ${
                  activeTab === 'address' 
                    ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent' 
                    : 'text-gray-500 hover:text-[var(--text-header)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                onClick={() => setActiveTab('address')}
              >
                Address Information
              </button>
              <button
                className={`flex-1 py-4 text-sm font-bold text-center transition-all ${
                  activeTab === 'documents' 
                    ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent' 
                    : 'text-gray-500 hover:text-[var(--text-header)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                onClick={() => setActiveTab('documents')}
              >
                Documents
              </button>
            </div>
            <div className="p-8">
              {renderTabContent()}
            </div>
          </div>
        </main>
        {/* Footer */}
        <footer className="h-12 border-t border-gray-200 flex items-center justify-center text-sm text-gray-500 shadow-inner z-0" style={{ backgroundColor: 'var(--color-footer)' }}>
          © 2026 EmpManage Pro. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Employee;
