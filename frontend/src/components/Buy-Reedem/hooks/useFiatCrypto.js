'use client';

import { getAccountsAdd, getWithdrawlAccounts } from '@/services/getRequests';
import { WithdrawPayment } from '@/services/postRequest';
import { useStateContext } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const useFiatCrypto = () => {
    const { t } = useTranslation();
    const { router } = useRouter();
    const [isKycVerified, setIsKycVerified] = useState(false);
    const [accounts, setAccounts] = useState('');
    const [iframeUrl, setIFrameUrl] = useState('');
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [errors, setErrors] = useState('');
    const [redeemableBalance, setRedeemableBalance] = useState('');
    const [isRequested, setIsRequested] = useState(false);

    const { control, handleSubmit, formState: { isValid } } = useForm({
        mode: 'onChange',
    });

    const [toastState, setToastState] = useState({
        showToast: false,
        message: '',
        status: '',
    });
    const { showToast, message, status } = toastState;

    const {
        state: { user },
    } = useStateContext();

    useEffect(() => {
        if (user?.userWallet) {
            const wallet = user?.userWallet?.find(
                (data) => data?.currencyCode === 'RSC'
            );
            setRedeemableBalance(wallet?.balance);
        }
    }, [user?.userWallet]);

    useEffect(() => {
        if (user?.userDetails?.coinflowKycStatus === 'SUCCESS') {
            setIsKycVerified(true);
        }
    }, [user?.userDetails?.coinflowKycStatus]);

    const handleGetAccounts = async () => {
        try {
            const response = await getWithdrawlAccounts({ paymentType: 'ACH' });
            setAccounts(response?.data?.data);
        }
        catch (error) {
            console.error('error in fetching data', error);
        }
    };

    const handleAddAccounts = async () => {
        try {
            const response = await getAccountsAdd();
            setIFrameUrl(response?.data?.iframeUrl);
        }
        catch (error) {
            console.error('error in opening iframe', error);
        }
    };

    useEffect(() => {
        if (iframeUrl) {
            const width = 800;
            const height = 600;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;

            window.open(
                iframeUrl,
                '_blank',
                `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`
            );
        }
    }, [iframeUrl]);


    const handleAccountChange = async (e) => {
        const accountId = e.target.value;
        setSelectedAccount(accountId);
        // setWithdrawAmount('');
        setErrors('');
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;

        if (!value) {
            setErrors('Amount is required.');
        } else if (isNaN(value)) {
            setErrors('Amount must be a number.');
        } else if (parseFloat(value) <= 0) {
            setErrors('Amount must be greater than 0.');
        } else {
            setErrors('');
        }
    };

    const handleWithdrawlAmount = async (data) => {
        const response = await WithdrawPayment({
            'amount': Number(data.redeemamount),
            'paymentProvider': 'CoinFlow',
            'address': selectedAccount,
            'currency': 'USD'
        });

        if (response?.data?.success) {
            setIsRequested(true);
            setToastState({
                showToast: true,
                message: response?.data?.message || 'Withdrawal Requested successfully',
                status: 'success',
            });
        }
        else {
            setToastState({
                showToast: true,
                message: response?.errors?.message || 'Something went wrong.',
                status: 'error',
            });
        }
    };

    return {
        t,
        router,
        isKycVerified,
        handleGetAccounts,
        accounts,
        handleAddAccounts,
        selectedAccount,
        errors,
        handleAccountChange,
        handleAmountChange,
        handleWithdrawlAmount,
        showToast,
        message,
        status,
        setToastState,
        control,
        handleSubmit,
        redeemableBalance,
        isValid,
        isRequested,

    };
};

export default useFiatCrypto;