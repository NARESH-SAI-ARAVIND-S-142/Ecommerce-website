import { useState, useId } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

/**
 * Styled input with floating label, validation states, and password toggle.
 */
const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  icon,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputId = useId();

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const hasValue = value && value.length > 0;

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          relative flex items-center rounded-xl transition-all duration-300
          ${error
            ? 'border border-coral/50 bg-coral/5'
            : focused
              ? 'border border-violet/50 bg-violet/5 shadow-glow'
              : 'border border-white/10 bg-white/[0.03] hover:border-white/20'
          }
        `}
      >
        {/* Leading icon */}
        {icon && (
          <span
            className={`pl-4 transition-colors duration-300 ${
              focused ? 'text-violet' : 'text-gray-500'
            }`}
          >
            {icon}
          </span>
        )}

        <input
          id={inputId}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setFocused(true)}
          placeholder={focused ? placeholder : ' '}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`
            w-full bg-transparent px-4 py-3 text-gray-200 text-sm
            placeholder:text-gray-600 focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-2' : ''}
            ${isPassword ? 'pr-12' : ''}
            ${label ? 'pt-5 pb-1.5' : ''}
          `}
          {...props}
        />

        {/* Floating label */}
        {label && (
          <label
            htmlFor={inputId}
            className={`
              absolute left-4 transition-all duration-300 pointer-events-none
              ${icon ? 'left-11' : 'left-4'}
              ${focused || hasValue
                ? 'top-1.5 text-2xs font-medium'
                : 'top-1/2 -translate-y-1/2 text-sm'
              }
              ${error
                ? 'text-coral'
                : focused
                  ? 'text-violet'
                  : 'text-gray-500'
              }
            `}
          >
            {label}
            {required && <span className="text-coral ml-0.5">*</span>}
          </label>
        )}

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-gray-500 hover:text-gray-300 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-xs text-coral flex items-center gap-1"
          role="alert"
        >
          <svg
            className="w-3 h-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
