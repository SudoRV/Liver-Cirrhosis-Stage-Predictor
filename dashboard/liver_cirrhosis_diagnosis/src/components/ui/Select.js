import React, { useState, createContext, useContext } from "react";

// Context to manage single open dropdown
const DropdownContext = createContext();

export function DropdownProvider({ children }) {
  const [openId, setOpenId] = useState(null);
  return (
    <DropdownContext.Provider value={{ openId, setOpenId }}>
      {children}
    </DropdownContext.Provider>
  );
}

export function Select({ id, value, label, onValueChange, children }) {
  const [localValue, setLocalValue] = useState(value);
  const { openId, setOpenId } = useContext(DropdownContext);

  const isOpen = openId === id;

  const toggle = () => setOpenId(isOpen ? null : id);

  const handleSelect = (val) => {
    setLocalValue(val);
    onValueChange(val);
    setOpenId(null);
  };

  return (
    <div className="relative w-full">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <input name={label} style={{display:"none"}} value={value} readOnly ></input>
      {React.Children.map(children, (child) =>
        child.type.name === "SelectTrigger"
          ? React.cloneElement(child, { value: localValue, toggle, isOpen })
          : child.type.name === "SelectContent"
          ? React.cloneElement(child, { handleSelect, isOpen })
          : child
      )}
    </div>
  );
}

export function SelectTrigger({ children, value, toggle, isOpen }) {
  return (
    <div
      className="border px-3 py-2 rounded-md cursor-pointer bg-white flex justify-between items-center    hover:border-blue-500 transition-colors duration-200"
      onClick={toggle}
    >
      {children}
      <span className="ml-2 text-xs font-thin opacity-60">{isOpen ? "▲" : "▼"}</span>
    </div>
  );
}

export function SelectValue({ value, placeholder }) {
  return <span style={{color: value ? "black" : "#919191ff"}}>{value || placeholder}</span>;
}

export function SelectContent({ children, handleSelect, isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg z-10">
      {React.Children.map(children, (child) =>
        child.type.name === "SelectItem"
          ? React.cloneElement(child, { handleSelect })
          : child
      )}
    </div>
  );
}

export function SelectItem({ value, children, handleSelect }) {
  return (
    <div
      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => handleSelect(value)}
    >
      {children}
    </div>
  );
}
