import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Clock,
  IndianRupee,
  Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StaffMember } from '../../types';

export const StaffScreen: React.FC = () => {
  const { staff, addStaff, updateStaff, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Owner' | 'Manager' | 'Cashier' | 'Staff'>('Cashier');
  const [phone, setPhone] = useState('');
  const [salary, setSalary] = useState<number | ''>(12000);
  const [shift, setShift] = useState('Morning (8 AM - 4 PM)');

  const filteredStaff = staff.filter(s => {
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.phone.includes(q) || s.role.toLowerCase().includes(q);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    addStaff({
      name: name.trim(),
      role,
      phone: phone.trim(),
      salary: Number(salary) || 0,
      shift,
      isActive: true,
      status: 'active'
    });
    setShowAddModal(false);
    setName('');
    setPhone('');
  };

  const handleToggleActive = (member: StaffMember) => {
    const currentActive = member.isActive ?? (member.status === 'active');
    updateStaff({
      ...member,
      isActive: !currentActive,
      status: !currentActive ? 'active' : 'inactive'
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-6 custom-scrollbar space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-600" />
            <span>{t('staffTitle')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage cafe team, roles, shifts, monthly wages and active status.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Staff Member</span>
        </button>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map(member => {
          const isActive = member.isActive ?? (member.status === 'active');
          const roleLower = member.role.toLowerCase();

          return (
            <div
              key={member.id}
              className={`p-5 rounded-2xl border bg-white shadow-sm flex flex-col justify-between transition-all ${
                !isActive ? 'opacity-60 bg-gray-50' : 'hover:border-orange-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-base text-gray-900">{member.name}</h4>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{member.phone}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      roleLower === 'owner'
                        ? 'bg-purple-100 text-purple-800'
                        : roleLower === 'manager'
                        ? 'bg-blue-100 text-blue-800'
                        : roleLower === 'cashier'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>

                <div className="my-4 p-3 rounded-xl bg-slate-50 space-y-1.5 text-xs">
                  {member.shift && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        Shift:
                      </span>
                      <span className="font-bold text-gray-800">{member.shift}</span>
                    </div>
                  )}
                  {member.salary !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
                        Salary:
                      </span>
                      <span className="font-black text-gray-900">₹{member.salary.toLocaleString()}/mo</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-orange-500" />
                  <span>Call</span>
                </a>

                <button
                  onClick={() => handleToggleActive(member)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {isActive ? 'Active Duty' : 'On Leave'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD STAFF MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 space-y-4"
          >
            <h3 className="font-extrabold text-base text-gray-900">Add Staff Member</h3>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Staff name"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Designation / Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
              >
                <option value="Cashier">Cashier & Counter Staff</option>
                <option value="Manager">Cafe Manager</option>
                <option value="Staff">Kitchen / Chef</option>
                <option value="Owner">Co-Owner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="10 digit mobile"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Shift</label>
              <select
                value={shift}
                onChange={e => setShift(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs"
              >
                <option value="Morning (8 AM - 4 PM)">Morning (8 AM - 4 PM)</option>
                <option value="Evening (3 PM - 11 PM)">Evening (3 PM - 11 PM)</option>
                <option value="Full Day (10 AM - 10 PM)">Full Day (10 AM - 10 PM)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Monthly Salary (₹)</label>
              <input
                type="number"
                value={salary}
                onChange={e => setSalary(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer"
              >
                Save Staff
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
