import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Edit2,
  Trash2,
  Search,
  Shield,
  Eye,
  EyeOff,
  X,
  LogOut,
  Mail,
  Phone as PhoneIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/axios";
import { InputField, PhoneInput } from "../../commom/FormComponents";
import { useAuth } from "../../auth/AuthContext";
import ConfirmModal from "../../commom/ConfirmModal";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Logged in user data
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [users, setUsers] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    username: "",
    userId: "",
    phone: "",
    email: "",
    password: "",
    role: "STAFF",
  });

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleLogoutConfirm = () => {
    logout();
    navigate("/landingPage");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      await createUser(newUser);
      setIsCreateModalOpen(false);
      setNewUser({ username: "", userId: "", phone: "", email: "", password: "", role: "STAFF" });
      getUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteClick = (u) => {
    setUserToDelete(u);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(userToDelete._id);
      getUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleEditClick = (u) => {
    setEditingUser({ ...u });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      await updateUser(editingUser._id, editingUser);
      setIsEditModalOpen(false);
      getUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user");
    } finally {
      setCreateLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q);
    const matchesRole = roleFilter === "" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    const base = "px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ";
    switch (role) {
      case "SUPERADMIN": return base + "bg-rose-50 text-rose-600 border-rose-100";
      case "LABORATORY": return base + "bg-blue-50 text-blue-600 border-blue-100";
      case "ACCOUNTS": return base + "bg-emerald-50 text-emerald-600 border-emerald-100";
      default: return base + "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SECTION: PROFILE SUMMARY */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-28 bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center relative">
               <Shield className="absolute top-4 right-4 text-white/20" size={60} />
            </div>
            <div className="px-6 pb-8 -mt-12 flex flex-col items-center relative z-10">
              <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-xl">
                <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-3xl font-black text-blue-700 border border-slate-100 uppercase">
                  {user?.username?.[0] || "A"}
                </div>
              </div>
              <h2 className="mt-4 text-2xl font-black text-slate-900 tracking-tight">{user?.username || "Admin User"}</h2>
              <span className="mt-1 px-4 py-1 bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                {user?.role || "SUPERADMIN"}
              </span>

              <div className="w-full mt-10 space-y-3">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <UserPlus size={18} /> Create New User
                </button>
                <button
                  onClick={() => navigate("/roleManagement")}
                  className="w-full py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-bold transition-all flex items-center justify-center gap-3"
                >
                  <Shield size={18} className="text-blue-600" /> Permissions
                </button>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full py-4 text-rose-600 hover:bg-rose-50 rounded-2xl font-bold transition-all flex items-center justify-center gap-3"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Users Overview</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-sm font-medium text-slate-300">Total System Users</span>
                   <span className="text-xl font-black">{users.length}</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 w-2/3"></div>
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT SECTION: TABLE MANAGEMENT */}
        <div className="flex-1 space-y-6">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Admin Management</h1>
              <p className="text-slate-500 font-medium">Control and monitor system access across roles.</p>
            </div>
          </header>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
            {/* Filter Header */}
            <div className="p-6 bg-slate-50/50 flex flex-col md:flex-row gap-4 border-b border-slate-100">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  placeholder="Search by username, email or ID..."
                  className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none cursor-pointer font-bold text-slate-600 focus:border-blue-600"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Authorities</option>
                <option value="SUPERADMIN">Super Admin</option>
                <option value="STAFF">Staff</option>
                <option value="LABORATORY">Laboratory</option>
                <option value="ACCOUNTS">Accounts</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="px-8 py-5">Full Identity</th>
                    <th className="px-8 py-5">Contact Details</th>
                    <th className="px-8 py-5 text-center">Role Authority</th>
                    <th className="px-8 py-5 text-right">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-24 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-10 h-10 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Synchronizing Database...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-24 text-center text-slate-400 font-bold italic uppercase text-xs">No system users found</td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u._id} className="group hover:bg-slate-50/80 transition-all">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                              {u.username?.[0]}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-base">{u.username}</p>
                              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">ID: {u.userId || u._id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                              <Mail size={14} className="text-slate-300" /> {u.email}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                              <PhoneIcon size={14} /> {u.phone || 'NO PHONE'}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className={getRoleBadge(u.role)}>{u.role}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditClick(u)}
                              className="p-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                              title="Edit User"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(u)}
                              className="p-3 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                              title="Delete User"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* --- CREATE / EDIT MODAL --- */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className={`p-10 flex justify-between items-center text-white ${isEditModalOpen ? 'bg-indigo-600' : 'bg-blue-600'}`}>
              <div>
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                  {isEditModalOpen ? <Edit2 size={28}/> : <UserPlus size={28}/>}
                  {isEditModalOpen ? `Edit Profile` : 'New User'}
                </h2>
                <p className="text-white/70 text-sm mt-1">Configure system credentials and role authority.</p>
              </div>
              <button onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }} className="p-3 hover:bg-white/20 rounded-full transition"><X /></button>
            </div>

            <form onSubmit={isEditModalOpen ? handleEditSubmit : handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Username" value={isEditModalOpen ? editingUser.username : newUser.username} onChange={(e) => isEditModalOpen ? setEditingUser({...editingUser, username: e.target.value}) : setNewUser({...newUser, username: e.target.value})} />
                {!isEditModalOpen && <InputField label="User ID" value={newUser.userId} onChange={(e) => setNewUser({...newUser, userId: e.target.value})} />}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PhoneInput label="Mobile Number" value={isEditModalOpen ? editingUser.phone : newUser.phone} onChange={(val) => isEditModalOpen ? setEditingUser({...editingUser, phone: val}) : setNewUser({...newUser, phone: val})} />
                <InputField label="Email Address" type="email" value={isEditModalOpen ? editingUser.email : newUser.email} onChange={(e) => isEditModalOpen ? setEditingUser({...editingUser, email: e.target.value}) : setNewUser({...newUser, email: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                {!isEditModalOpen && (
                  <div className="relative">
                    <InputField label="Secure Password" type={showPassword ? "text" : "password"} value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[42px] text-slate-400">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase px-2 tracking-widest">Access Role</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 font-bold text-slate-600 appearance-none"
                    value={isEditModalOpen ? editingUser.role : newUser.role}
                    onChange={(e) => isEditModalOpen ? setEditingUser({...editingUser, role: e.target.value}) : setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="STAFF">STAFF</option>
                    <option value="LABORATORY">LABORATORY</option>
                    <option value="ACCOUNTS">ACCOUNTS</option>
                    <option value="SUPERADMIN">SUPER ADMIN</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <button type="button" onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }} className="flex-1 py-4 font-bold text-slate-400 hover:bg-slate-50 rounded-2xl transition-all uppercase text-xs tracking-widest">Cancel</button>
                <button type="submit" disabled={createLoading} className={`flex-1 py-4 text-white font-black rounded-2xl shadow-xl transition-all uppercase text-xs tracking-widest ${isEditModalOpen ? 'bg-indigo-600 shadow-indigo-100' : 'bg-blue-600 shadow-blue-100'}`}>
                  {createLoading ? 'Syncing...' : isEditModalOpen ? 'Update Profile' : 'Confirm & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION OVERLAYS */}
      <ConfirmModal open={showDeleteModal} title="Delete Profile" message={`Warning: All access for ${userToDelete?.username} will be revoked. Continue?`} confirmText="Delete Forever" variant="danger" onConfirm={handleConfirmDelete} onCancel={() => setShowDeleteModal(false)} />
      <ConfirmModal open={showLogoutModal} title="Terminate Session" message="Are you sure you want to log out of your current administration session?" confirmText="Sign Out" variant="danger" onConfirm={handleLogoutConfirm} onCancel={() => setShowLogoutModal(false)} />
    </div>
  );
};

export default ProfilePage;