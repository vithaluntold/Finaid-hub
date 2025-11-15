/**
 * Safe Input component wrapper that ensures controlled behavior
 * Prevents React controlled/uncontrolled component warnings
 */

import React from 'react';
import { Input as UIInput } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SafeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const SafeInput = React.forwardRef<HTMLInputElement, SafeInputProps>(
  ({ value, defaultValue, className, ...props }, ref) => {
    // Ensure value is always defined for controlled inputs
    const controlledValue = value !== undefined ? String(value) : "";
    
    return (
      <UIInput
        ref={ref}
        className={cn(className)}
        value={controlledValue}
        {...props}
      />
    );
  }
);

SafeInput.displayName = "SafeInput";

export default SafeInput;