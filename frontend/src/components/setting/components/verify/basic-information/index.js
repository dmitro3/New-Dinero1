'use client';
import { Controller } from 'react-hook-form';
import useBasicInformation from '../../../hooks/useBasicInformation';
import { ELEMENT } from '@/common/form-control';
import { Button } from '@/components/ui/button';
const BasicInformation = () => {
    const { control, handleSubmit, onSubmit, controls } = useBasicInformation();
    return <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 h-full  m-3  border border-[rgb(var(--lb-blue-300))] rounded w-[450px]"
    >
        <div className="p-3 flex flex-row flex-wrap gap-4 ">
            {controls?.map((item) => {
                const Component = ELEMENT[item?.type];
                const isCheckbox = item.type === 'checkbox';

                const { pattern, required } = item || {};

                return (
                    <Controller
                        key={item.name}
                        control={control}
                        name={item.name}
                        rules={{ pattern, required }}
                        render={({ field, fieldState }) => {
                            const error = fieldState?.error;
                            return (
                                <div>
                                    {!isCheckbox && (
                                        <label className="text-blue-100 tw-font-bold">{item.label}</label>
                                    )}
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className={`${error ? 'border-red-500' : 'border-gray-300'} transition-colors duration-200 ${!isCheckbox ? `w-[${item?.width}]` : 'w-8 h-8'}`}
                                        >
                                            {isCheckbox ? (
                                                <Component placeholder={item.placeholder} checked={field.value} onCheckedChange={field.onChange} {...field} className={`${error && 'border-red-500'}`} />
                                            ) : (
                                                <Component placeholder={item.placeholder} {...field} className={`${error && 'border-red-500'}`} />
                                            )}
                                        </div>
                                        {isCheckbox && (
                                            <label className="font-size-10 text-sm text-blue-300">{item.label}</label>
                                        )}
                                    </div>
                                    {error && <div className={`text-red-500 text-sm absolute transition-opacity duration-300 ease-in-out ${error ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                                        }`}>{error?.message}</div>}
                                </div>
                            );
                        }}
                    />
                );

            })}
        </div>
        <div className="border-t border-[rgb(var(--lb-blue-300))] w-full p-4 flex justify-between">
            <div className="text-[rgb(var(--lb-blue-250))] text-[13px]">All data is safely stored and encrypted.</div>
            <Button className="bg-green-500 py-2  text-white rounded hover:bg-green-600">Submit</Button>
        </div>
    </form>;
};
export default BasicInformation;