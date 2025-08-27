import React from "react";
import cn from "classnames";

export function Button({ children, className, variant = "default", ...props }) {
  const base = "px-4 py-2 rounded-md font-medium transition-colors";
  const styles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-100",
  };

  return (
    <button className={cn(base, styles[variant], className)} {...props}>
      {children}
    </button>
  );
}
