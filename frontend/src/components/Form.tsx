import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FieldConfig {
  name: string;
  label: string;
  type: string;
  validation: z.ZodTypeAny;
}

interface FormProps {
  fields: FieldConfig[];
  onSubmit: (data: any, resetForm: () => void) => void;
  initialData?: Record<string, any>;
  submitButtonText?: string;
}

const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  initialData = {},
  submitButtonText = "Submit",
}) => {
  const schemaObject = fields.reduce((acc, field) => {
    acc[field.name] = field.validation;
    return acc;
  }, {} as Record<string, z.ZodTypeAny>);

  const schema = z.object(schemaObject);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  const handleFormSubmit = (data: any) => {
    onSubmit(data, reset);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <Label htmlFor={field.name} className="font-bold text-gray-800">
            {field.label}
          </Label>
          <Input
            {...register(field.name)}
            id={field.name}
            type={field.type}
            className="mt-1"
          />
          {errors[field.name] && (
            <p className="text-red-500 text-sm mt-1">
              {errors[field.name]?.message as string}
            </p>
          )}
        </div>
      ))}
      <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
        {isSubmitting ? "Submitting..." : submitButtonText}
      </Button>
    </form>
  );
};

export default Form;
