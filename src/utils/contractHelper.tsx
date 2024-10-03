import Input from "@/components/Input";
import React from "react";

export const handleInputChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  inputName: string,
  setInputs: React.Dispatch<React.SetStateAction<Record<string, any>>>
) => {
  const value = event.target.value;
  setInputs((prevInputs) => ({
    ...prevInputs,
    [inputName]: value,
  }));
};

export const renderFunctionInputs = (
  func: any,
  inputs: Record<string, any>,
  setInputs: React.Dispatch<React.SetStateAction<Record<string, any>>>
) => {
  return func.inputs.map((input: any, index: number) => (
    <Input
      key={index}
      type="text"
      placeholder={input.name || input.internalType}
      onChange={(e) => handleInputChange(e, input.name, setInputs)}
      className="border p-2 mb-4 w-full"
    />
  ));
};
