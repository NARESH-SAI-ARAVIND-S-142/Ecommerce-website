import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Premium button with ripple effect and multiple variants.
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} fullWidth - Take full container width
 * @param {boolean} loading - Show loading spinner
 * @param {React.ReactNode} icon - Leading icon
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const buttonRef = useRef(null);
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    // Create ripple
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rippleId = Date.now();

    setRipples((prev) => [...prev, { x, y, id: rippleId }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);

    if (onClick && !disabled && !loading) {
      onClick(e);
    }
  };

  const baseStyles =
    'relative overflow-hidden inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-navy';

  const variants = {
    primary:
      'bg-gradient-to-r from-violet to-violet-600 text-white hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]',
    secondary:
      'bg-gradient-to-r from-cyan to-cyan-600 text-navy-400 font-semibold hover:shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98]',
    outline:
      'border border-violet/30 text-violet hover:bg-violet/10 hover:border-violet/50 active:scale-[0.98]',
    ghost:
      'text-gray-300 hover:bg-white/5 hover:text-white active:scale-[0.98]',
    danger:
      'bg-gradient-to-r from-coral to-coral-600 text-white hover:shadow-glow-coral hover:scale-[1.02] active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-2.5 text-sm gap-2',
    lg: 'px-8 py-3 text-base gap-2.5',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none';

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? disabledStyles : 'cursor-pointer'}
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple-effect"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '20px',
            height: '20px',
            marginLeft: '-10px',
            marginTop: '-10px',
          }}
        />
      ))}

      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
