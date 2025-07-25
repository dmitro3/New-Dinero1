'use client';
import { useState, useEffect } from 'react';

export function useBankDetails() {
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBankDetails() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/get_bank_details'); 
        const data = await res.json();

        if (res.ok) {
          setBankDetails(data);
        } else {
          setError(data.error || 'Failed to load bank details');
        }
      } catch {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    }

    fetchBankDetails();
  }, []);

  return { bankDetails, loading, error };
}
