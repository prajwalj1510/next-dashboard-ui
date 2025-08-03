"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect } from "react";
import { examSchema, ExamSchema } from "@/lib/formValidationSchema";
import { useFormState } from "react-dom";
import { createExam, updateExam } from "@/lib/serverActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


interface ExamFormProps {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
}

const ExamForm = ({ type, data, setOpen, relatedData }: ExamFormProps) => {

    const { register, handleSubmit, formState: { errors } } = useForm<ExamSchema>({
        resolver: zodResolver(examSchema)
    })

    const [state, formAction] = useFormState(type === "create" ? createExam : updateExam, {
        success: false,
        error: false,
    })

    const onSubmit = handleSubmit(data => {
        console.log(data.title, 'in subject form');
        // createSubject(data)
        formAction(data)
    })

    const router = useRouter()

    useEffect(() => {

        if (state.success) {
            toast.success(`${type === "create" ? "Exam Created" : "Exam Updated!"}`)
            setOpen(false)
            router.refresh()
        }

    }, [state])

    const { lessons } = relatedData

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === 'create' ? "Create a New Exam":"Update the existing Exam!"}</h1>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField label="Exam Title" name="title" defaultValue={data?.title} register={register} error={errors.title} />

                <InputField label="Start Date" name="startTime" defaultValue={data?.startTime} register={register} error={errors.startTime} type="datetime-local" />

                <InputField label="End Date" name="endTime" defaultValue={data?.endTime} register={register} error={errors.endTime} type="datetime-local" />

                {data && (
                    <InputField label="Id" name="id" defaultValue={data?.id} register={register} error={errors.id} hidden />
                )}

                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-sm text-gray-400">Lessons </label>
                    <select className="ring-[1.5px] ring-blue-300 p-2 rounded-md text-sm w-full" {...register("lessonId")} defaultValue={data?.lessonId}>
                        {lessons.map((lesson: {id:number, name: string})=> (
                            <option value={lesson.id} key={lesson.id}>{lesson.name}</option>
                        ))}
                    </select>
                    {errors.lessonId?.message && <p className="text-red-500">{errors.lessonId?.message.toString()}</p>}
                </div>

            </div>

            {state.error && <span className="text-xs text-red-400">Something went wrong! in Exam form</span>}

            <button className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-600">{type === "create" ? "Create" : "Update Changes"}</button>
        </form>
    )
}

export default ExamForm
