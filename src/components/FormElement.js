// @flow

import React from 'react';

export type Props = {
  label: string,
  field: string,
  value: string,
  onChange?: (value: string | number) => void,
  message?: string,
  type?: string,
  disabled?: boolean,
  minLength?: number
};

function FormElement(props: Props) {
  const {
    label,
    field,
    value,
    onChange,
    type,
    message,
    minLength,
    ...rest
  } = props;
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
              onChange(value);
            } else {
              const value = e.target.value;
              onChange && onChange(value);
            }
          }}
          placeholder={label}
          value={value}
          type={type || 'text'}
          {...rest}
        />
        <div className="validationMessage">
          {message && <div>{message}</div>}
          {minLength &&
            value.length < minLength && <div>Minimumlänge: {minLength}</div>}
        </div>
      </div>
    </label>
  );
}

export default FormElement;
