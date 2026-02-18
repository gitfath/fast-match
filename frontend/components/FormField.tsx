"use client";
import React from 'react';

interface FormFieldProps {
    label: string;
    name: string;
    type?: 'text' | 'number' | 'select' | 'textarea' | 'multiselect';
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    options?: string[] | { value: any; label: string }[];
    placeholder?: string;
    required?: boolean;
    helpText?: string;
    rows?: number;
}

export default function FormField({
    label,
    name,
    type = 'text',
    value,
    onChange,
    options = [],
    placeholder,
    required = false,
    helpText,
    rows = 4
}: FormFieldProps) {
    const renderInput = () => {
        switch (type) {
            case 'select':
                return (
                    <select
                        name={name}
                        value={value || ''}
                        onChange={onChange}
                        className="input-field"
                        required={required}
                    >
                        <option value="">-- Sélectionner --</option>
                        {options.map((option) => {
                            const optValue = typeof option === 'string' ? option : option.value;
                            const optLabel = typeof option === 'string' ? option : option.label;
                            return (
                                <option key={optValue} value={optValue}>
                                    {optLabel}
                                </option>
                            );
                        })}
                    </select>
                );

            case 'textarea':
                return (
                    <textarea
                        name={name}
                        value={value || ''}
                        onChange={onChange}
                        className="input-field"
                        rows={rows}
                        placeholder={placeholder}
                        required={required}
                        style={{ resize: 'vertical' }}
                    />
                );

            case 'multiselect':
                return (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                        {options.map((option) => {
                            const optValue = typeof option === 'string' ? option : option.value;
                            const optLabel = typeof option === 'string' ? option : option.label;
                            const isSelected = Array.isArray(value) && value.includes(optValue);

                            return (
                                <button
                                    key={optValue}
                                    type="button"
                                    onClick={() => {
                                        const currentValues = Array.isArray(value) ? value : [];
                                        const newValues = isSelected
                                            ? currentValues.filter((v: any) => v !== optValue)
                                            : [...currentValues, optValue];

                                        // Create a synthetic event
                                        const syntheticEvent = {
                                            target: { name, value: newValues }
                                        } as unknown as React.ChangeEvent<HTMLInputElement>;
                                        onChange(syntheticEvent);
                                    }}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '50px',
                                        border: '2px solid',
                                        borderColor: isSelected ? 'var(--primary)' : '#eee',
                                        background: isSelected ? 'var(--accent-light)' : 'white',
                                        color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {optLabel}
                                </button>
                            );
                        })}
                    </div>
                );

            default:
                return (
                    <input
                        type={type}
                        name={name}
                        value={value || ''}
                        onChange={onChange}
                        className="input-field"
                        placeholder={placeholder}
                        required={required}
                    />
                );
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {label}
                {required && <span style={{ color: 'var(--primary)' }}> *</span>}
            </label>
            {renderInput()}
            {helpText && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {helpText}
                </p>
            )}
        </div>
    );
}
