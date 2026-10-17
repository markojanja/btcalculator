import { useId } from "react";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Number input without the browser's spinner arrows.
export const NumberInput = ({ className, ...props }) => (
  <Input
    type="number"
    inputMode="decimal"
    className={cn(
      "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
      className,
    )}
    {...props}
  />
);

export const TextField = ({ label, value, onChange, className, ...props }) => {
  const id = useId();
  return (
    <Field className={className}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </Field>
  );
};

export const NumberField = ({ label, value, onChange, className, ...props }) => {
  const id = useId();
  return (
    <Field className={className}>
      <Label htmlFor={id}>{label}</Label>
      <NumberInput
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </Field>
  );
};

const toOption = (option) =>
  typeof option === "string" ? { value: option, label: option } : option;

// `options` can be plain strings or { value, label } objects.
export const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  className,
  disabled,
}) => (
  <Field className={className}>
    <Label>{label}</Label>
    <Select value={value ?? ""} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(toOption).map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </Field>
);

export const CheckboxField = ({ label, checked, onChange, disabled }) => {
  const id = useId();
  return (
    <Field orientation="horizontal">
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value) => onChange(Boolean(value))}
      />
      <Label htmlFor={id}>{label}</Label>
    </Field>
  );
};
