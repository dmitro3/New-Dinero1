import useGetUserDeatil from '@/common/hook/useGetUserDeatil';
import { getStates } from '@/services/getRequests';
import { updateUser } from '@/services/putReguest';
import { useStateContext } from '@/store';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BASIC_INFO_FORM_CONTROLS } from '../constant';
const BasicInformation = () => {
  const {
    state: { user },
  } = useStateContext();
  const { control, handleSubmit, reset, setValue } = useForm({
    mode: 'onChange',
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      dateOfBirth: user?.dateOfBirth || '',
      stateCode: user?.State?.stateCode || '', 
    },
  });

  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('success');
  const [loading, setLoading] = useState(false);
  const { getUser } = useGetUserDeatil();
  const [stateData, setStateData] = useState([]);
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      
      await updateUser(data);
      setMessage('Profile Update Successfully');
      setShowToast(true);
      setStatus('success');
      reset();
      getUser();
    } catch (error) {
      setMessage(error?.message || 'Something went wrong');
      setShowToast(true);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };
  const fetchStates = async () => {
    try {
      const res = await getStates();
      setStateData(res?.data?.states || []);
    } catch (error) {
      console.log(error?.message);
    }
  };
  const formatedStateData = stateData.map((item) => ({
    label: item.name,
    value: item.stateCode,
  }));
  useEffect(() => {
    fetchStates();
  }, []);
  useEffect(() => {
    if (user) {
      setValue('firstName', user?.firstName);
      setValue('lastName', user?.lastName);
      setValue('dateOfBirth', user?.dateOfBirth);
      setValue('stateCode', user?.State?.stateCode || ''); 
      setValue('zip',user?.userDetails?.zip);
      setValue('address',user?.userDetails?.address);
      setValue('city',user?.city);
    }
  }, [user, setValue]);

  return {
    control,
    handleSubmit,
    onSubmit,
    controls: BASIC_INFO_FORM_CONTROLS,
    userName: user?.username || '',
    showToast,
    setShowToast,
    message,
    status,
    loading,
    formatedStateData,
  };
};
export default BasicInformation;

