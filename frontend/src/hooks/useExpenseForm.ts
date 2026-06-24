/**
 * Custom hook for managing expense form state and validation
 */

import { useState } from "react";
import { ExpenseFormData } from "../types";
import { formatDate } from "../utils/expenseUtils";

interface UseExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
}

// Type for expense form errors
type ExpenseErrorMsgs = Partial<Omit<ExpenseFormData, 'category_id'>> & {
  category_id?: string
};

export function useExpenseForm({ initialData, onSubmit }: UseExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: initialData?.amount || "",
    description: initialData?.description || "",
    category_id: initialData?.category_id || 0,
    payer_name: initialData?.payer_name || "John Doe",
    date: initialData?.date || formatDate(new Date()),
  });

  const [errors, setErrors] = useState<ExpenseErrorMsgs>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof ExpenseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleChangeNumber = (field: keyof ExpenseFormData, value: string) => {
    const converted = parseInt(value)
    setFormData((prev) => ({ ...prev, [field]: converted }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  const validateForm = (): boolean => {
    const newErrors: ExpenseErrorMsgs = {};

    console.log(formData);

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.category_id < 0) {
      newErrors.category_id = "Category is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        amount: "",
        description: "",
        category_id: 0,
        date: formatDate(new Date()),
        payer_name: "John Doe",
      });
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      amount: initialData?.amount || "",
      description: initialData?.description || "",
      category_id: initialData?.category_id || 0,
      payer_name: initialData?.payer_name || "John Doe",
      date: initialData?.date || formatDate(new Date()),
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleChangeNumber,
    handleSubmit,
    resetForm,
  };
}
