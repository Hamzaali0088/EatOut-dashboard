export default function Button({
  variant = "primary",
  disabled,
  className = "",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-primary/60 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary text-black hover:bg-red-500",
    ghost: "bg-transparent border border-neutral-700 text-neutral-200 hover:bg-neutral-900",
    subtle: "bg-neutral-900 text-neutral-100 hover:bg-neutral-800"
  };

  return (
    <button
      {...props}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

