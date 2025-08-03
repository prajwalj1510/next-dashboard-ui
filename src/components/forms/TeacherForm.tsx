"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { teacherSchema, TeacherSchema } from "@/lib/formValidationSchema";
import { useFormState } from "react-dom";
import { createTeacher, updateTeacher } from "@/lib/serverActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { CldUploadWidget } from 'next-cloudinary';


interface TeacherFormProps {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any,
}

const TeacherForm = ({ type, data, setOpen, relatedData }: TeacherFormProps) => {

    const { register, handleSubmit, formState: { errors } } = useForm<TeacherSchema>({
        resolver: zodResolver(teacherSchema)
    })

    const [img, setImg] = useState<any>()

    const [state, formAction] = useFormState(type === "create" ? createTeacher : updateTeacher, {
        success: false,
        error: false,
    })

    const onSubmit = handleSubmit(data => {
        console.log(data.name, 'in subject form');
        // createSubject(data)
        formAction({...data, img: img?.secure_url})
    })

    const router = useRouter()

    useEffect(() => {

        if (state.success) {
            toast.success(`${type === "create" ? "Teacher Created" : "Teacher Updated!"}`)
            setOpen(false)
            router.refresh()
        }

    }, [state, router, type, setOpen])

    const { subjects } = relatedData

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a New Teacher" : "Update the exisiting Teacher"}</h1>
            <span className="text-xs text-stone-400 font-medium">Authentication Information</span>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField label="Username" name="username" defaultValue={data?.username} register={register} error={errors.username} />
                <InputField label="Email" name="email" type="email" defaultValue={data?.email} register={register} error={errors.email} />
                <InputField label="Password" name="password" type="password" defaultValue={data?.password} register={register} error={errors.password} />
            </div>

            <span className="text-xs text-stone-400 font-medium">Personal Information</span>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField label="Name" name="name" defaultValue={data?.name} register={register} error={errors.name} />
                <InputField label="Surname" name="surname" defaultValue={data?.surname} register={register} error={errors.surname} />
                <InputField label="Phone" name="phone" defaultValue={data?.phone} register={register} error={errors.phone} />
                <InputField label="Address" name="address" defaultValue={data?.address} register={register} error={errors.address} />
                <InputField label="Blood Type" name="bloodType" defaultValue={data?.bloodType} register={register} error={errors.bloodType} />
                <InputField label="BirthDay" name="birthday" type="Date" defaultValue={data?.birthday.toISOString().split("T")[0]} register={register} error={errors.birthday} />
                {data && (
                    <InputField 
                        label="id"
                        name="id"
                        defaultValue={data?.id}
                        register={register}
                        error={errors?.id}
                        hidden
                    />
                )}


                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-sm text-gray-400">Sex: </label>
                    <select className="ring-[1.5px] ring-blue-300 p-2 rounded-md text-sm w-full" {...register("sex")} defaultValue={data?.sex}>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                    {errors.sex?.message && <p className="text-red-500">{errors.sex?.message.toString()}</p>}
                </div>

                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-sm text-gray-400">Subjects </label>
                    <select multiple className="ring-[1.5px] ring-blue-300 p-2 rounded-md text-sm w-full" {...register("subject")} defaultValue={data?.subject}>
                        {subjects.map((subject: { id: number, name: string }) => (
                            <option key={subject.id} value={subject.id}>{subject.name}</option>
                        ))}
                    </select>
                    {errors.subject?.message && <p className="text-red-500">{errors.subject?.message.toString()}</p>}
                </div>

                {/* <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
                    <label htmlFor="img" className="text-sm text-gray-400 flex items-center gap-2 cursor-pointer">
                        <Image src='/upload.png' alt="" width={30} height={30} />
                        <span>Upload a Photo</span>
                    </label>
                    <input id="img" type="file" {...register("img")} className="hidden" />
                    {errors.img?.message && <p className="text-red-500">{errors.img?.message.toString()}</p>}
                </div> */}

                <CldUploadWidget uploadPreset="school" onSuccess={(result, {widget}) => {
                    setImg(result.info)
                    widget.close()
                    console.log(result)} }>
                    {({ open }) => {
                        return (
                            <div onClick={()=> open()} className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer">
                                <Image src='/upload.png' alt="" width={30} height={30} />
                                <span>Upload a Photo</span>
                            </div>
                        );
                    }}
                </CldUploadWidget>

            </div>
            {state.error && (
                <span className="text-red-500 text-xs">Something went wrong!</span>
            )}

            <button className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-600">{type === "create" ? "Create" : "Update Changes"}</button>
        </form>
    )
}

export default TeacherForm
