"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import InputField from "../InputField";
import Image from "next/image";

const resultSchema = z.object({
    username: z.string()
        .min(3, { message: "Username must be atleast 3 characters long!" })
        .max(10, { message: "Username must be maximium of 10 characters long!" }),

    email: z.string().email({ message: "Invalid email!" }),
    password: z.string().min(8, { message: "Password must be atleast 8 characters long!" }),
    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
    phone: z.number().min(10, { message: "Phone No. is required" }),
    address: z.string().min(1, { message: "Address is required" }),
    bloodType: z.string().min(1, { message: "Blood Type is required" }),
    birthday: z.date({ message: "Birthday is required" }),
    sex: z.enum(["male", "female"], { message: "Sex is required" }),
    img: z.instanceof(File, { message: "Image is required" })
})

type Inputs = z.infer<typeof resultSchema>

interface ResultFormProps {
    type: "create" | "update";
    data?: any;
}

const ResultForm = ({ type, data }: ResultFormProps) => {

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
        resolver: zodResolver(resultSchema)
    })

    const onSubmit = handleSubmit(data => {
        console.log(data.username);

    })

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">Create a New Result</h1>
            <span className="text-xs text-stone-400 font-medium">Authentication Information</span>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField label="Username" name="username" defaultValue={data?.username} register={register} error={errors.username} />
                <InputField label="Email" name="email" type="email" defaultValue={data?.email} register={register} error={errors.email} />
                <InputField label="Password" name="password" type="password" defaultValue={data?.password} register={register} error={errors.password} />
            </div>

            <span className="text-xs text-stone-400 font-medium">Personal Information</span>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField label="First Name" name="firstName" defaultValue={data?.firstName} register={register} error={errors.firstName} />
                <InputField label="Last Name" name="lastName" defaultValue={data?.lastName} register={register} error={errors.lastName} />
                <InputField label="Phone" name="phone" defaultValue={data?.phone} register={register} error={errors.phone} />
                <InputField label="Address" name="address" defaultValue={data?.address} register={register} error={errors.address} />
                <InputField label="Blood Type" name="bloodType" defaultValue={data?.bloodType} register={register} error={errors.bloodType} />
                <InputField label="BirthDay" name="birthday" type="Date" defaultValue={data?.birthday} register={register} error={errors.birthday} />


                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-sm text-gray-400">Sex: </label>
                    <select className="ring-[1.5px] ring-blue-300 p-2 rounded-md text-sm w-full" {...register("sex")} defaultValue={data?.sex}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {errors.sex?.message && <p className="text-red-500">{errors.sex?.message.toString()}</p>}
                </div>

                <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
                    <label htmlFor="img" className="text-sm text-gray-400 flex items-center gap-2 cursor-pointer">
                        <Image src='/upload.png' alt="" width={30} height={30} />
                        <span>Upload a Photo</span>
                    </label>
                    <input id="img" type="file" {...register("img")} className="hidden" />
                    {errors.img?.message && <p className="text-red-500">{errors.img?.message.toString()}</p>}
                </div>
            </div>

            <button className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-600">{type === "create" ? "Create" : "Update Changes"}</button>
        </form>
    )
}

export default ResultForm
