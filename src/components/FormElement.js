// @flow

import React from 'react';

export type Props = {
  label: String,
  field: String,
  value: String,
  onChange: (value: String) => void,
  type?: String
};

function FormElement(props: Props) {
  const { label, field, value, onChange, type } = props;
  return (
    <label>
      {label}
      <input
        onChange={(e: Event) => onChange(field, e.target.value)}
        placeholder={label}
        value={value}
        type={type || 'text'}
      />
    </label>
  );
}

export default FormElement;
