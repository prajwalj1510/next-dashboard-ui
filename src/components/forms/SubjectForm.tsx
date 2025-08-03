"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { subjectSchema, SubjectSchema } from "@/lib/formValidationSchema";
import { createSubject, updateSubject } from "@/lib/serverActions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


interface SubjectFormProps {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any
}

const SubjectForm = ({ type, data, setOpen, relatedData }: SubjectFormProps) => {

    const { register, handleSubmit, formState: { errors } } = useForm<SubjectSchema>({
        resolver: zodResolver(subjectSchema)
    })

    const [state, formAction] = useFormState(type === "create" ? createSubject : updateSubject, {
        success: false,
        error: false,
    })

    const onSubmit = handleSubmit(data => {
        console.log(data.name, 'in subject form');
        // createSubject(data)
        formAction(data)
    })

    const router = useRouter()

    useEffect(() => {

        if (state.success) {
            toast.success(`${type === "create" ? "Subject Created" : "Subject Updated!"}`)
            setOpen(false)
            router.refresh()
        }

    }, [state])

    const {teachers} = relatedData 

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a New Subject!" : "Update the existing Subject"}</h1>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField label="Subject Name" name="name" defaultValue={data?.name} register={register} error={errors.name} />

                {data && (
                    <InputField label="Id" name="id" defaultValue={data?.id} register={register} error={errors.id} hidden />
                )}

                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-sm text-gray-400">Teachers </label>
                    <select multiple className="ring-[1.5px] ring-blue-300 p-2 rounded-md text-sm w-full" {...register("teachers")} defaultValue={data?.teachers}>
                        {teachers.map((teacher: {id:string, name: string, surname: string})=> (
                            <option value={teacher.id} key={teacher.id}>{teacher.name + " " + teacher.surname}</option>
                        ))}
                    </select>
                    {errors.teachers?.message && <p className="text-red-500">{errors.teachers?.message.toString()}</p>}
                </div>

            </div>

            {state.error && <span className="text-xs text-red-400">Something went wrong! in Subject form</span>}

            <button className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-600">{type === "create" ? "Create" : "Update Changes"}</button>
        </form>
    )
}

export default SubjectForm
