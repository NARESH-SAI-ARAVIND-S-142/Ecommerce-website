import { Toaster } from 'react-hot-toast';

/**
 * Toast notification provider with NexMart styling.
 */
const ToastProvider = () => (
  <Toaster
    position="top-right"
    gutter={12}
    toastOptions={{
      duration: 4000,
      style: {
        background: 'rgba(26, 32, 56, 0.95)',
        backdropFilter: 'blur(12px)',
        color: '#E2E8F0',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      success: {
        iconTheme: {
          primary: '#00C9A7',
          secondary: '#0A0F1E',
        },
        style: {
          borderColor: 'rgba(0, 201, 167, 0.2)',
        },
      },
      error: {
        iconTheme: {
          primary: '#FF6B6B',
          secondary: '#0A0F1E',
        },
        style: {
          borderColor: 'rgba(255, 107, 107, 0.2)',
        },
      },
    }}
  />
);

export default ToastProvider;
