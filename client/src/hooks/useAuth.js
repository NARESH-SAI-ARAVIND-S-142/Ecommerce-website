import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  loginUser,
  registerUser,
  googleLogin,
  logoutUser,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  addAddress,
  updateAddress,
  deleteAddress,
  clearError,
  clearMessage,
} from '../redux/slices/authSlice';

/**
 * Custom hook for auth state and actions.
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, message } = useSelector(
    (state) => state.auth
  );

  const login = useCallback(
    (credentials) => dispatch(loginUser(credentials)),
    [dispatch]
  );

  const register = useCallback(
    (userData) => dispatch(registerUser(userData)),
    [dispatch]
  );

  const loginWithGoogle = useCallback(
    (credential) => dispatch(googleLogin(credential)),
    [dispatch]
  );

  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);

  const fetchMe = useCallback(() => dispatch(getMe()), [dispatch]);

  const editProfile = useCallback(
    (data) => dispatch(updateProfile(data)),
    [dispatch]
  );

  const editPassword = useCallback(
    (data) => dispatch(changePassword(data)),
    [dispatch]
  );

  const sendResetEmail = useCallback(
    (email) => dispatch(forgotPassword(email)),
    [dispatch]
  );

  const confirmReset = useCallback(
    (data) => dispatch(resetPassword(data)),
    [dispatch]
  );

  const createAddress = useCallback(
    (data) => dispatch(addAddress(data)),
    [dispatch]
  );

  const editAddress = useCallback(
    (id, data) => dispatch(updateAddress({ addressId: id, addressData: data })),
    [dispatch]
  );

  const removeAddress = useCallback(
    (id) => dispatch(deleteAddress(id)),
    [dispatch]
  );

  const resetError = useCallback(() => dispatch(clearError()), [dispatch]);
  const resetMessage = useCallback(() => dispatch(clearMessage()), [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    message,
    login,
    register,
    loginWithGoogle,
    logout,
    fetchMe,
    editProfile,
    editPassword,
    sendResetEmail,
    confirmReset,
    createAddress,
    editAddress,
    removeAddress,
    resetError,
    resetMessage,
    isAdmin: user?.role === 'admin',
  };
};

export default useAuth;
