/**
 * Form component for adding a category
 */

import React, {useEffect} from "react";
import {CategoryFormData} from "../types";
import {TextField, Button} from "../vibes";
import {useCategoryForm} from "../hooks/useCategoryForm.ts";

interface CategoryFormProps {
    initialData?: Partial<CategoryFormData>;
    onSubmit: (data: CategoryFormData) => Promise<void>;
    onCancel?: () => void;
    submitLabel?: string;
    valErrors?: string[];
}

export function CategoryForm({
                                 initialData,
                                 onSubmit,
                                 onCancel,
                                 submitLabel = "Add Category",
                                 valErrors
                             }: CategoryFormProps) {
    const {formData, errors, isSubmitting, handleChange, handleSubmit} =
        useCategoryForm({
            initialData,
            onSubmit,
        });

    const formStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    };

    const buttonGroupStyle: React.CSSProperties = {
        display: "flex",
        gap: "0.5rem",
        marginTop: "0.5rem",
    };

    useEffect(() => {
        if (valErrors) {
            errors.name = valErrors[0];
        }
    }, [valErrors]);

    return (
        <form onSubmit={handleSubmit} style={formStyle}>

            <TextField
                label="Name"
                type="text"
                placeholder="Enter name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                error={errors.name}
                fullWidth
                required
            />

            <div style={buttonGroupStyle}>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    fullWidth
                >
                    {isSubmitting ? "Submitting..." : submitLabel}
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
}
