"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { classSchema, ClassSchema, subjectSchema, SubjectSchema } from "@/lib/formValidationSchema";
import { createClass, createSubject, updateClass, updateSubject } from "@/lib/serverActions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


interface ClassFormProps {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any
}

const ClassForm = ({ type, data, setOpen, relatedData }: ClassFormProps) => {

    const { register, handleSubmit, formState: { errors } } = useForm<ClassSchema>({
        resolver: zodResolver(classSchema)
    })

    const [state, formAction] = useFormState(type === "create" ? createClass : updateClass, {
        success: false,
        error: false,
    })

    const onSubmit = handleSubmit(data => {
        console.log(data.name, 'in class form');
        // createSubject(data)
        formAction(data)
    })

    const router = useRouter()

    useEffect(() => {

        if (state.success) {
            toast.success(`${type === "create" ? "Class Created" : "Class Updated!"}`)
            setOpen(false)
            router.refresh()
        }

    }, [state])

    const { teachers, grades } = relatedData

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a New Class!" : "Update the existing Class"}</h1>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField label="Class Name" name="name" defaultValue={data?.name} register={register} error={errors.name} />

                <InputField label="Capacity" name="capacity" defaultValue={data?.capacity} register={register} error={errors.capacity} />

                {data && (
                    <InputField label="Id" name="id" defaultValue={data?.id} register={register} error={errors.id} hidden />
                )}

                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-sm text-gray-400">Supervisors </label>
                    <select className="ring-[1.5px] ring-blue-300 p-2 rounded-md text-sm w-full" {...register("supervisorId")} defaultValue={data?.teachers}>
                        {relatedData?.teachers.map((teacher: { id: string, name: string, surname: string }) => (
                            <option value={teacher.id} key={teacher.id} selected={data && teacher.id === data.supervisorId}>{teacher.name + " " + teacher.surname}</option>
                        ))}
                    </select>
                    {errors.supervisorId?.message && <p className="text-red-500">{errors.supervisorId?.message.toString()}</p>}
                </div>

                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-sm text-gray-400">Grade </label>
                    <select className="ring-[1.5px] ring-blue-300 p-2 rounded-md text-sm w-full" {...register("gradeId")} defaultValue={data?.gradeId}>
                        {relatedData?.grades.map((grade: { id: number, level: number }) => (
                            <option value={grade.id} key={grade.id} selected={data && grade.id === data.gradeId}>{grade.level}</option>
                        ))}
                    </select>
                    {errors.gradeId?.message && <p className="text-red-500">{errors.gradeId?.message.toString()}</p>}
                </div>

            </div>

            {state.error && <span className="text-xs text-red-400">Something went wrong! in Subject form</span>}

            <button className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-600">{type === "create" ? "Create" : "Update Changes"}</button>
        </form>
    )
}

export default ClassForm
