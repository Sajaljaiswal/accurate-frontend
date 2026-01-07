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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchAllUsers, createUser } from "../../api/axios";
import { InputField, PhoneInput } from "../../commom/FormComponents";
import { useAuth } from "../../auth/AuthContext";
import ConfirmModal from "../../commom/ConfirmModal";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
  
    const handleLogoutConfirm = () => {
      logout();
      navigate("/landingPage");
    };

  // --- UI & DATA STATES ---
  const [isSuperAdmin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [adminInfo] = useState({ username: "AdminUser", role: "SUPERADMIN" });

  // --- MODAL & FORM STATES ---
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      await createUser(newUser);
      alert("User created successfully ✅");
      setIsCreateModalOpen(false);
      setNewUser({
        username: "",
        userId: "",
        phone: "",
        email: "",
        password: "",
        role: "STAFF",
      });
      getUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
    } finally {
      setCreateLoading(false);
    }
  };


useEffect(() => {
  if (isSuperAdmin) getUsers();
}, [isSuperAdmin]);

const filteredUsers = users.filter((u) => {
  const matchesSearch = u.username
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
  const matchesRole = roleFilter === "" || u.role === roleFilter;
  return matchesSearch && matchesRole;
});

console.log("Filtered Users:", filteredUsers);
return (
  <div className="w-full min-h-screen p-10 bg-slate-50 relative">
    <div className="flex flex-col lg:flex-row gap-8">
      {/* LEFT PROFILE CARD */}
      <div className="w-full lg:w-80 space-y-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md">
            {adminInfo?.username?.[0]?.toUpperCase()}
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-800">
            {adminInfo?.username}
          </h2>
          <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">
            {adminInfo?.role}
          </p>
        </div>

        {isSuperAdmin && (
          <div className="space-y-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full py-3 bg-blue-900 text-white rounded-xl font-bold"
            >
              CREATE NEW USER
            </button>

            <button
              onClick={() => navigate("/roleManagement")}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 text-white rounded-2xl shadow-lg hover:bg-slate-700 font-bold transition-all"
            >
              <Shield size={18} /> ROLE MANAGEMENT
            </button>
          </div>
        )}
        <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full py-3 bg-blue-900 text-white rounded-xl font-bold"
            >
              LOGOUT
            </button>
      </div>

      {/* RIGHT MANAGEMENT SECTION */}
      <div className="flex-1 space-y-6">
        <header>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Admin Management
          </h1>
          <p className="text-slate-500">
            Managing {users.length} registered system users
          </p>
        </header>

        {/* FILTERS */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              placeholder="Search by username..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="SUPERADMIN">SuperAdmin</option>
            <option value="STAFF">Staff</option>
            <option value="LABORATORY">Laboratory</option>
            <option value="ACCOUNTS">Accounts</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                  Username
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                  User ID
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                  Phone
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                  Email
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                  Role
                </th>
                <th className="text-right p-4 text-xs font-bold text-slate-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-10 text-center text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="border-t hover:bg-slate-50">
                    <td className="p-4 font-medium">{u.username}</td>
                    <td className="p-4 text-slate-500">{u.userId}</td>
                    <td className="p-4 text-slate-500">{u.phone}</td>
                    <td className="p-4 text-slate-500">{u.email}</td>
                    <td className="p-4 font-bold">{u.role}</td>
                    <td className="p-4 text-right">
                      <button className="p-2 hover:text-blue-600">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {isCreateModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center max-h-screen justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
          {/* Header */}
          <div className="bg-blue-900 p-6 flex justify-between items-center text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <UserPlus size={20} /> Create New User
            </h2>
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="hover:rotate-90 transition"
            >
              <X size={22} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-6 overflow-y-auto"
          >
            {/* ROW 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
              />

              <InputField
                label="User ID"
                value={newUser.userId}
                onChange={(e) =>
                  setNewUser({ ...newUser, userId: e.target.value })
                }
              />
            </div>

            {/* ROW 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PhoneInput
                label="Phone Number"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e })
                }
              />

              <InputField
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>

            {/* ROW 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none cursor-pointer"
                >
                  <option value="STAFF">Staff</option>
                  <option value="LABORATORY">Laboratory</option>
                  <option value="ACCOUNTS">Accounts</option>
                  <option value="SUPERADMIN">Super Admin</option>
                </select>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createLoading}
                className="flex-1 py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 disabled:opacity-50"
              >
                {createLoading ? "Creating..." : "Save User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
      <ConfirmModal
            open={showLogoutModal}
            title="Confirm Logout"
            message="You will be logged out from the system."
            confirmText="Logout"
            variant="danger"
            onConfirm={handleLogoutConfirm}
            onCancel={() => setShowLogoutModal(false)}
          />
  </div>
);
};

export default ProfilePage;
