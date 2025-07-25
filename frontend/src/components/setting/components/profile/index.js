import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CustomToast from '@/common/components/custom-toaster';
import { ELEMENT } from '@/common/form-control';
import { Controller } from 'react-hook-form';
import useBasicInformation from '../../hooks/useBasicInformation';
const Profile = () => {
  const {
    control,
    handleSubmit,
    onSubmit,
    controls,
    userName,
    message,
    setShowToast,
    showToast,
    status,
    loading,
    formatedStateData,
  } = useBasicInformation();

  return (
    <section className="border border-[rgb(var(--lb-blue-300))] rounded p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="text-[rgb(var(--lb-blue-250))] text-[13px] mb-2">
          (The username and email are the only credentials for login)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {controls?.map((item) => {
            const Component = ELEMENT[item?.type];
            const isCheckbox = item.type === 'checkbox';
            const isSelect = item.type === 'select';
            const { pattern, required, options } = item;

            if (item.name === 'username') {
              return (
                <div key="dynamic-username">
                  <label className="text-white text-[14px] font-bold mb-1">
                    User Name
                  </label>
                  <Input
                    value={userName}
                    disabled
                    className="border-[rgb(var(--lb-blue-200))] bg-transparent text-white focus:ring-0  w-full sm:max-w-[70%] md:max-w-[100%]"
                  />
                </div>
              );
            }

            return (
              <Controller
                key={item.name}
                control={control}
                name={item.name}
                rules={{ 
                  pattern, required, 
                  validate : item.validate,

                 }}
                render={({ field, fieldState }) => {
                  const error = fieldState?.error;
                  return (
                    <div>
                      {!isCheckbox && (
                        <label className="text-white text-[14px] font-bold mb-1">
                          {item.label}
                        </label>
                      )}
                      <div>
                        {isCheckbox ? (
                          <Component
                            placeholder={item.placeholder}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            {...field}
                            className={`${
                              error ? 'border-red-500' : ''
                            } bg-transparent focus:ring-0 text-white`}
                          />
                        ) : isSelect ? (
                          <Component
                            options={formatedStateData}
                            selectedValue={field.value}
                            onValueChange={field.onChange}
                            {...field}
                            contentClassName="h-[280px]"
                            className={`${
                              error ? 'border-red-500' : ''
                            } border-[rgb(var(--lb-blue-200))] text-white bg-transparent focus:ring-0 w-full sm:max-w-[70%] md:max-w-[100%]`}
                          />
                        ) : (
                          <Component
                            placeholder={item.placeholder}
                            {...field}
                            className={`${
                              error ? 'border-red-500' : ''
                            } border-[rgb(var(--lb-blue-200))] text-white bg-transparent focus:ring-0 w-full sm:max-w-[70%] md:max-w-[100%]`}
                            {...(item.type === 'select' && { options })}
                          />
                        )}
                      </div>
                      {error && (
                        <div className="text-red-500 text-sm mt-1">
                          {error?.message}
                        </div>
                      )}
                    </div>
                  );
                }}
              />
            );
          })}
        </div>

        <div className="border-t border-[rgb(var(--lb-blue-300))] mt-4 w-full p-4 flex gap-2 justify-between">
          <div className="text-[rgb(var(--lb-blue-250))] text-[13px]">
            All data is safely stored and encrypted.
          </div>
          <Button
            loading={loading}
            disabled={loading}
            type="submit"
            className="bg-green-500 py-2  text-white rounded hover:bg-green-600"
          >
            Update
          </Button>
        </div>
      </form>
      <CustomToast
        message={message}
        setShowToast={setShowToast}
        showToast={showToast}
        status={status}
      />
    </section>
  );
};
export default Profile;
