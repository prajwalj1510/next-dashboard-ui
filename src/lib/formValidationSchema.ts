import z from "zod";

export const subjectSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string()
        .min(1, { message: "Subject name is must!" }),
    teachers: z.array(z.string())
})

export type SubjectSchema = z.infer<typeof subjectSchema>


export const classSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string()
        .min(1, { message: "Class name is must!" }),
    capacity: z.coerce.number().min(1,"Required"),
    gradeId: z.coerce.number().min(1,"required"),
    supervisorId: z.coerce.string().optional()
})

export type ClassSchema = z.infer<typeof classSchema>

export const teacherSchema = z.object({
    id: z.string().optional(),
    username: z.string()
        .min(3, { message: "Username must be atleast 3 characters long!" })
        .max(10, { message: "Username must be maximium of 10 characters long!" }),

    email: z.string().email({ message: "Invalid email!" }).optional().or(z.literal("")),
    password: z.string().min(8, { message: "Password must be atleast 8 characters long!" }).optional().or(z.literal("")),
    name: z.string().min(1, { message: "First Name is required" }),
    surname: z.string().min(1, { message: "Sur Name is required" }),
    phone: z.string().optional(),
    address: z.string(),
    bloodType: z.string().min(1, { message: "Blood Type is required" }),
    birthday: z.coerce.date({ message: "Birthday is required" }),
    sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
    img: z.string().optional(),
    subject: z.array(z.string()).optional(),
})

export type TeacherSchema = z.infer<typeof teacherSchema>

export const studentSchema = z.object({
    id: z.string().optional(),
    username: z.string()
        .min(3, { message: "Username must be atleast 3 characters long!" })
        .max(10, { message: "Username must be maximium of 10 characters long!" }),

    email: z.string().email({ message: "Invalid email!" }).optional().or(z.literal("")),
    password: z.string().min(8, { message: "Password must be atleast 8 characters long!" }).optional().or(z.literal("")),
    name: z.string().min(1, { message: "First Name is required" }),
    surname: z.string().min(1, { message: "Sur Name is required" }),
    phone: z.string().optional(),
    address: z.string(),
    bloodType: z.string().min(1, { message: "Blood Type is required" }),
    birthday: z.coerce.date({ message: "Birthday is required" }),
    sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
    img: z.string().optional(),
    gradeId: z.coerce.number().min(1,"Grade is Required"),
    classId: z.coerce.number().min(1,"Class Id is Required"),
    parentId: z.string().min(1,"Parent Id is Required"),

})

export type StudentSchema = z.infer<typeof studentSchema>

export const examSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string()
        .min(1, { message: "Exam name is must!" }),
    startTime: z.coerce.date({message: "Start Time is required"}),
    endTime: z.coerce.date({message: "End Time is required"}),
    lessonId: z.coerce.number({message: "Lesson is required"}),
})

export type ExamSchema = z.infer<typeof examSchema>