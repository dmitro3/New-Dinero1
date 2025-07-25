import { updateUser } from '@/services/putReguest';
import { useForm } from 'react-hook-form';

const useUpdateUser = () => {
    const { control, handleSubmit } = useForm({
        mode: 'onBlur',
    });
    const onSubmit = async (data) => {
        
        try {
            const response = await updateUser(data);
            console.log('resr',response);
            
            
          } 
          // catch (apiError) {
          //   setError(apiError.message || 'Something went wrong!');
          // } 
          finally {
            // setLoading(false);
          }
    };
    return { control, handleSubmit, onSubmit };
};

export default useUpdateUser;