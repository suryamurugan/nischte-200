import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface OfferField {
  name: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
  dependsOn?: string;
}

interface OfferFormProps {
  fields: OfferField[];
  onSubmit: (data: Record<string, any>, resetForm: () => void) => void;
  initialData?: Record<string, any>;
  isUpdate?: boolean;
}

const OfferForm: React.FC<OfferFormProps> = ({
  fields,
  onSubmit,
  initialData = {},
  isUpdate = false,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedOfferType, setSelectedOfferType] = useState<string>("");

  useEffect(() => {
    const initialOfferType = initialData["offerType.name"];
    if (initialOfferType) {
      setSelectedOfferType(initialOfferType);
    }
  }, [initialData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "offerType.name") {
      setSelectedOfferType(value);
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const resetForm = () => {
    setFormData(initialData);
    setSelectedOfferType(initialData["offerType.name"] || "");
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (isUpdate && field.name === "offerType.name") return;

      if (field.type !== "checkbox" && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData, resetForm);
  };

  const shouldRenderField = (field: OfferField): boolean => {
    if (isUpdate && field.name === "offerType.name") return false;

    if (!field.dependsOn) return true;
    if (field.dependsOn === "offerType.name") {
      switch (selectedOfferType) {
        case "Flat-Discount":
          return (
            field.name === "offerDescription.discountRate" ||
            field.name === "offerDescription.minOrder"
          );
        case "Plus-Offer":
          return field.name === "offerDescription.plusOffers";
        case "Special-Offer":
          return field.name === "offerDescription.specialOccasionDate";
        default:
          return false;
      }
    }
    return false;
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => {
          if (!shouldRenderField(field)) return null;

          return (
            <div key={field.name}>
              <Label htmlFor={field.name} className="font-bold text-gray-800">
                {field.label}
              </Label>
              {field.type === "select" ? (
                <Select
                  onValueChange={(value) =>
                    handleSelectChange(field.name, value)
                  }
                  value={formData[field.name] || ""}
                >
                  <SelectTrigger className="mt-1 border-gray-300 rounded-md focus:ring focus:ring-opacity-50">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "checkbox" ? (
                <div className="flex items-center mt-1">
                  <Checkbox
                    id={field.name}
                    checked={formData[field.name] || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(field.name, checked as boolean)
                    }
                    className="mr-2"
                  />
                  <Label htmlFor={field.name} className="text-sm text-gray-700">
                    {field.label}
                  </Label>
                </div>
              ) : (
                <Input
                  name={field.name}
                  id={field.name}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="mt-1"
                  aria-invalid={errors[field.name] ? "true" : "false"}
                />
              )}
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        })}
        <Button type="submit" className="w-full mt-4">
          {isUpdate ? "Update" : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default OfferForm;
