'use client';
import CustomTableCard from '@/common/components/custom-table';
import React from 'react';
import { TABLE_CONFIG } from '../../constants';
import useTransactionColList from '../../hooks/useTransactionColList';

const Vault = () => {
  const { buyData } = useTransactionColList();
  return (
    <div className="mt-2">
      <CustomTableCard data={buyData} controls={TABLE_CONFIG} />
    </div>
  );
};

export default Vault;
