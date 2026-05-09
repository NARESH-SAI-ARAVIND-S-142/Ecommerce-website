import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, updateUserRole } from '../../redux/slices/adminSlice';
import { HiOutlineUser, HiOutlineShieldCheck, HiOutlineTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
      toast.success('User role updated successfully');
    } catch (err) {
      toast.error(err || 'Failed to update role');
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet/30 border-t-violet rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-white mb-8">Manage Users</h1>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-sm font-medium text-gray-400">
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold shadow-glow flex-shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-white truncate max-w-[150px]">{u.name}</span>
                    {u._id === currentUser?._id && (
                      <span className="text-[10px] bg-cyan/10 text-cyan px-2 py-0.5 rounded-full border border-cyan/20">You</span>
                    )}
                  </td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {u.role === 'admin' ? (
                        <HiOutlineShieldCheck className="text-violet" size={16} />
                      ) : (
                        <HiOutlineUser className="text-gray-400" size={16} />
                      )}
                      <select
                        className={`bg-transparent focus:outline-none cursor-pointer ${u.role === 'admin' ? 'text-violet font-bold' : 'text-gray-300'}`}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={u._id === currentUser?._id}
                      >
                        <option value="user" className="bg-navy text-gray-300">User</option>
                        <option value="admin" className="bg-navy text-violet">Admin</option>
                      </select>
                    </div>
                  </td>
                  <td className="p-4 text-center text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      className="text-gray-500 hover:text-coral transition-colors disabled:opacity-50"
                      disabled={u._id === currentUser?._id || u.role === 'admin'}
                      title="Delete User"
                    >
                      <HiOutlineTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
