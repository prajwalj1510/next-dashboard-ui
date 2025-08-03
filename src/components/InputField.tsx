import { FieldError } from "react-hook-form";

interface InputFieldProps {
    label: string;
    type?: string;
    register: any;
    name: string;
    defaultValue?: string;
    error?: FieldError;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    hidden?:boolean
}

const InputField = ({
    label,
    type,
    register,
    name,
    defaultValue,
    error,
    inputProps,
    hidden,
}: InputFieldProps) => {
    return (
        <div className={ hidden ? "hidden": "flex flex-col gap-2 w-full md:w-1/4"}>
            <label className="text-sm text-gray-400">{label}: </label>
            <input 
                type={type} 
                {...register(name)} 
                className="ring-[1.5px] ring-blue-300 p-2 rounded-md text-sm w-full"  
                {...inputProps}
                defaultValue={defaultValue}
            />
            {error?.message && <p className="text-red-500">{error?.message.toString()}</p>}
        </div>
    )
}

export default InputField
