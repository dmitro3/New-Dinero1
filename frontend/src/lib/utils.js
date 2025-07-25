import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isEmpty(value) {
  // Check for null or undefined
  // eslint-disable-next-line eqeqeq
  if (value == null) return true;

  // Check for boolean false
  if (typeof value === 'boolean') return !value;

  // Check for empty string
  if (typeof value === 'string' && value.trim() === '') return true;

  // Check for empty array
  if (Array.isArray(value) && value.length === 0) return true;

  // Check for empty object
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;

  // Check for numbers (NaN is considered empty)
  if (typeof value === 'number' && isNaN(value)) return true;

  // For other cases (e.g., valid numbers, non-empty strings, etc.), return false
  return false;
}

export const objectToFormData = (
  obj,
  form,
  namespace,
  visited = new WeakSet()
) => {
  const fd = form || new FormData();
  let formKey;

  if (visited.has(obj)) {
    throw new Error('Circular reference detected');
  }
  visited.add(obj);

  for (const property in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(property)) {
      if (namespace) {
        formKey = `${namespace}[${property}]`;
      } else {
        formKey = property;
      }

      const value = obj[property];

      if (value === null || value === undefined) {
        // Skip null or undefined values
        continue;
      }

      if (typeof value === 'object' && !(value instanceof File)) {
        if (value instanceof Date) {
          fd.append(formKey, value.toISOString());
        } else {
          objectToFormData(value, fd, formKey, visited);
        }
      } else {
        fd.append(formKey, value); // Correctly append files here
      }
    }
  }

  return fd;
};

export const getDateTime = (dateTime) => {
  const d = new Date(dateTime);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();
  let hours = d.getHours();
  let minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours || 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const time = `${hours}:${minutes} ${ampm}`;

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  const formatedDateTime = `${month}-${day}-${year} ${time}`;

  return formatedDateTime;
};

export const formatAmount = (amount) => {
  if (amount >= 1000000) {
    // Format in millions (1m)
    return truncateDecimals(amount / 1000000, 3) + 'M';
  } else if (amount >= 1000) {
    // Format in thousands (1k)
    return truncateDecimals(amount / 1000, 3) + 'K';
  } else {
    // Return the amount as is (no formatting needed)
    return truncateDecimals(amount, 3);
  }
};

export const dateFormatter = (
  dateString,
  options = { format: 'YYYY-MM-DD' },
  locale = 'en-US'
) => {
  if (!dateString) return 'Invalid date';

  const date = new Date(dateString);
  if (isNaN(date)) return 'Invalid date';

  const formatDate = (format) => {
    const parts = {
      YYYY: date.getFullYear(),
      MM: String(date.getMonth() + 1).padStart(2, '0'),
      DD: String(date.getDate()).padStart(2, '0'),
      HH: String(date.getHours()).padStart(2, '0'),
      mm: String(date.getMinutes()).padStart(2, '0'),
      ss: String(date.getSeconds()).padStart(2, '0'),
    };

    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => parts[match]);
  };

  return options.format
    ? formatDate(options.format)
    : new Intl.DateTimeFormat(locale, options).format(date);
};

export const truncateDecimals = (number, digits) => {
  if (isNaN(number)) return 0;
  const factor = 10 ** digits;
  return Math.trunc(number * factor) / factor;
};
