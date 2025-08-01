'use client';

import {TextAreaProps, Textarea as HeroTextarea} from '@heroui/input';
import {useState} from 'react';

export const Textarea = ({value, isInvalid, onBlur, ...props}: TextAreaProps) => {
  const [touched, setTouched] = useState<boolean>(false);

  return (
    <HeroTextarea
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
