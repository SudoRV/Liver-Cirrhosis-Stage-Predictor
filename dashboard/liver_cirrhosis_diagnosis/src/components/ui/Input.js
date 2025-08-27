import React from "react";
import cn from "classnames";

export function Input({ className, placeholder, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">{placeholder}</label>
      <input
        name={placeholder.replaceAll(" ", "_")}
        placeholder={placeholder}
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500",
          className
        )}
        {...props}
      />
    </div>
  );
}
