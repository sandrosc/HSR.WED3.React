// @flow

import React from 'react';

export type Props = {
  label: string,
  field: string,
  value: string,
  onChange: (field: string, value: string) => void,
  type?: string
};

function FormElement(props: Props) {
  const { label, field, value, onChange, type } = props;
  return (
    <label>
      {label}
      <input
        onChange={(e: SyntheticInputEvent<HTMLInputElement>) => {
          onChange(field, e.target.value);
        }}
        placeholder={label}
        value={value}
        type={type || 'text'}
      />
    </label>
  );
}

export default FormElement;
