'use client';
import { chevronDown } from '@/assets/svg';
import Image from 'next/image';
import React, { useState } from 'react';

const CustomMultiSelectFilter = ({ options, onSelect, defaultButtonLabel = 'Select option' }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const optionLength = selectedOptions.length;
    const handleOptionChange = (event) => {
        const { value, checked } = event.target;

        if (checked) {
            setSelectedOptions([...selectedOptions, value]);
        } else {
            setSelectedOptions(selectedOptions.filter(option => option !== value));
        }
        onSelect(selectedOptions);
    };

    const handleClose = () => {
        setIsOpen(!isOpen);
    };

    const displaySelectedOptions = () => {
        if (optionLength === 0) return defaultButtonLabel;
        if (optionLength === 1) return selectedOptions[0];
        return `${selectedOptions[0]}, ${optionLength - 1}+`;
    };

    return (
        <div className="relative">
            <button
                className="py-2 px-3 text-left text-sm font-semibold rounded-md shadow-sm flex justify-between gap-16 bg-[rgb(var(--lb-blue-900))] focus:border-[rgb(var(--lb-blue-300))] focus:border-2"
                onClick={handleClose}
            >
                {displaySelectedOptions()}
                <Image src={chevronDown} alt="down arrow" className="mr-3" />
            </button>
            <div
                className={`absolute z-10 mt-2 max-w-40 w-full rounded-md bg-[rgb(var(--lb-blue-900))] text-white shadow-lg ${
                    isOpen ? 'block' : 'hidden'
                }`}
            >
                <ul className="py-2">
                    {options.map(option => (
                        <li key={option.value}>
                            <div className="flex items-center pl-3 py-2 hover:bg-[rgb(var(--lb-blue-500))]">
                                {option.label === 'Clear All' ? '' : (
                                    <input
                                        id={option.value}
                                        type="checkbox"
                                        value={option.value}
                                        checked={selectedOptions.includes(option.value)}
                                        onChange={handleOptionChange}
                                        className="w-4 h-4 mr-2 text-green-400 border-gray-300 rounded focus:ring-green-400"
                                    />
                                )}
                                <label
                                    htmlFor={option.value}
                                    className="ml-3 text-sm font-medium mx-2 text-center"
                                >
                                    {option.label}
                                    {option.label === 'Clear All'
                                        ? ''
                                        : (
                                            <span className="bg-[rgb(var(--lb-blue-300))] rounded-md px-1">
                                                {option.count}
                                            </span>
                                        )}
                                </label>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CustomMultiSelectFilter;