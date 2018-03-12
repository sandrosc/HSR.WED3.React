// @flow

import React from 'react';

export type Props = {
  label: string,
  field: string,
  value: string,
  onChange?: (field: string, value: string | number) => void,
  message?: string,
  type?: string,
  disabled?: boolean
};

function FormElement(props: Props) {
  const { label, field, value, onChange, type, message, ...rest } = props;
  return (
    <label>
      {label}
      <div>
        <input
          onChange={(e: SyntheticInputEvent<HTMLInputElement>) => {
            if (!onChange) return;
            if (type === 'number') {
              const numberValue = parseFloat(e.target.value);
              const value = Number.isNaN(numberValue) ? 0 : numberValue;
              onChange(field, value);
            } else {
              const value = e.target.value;
              onChange && onChange(field, value);
            }
          }}
          placeholder={label}
          value={value}
          type={type || 'text'}
          {...rest}
        />
        <div className="validationMessage">{message}</div>
      </div>
    </label>
  );
}

export default FormElement;
