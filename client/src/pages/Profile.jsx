import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineLockClosed } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { updateProfile, changePassword, clearMessage, clearError } from '../redux/slices/authSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error, message } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, email: user.email });
    }
  }, [user]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
      if (activeTab === 'security') {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [message, error, dispatch, activeTab]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(profileData));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    dispatch(
      changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-heading text-3xl font-bold text-white mb-8">Account Settings</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-violet/10 text-violet border border-violet/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <HiOutlineUser size={20} />
            <span className="font-medium">Profile Information</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'security'
                ? 'bg-cyan/10 text-cyan border border-cyan/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <HiOutlineLockClosed size={20} />
            <span className="font-medium">Security & Password</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Personal Details</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-2xl font-bold text-white shadow-glow">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Account Type</p>
                    <p className="font-medium text-white capitalize">{user?.role}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" variant="primary" loading={loading && activeTab === 'profile'}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Update Password</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
                <Input
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
                <div className="pt-4">
                  <Button type="submit" variant="primary" loading={loading && activeTab === 'security'}>
                    Update Password
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
