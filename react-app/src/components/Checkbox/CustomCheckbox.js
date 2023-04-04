import React, { useState } from 'react';
import './CustomCheckbox.css';

export default function CustomCheckbox({ isChecked, onChange }) {
  const [checked, setChecked] = useState(isChecked);

  const handleClick = () => {
    const newCheckedState = !checked;
    setChecked(newCheckedState);
    onChange(newCheckedState);
  };


  const checkboxClasses = checked
    ? 'custom-checkbox custom-checkbox-checked'
    : 'custom-checkbox custom-checkbox-unchecked';

  return (
    <div
      className={checkboxClasses}
      onClick={handleClick}
    />
  );
}
