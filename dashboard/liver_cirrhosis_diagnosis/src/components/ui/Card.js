import React from "react";

export function Card({ children, className }) {
  return <div className={`bg-white shadow rounded-lg p-4 ${className || ""}`}>{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="mb-2">{children}</div>;
}

export function CardTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export function CardContent({ children, className }) {
  return <div className={className ? `pt-2 ${className}` : "pt-2"}>{children}</div>;
}
