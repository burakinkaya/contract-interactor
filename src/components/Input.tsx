import React from "react";

interface InputProps {
  type: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  name?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  type,
  value,
  onChange,
  placeholder = "",
  id,
  className = "",
  name = "",
  disabled = false,
}) => {
  return (
    <input
      className={`shadow appearance-none border rounded-md py-2 px-3 leading-tight focus:outline-none focus:shadow-outline w-full bg-transparent text-white ${className}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      id={id}
      name={name}
      required
    />
  );
};

export default Input;
