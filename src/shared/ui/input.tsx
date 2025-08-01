'use client';

import {InputProps, Input as HeroInput} from '@heroui/input';
import {useState} from 'react';

export const Input = ({value, isInvalid, onBlur, ...props}: InputProps) => {
  const [touched, setTouched] = useState<boolean>(false);

  return (
    <HeroInput
      {...props}
      value={value ?? ''}
      onBlur={e => {
        setTouched(true);
        onBlur?.(e);
      }}
      isInvalid={isInvalid && touched}
      validationBehavior="aria"
    />
  );
};
