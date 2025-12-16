import React from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  const baseClasses =
    "cosmic-btn inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-cosmic-purple to-cosmic-purple-dark text-white hover:shadow-glow-purple border border-cosmic-purple-light/50",
    secondary:
      "bg-gradient-to-r from-cosmic-cyan to-cosmic-cyan-dark text-cosmic-deep hover:shadow-glow-cyan border border-cosmic-cyan/50",
    outline:
      "bg-transparent border-2 border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10 hover:shadow-glow-purple",
    ghost:
      "bg-transparent text-cosmic-text hover:bg-cosmic-purple/20 border border-transparent hover:border-cosmic-purple-light/30",
    danger:
      "bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-500/50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && Icon && iconPosition === "left" && (
        <Icon className="w-5 h-5" />
      )}
      {children}
      {!loading && Icon && iconPosition === "right" && (
        <Icon className="w-5 h-5" />
      )}
    </button>
  );
};

export default Button;
