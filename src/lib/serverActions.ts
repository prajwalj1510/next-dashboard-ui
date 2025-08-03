"use server"
import { revalidatePath } from "next/cache";
import { ClassSchema, ExamSchema, StudentSchema, SubjectSchema, TeacherSchema } from "./formValidationSchema";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { getUserRole } from "./getUserRole";

const { Role, userId } = getUserRole()

export const createSubject = async (
    currentState: { success: boolean, error: boolean },
    data: SubjectSchema,
) => {
    // console.log(data,'in server actions');
    try {

        await prisma.subject.create({
            data: {
                name: data.name,
                teachers: {
                    connect: data.teachers.map(teacherId => ({ id: teacherId }))
                }
            }
        })

        // revalidatePath("/list/subjects")
        return { success: true, error: false }
    } catch (error) {
        console.log("error in createSubject serverActions", error);
        return { success: false, error: true }
    }
}

export const updateSubject = async (
    currentState: { success: boolean, error: boolean },
    data: SubjectSchema,
) => {
    // console.log(data,'in server actions');
    try {

        await prisma.subject.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                teachers: {
                    set: data.teachers.map(teacherId => ({ id: teacherId }))
                }
            }
        })

        // revalidatePath("/list/subjects")
        return { success: true, error: false }
    } catch (error) {
        console.log("error in createSubject serverActions", error);
        return { success: false, error: true }
    }
}

export const deleteSubject = async (
    currentState: { success: boolean, error: boolean },
    data: FormData,
) => {
    // console.log(data,'in server actions');
    const id = data.get("id") as string
    try {

        await prisma.subject.delete({
            where: {
                id: parseInt(id),
            },
        })

        // revalidatePath("/list/subjects")
        return { success: true, error: false }
    } catch (error) {
        console.log("error in createSubject serverActions", error);
        return { success: false, error: true }
    }
}


export const createClass = async (
    currentState: { success: boolean, error: boolean },
    data: ClassSchema,
) => {
    // console.log(data,'in server actions');
    try {

        await prisma.class.create({
            data
        })

        // revalidatePath("/list/classes")
        return { success: true, error: false }
    } catch (error) {
        console.log("error in createSubject serverActions", error);
        return { success: false, error: true }
    }
}

export const updateClass = async (
    currentState: { success: boolean, error: boolean },
    data: ClassSchema,
) => {
    // console.log(data,'in server actions');
    try {

        await prisma.class.update({
            where: {
                id: data.id,
            },
            data
        })

        // revalidatePath("/list/classes")
        return { success: true, error: false }
    } catch (error) {
        console.log("error in createSubject serverActions", error);
        return { success: false, error: true }
    }
}

export const deleteClass = async (
    currentState: { success: boolean, error: boolean },
    data: FormData,
) => {
    // console.log(data,'in server actions');
    const id = data.get("id") as string
    try {

        await prisma.class.delete({
            where: {
                id: parseInt(id),
            },
        })

        // revalidatePath("/list/classes")
        return { success: true, error: false }
    } catch (error) {
        console.log("error in createSubject serverActions", error);
        return { success: false, error: true }
    }
}

export const createTeacher = async (
    currentState: { success: boolean, error: boolean },
    data: TeacherSchema,
) => {
    // console.log(data,'in server actions');
    try {

        const user = await clerkClient().users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "teacher" },
        })

        await prisma.teacher.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                img: data.img,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                subjects: {
                    connect: data.subject?.map((subjectId: string) => ({
                        id: parseInt(subjectId)
                    }))
                }

            }
        })

        // revalidatePath("/list/teachers")
        return { success: true, error: false }
    } catch (error) {
        console.log("error in createSubject serverActions", error);
        return { success: false, error: true }
    }
}

export const updateTeacher = async (
    currentState: { success: boolean, error: boolean },
    data: TeacherSchema,
) => {
    // console.log(data,'in server actions');

    if (!data.id) {
        return { success: false, error: true }
    }

    try {

        const user = await clerkClient().users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
            // publicMetadata: {role: "teacher"},
        })

        await prisma.teacher.update({
            where: { id: data.id },
            data: {
                ...(data.password !== "" && { password: data.password }),
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                img: data.img,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                subjects: {
                    set: data.subject?.map((subjectId: string) => ({
                        id: parseInt(subjectId)
                    }))
                }

            }
        })

        // revalidatePath("/list/classes")
        return { success: true, error: false }
    } catch (error) {
        console.log("error in createSubject serverActions", error);
        return { success: false, error: true }
    }
}

export const deleteTeacher = async (
    currentState: { success: boolean, error: boolean },
    data: FormData,
) => {
    // console.log(data,'in server actions');
    const id = data.get("id") as string
    try {

        await clerkClient().users.deleteUser(id)

        await prisma.teacher.delete({
            where: {
                id: id,
            },
        })

        // revalidatePath("/list/classes")
        return { success: true, error: false }
    } catch (error) {
        console.log("error in createSubject serverActions", error);
        return { success: false, error: true }
    }
}

export const createStudent = async (
    currentState: { success: boolean, error: boolean },
    data: StudentSchema,
) => {
    // console.log(data,'in server actions');
    try {

        const classItem = await prisma.class.findUnique({
            where: { id: data.classId },
            include: {
                _count: {
                    select: { students: true }
                }
            }
        })

        if (classItem && classItem.capacity === classItem._count.students) {
            return { success: false, error: true }
        }

        const user = await clerkClient().users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "student" },
        })

        await prisma.student.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                img: data.img,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                gradeId: data.gradeId,
                classId: data.classId,
                parentId: data.parentId,
            }
        })

        // revalidatePath("/list/teachers")
        return { success: true, error: false }
    } catch (error) {
        console.log("error in createSubject serverActions", error);
        return { success: false, error: true }
    }
}

export const updateStudent = async (
    currentState: { success: boolean, error: boolean },
    data: StudentSchema,
) => {
    // console.log(data,'in server actions');

    if (!data.id) {
        return { success: false, error: true }
    }

    try {

        const user = await clerkClient().users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
            // publicMetadata: {role: "teacher"},
        })

        await prisma.student.update({
            where: { id: data.id },
            data: {
                ...(data.password !== "" && { password: data.password }),
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                img: data.img,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                gradeId: data.gradeId,
                classId: data.classId,
                parentId: data.parentId,
            }
        })

        // revalidatePath("/list/classes")
        return { success: true, error: false }
    } catch (error) {
        console.log("error in createSubject serverActions", error);
        return { success: false, error: true }
    }
}

export const deleteStudent = async (
    currentState: { success: boolean, error: boolean },
    data: FormData,
) => {
    // console.log(data,'in server actions');
    const id = data.get("id") as string
    try {

        await clerkClient().users.deleteUser(id)

        await prisma.student.delete({
            where: {
                id: id,
            },
        })

        // revalidatePath("/list/classes")
        return { success: true, error: false }
    } catch (error) {
        console.log("error in createSubject serverActions", error);
        return { success: false, error: true }
    }
}

export const createExam = async (
    currentState: { success: boolean, error: boolean },
    data: ExamSchema,
) => {
    // console.log(data,'in server actions');
    try {

        if (Role === 'teacher') {
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId!,
                    id: data.lessonId,
                }
            })

            if (!teacherLesson) {
                return { success: false, error: true }
            }
        }

        await prisma.exam.create({
            data: {
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                lessonId: data.lessonId,
            }
        })

        // revalidatePath("/list/teachers")
        return { success: true, error: false }
    } catch (error) {
        console.log("error in createSubject serverActions", error);
        return { success: false, error: true }
    }
}

export const updateExam = async (
    currentState: { success: boolean, error: boolean },
    data: ExamSchema,
) => {
    // console.log(data,'in server actions');
    try {

        if (Role === 'teacher') {
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId!,
                    id: data.lessonId,
                }
            })

            if (!teacherLesson) {
                return { success: false, error: true }
            }
        }

        await prisma.exam.update({
            where: {id: data.id},
            data: {
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                lessonId: data.lessonId,
            }
        })

        // revalidatePath("/list/classes")
        return { success: true, error: false }
    } catch (error) {
        console.log("error in createSubject serverActions", error);
        return { success: false, error: true }
    }
}

export const deleteExam = async (
    currentState: { success: boolean, error: boolean },
    data: FormData,
) => {
    // console.log(data,'in server actions');
    const id = data.get("id") as string
    try {

        await prisma.exam.delete({
            where: {
                id: parseInt(id),
                ...(Role === 'teacher' ? { lesson: { teacherId: userId! } } : {}),
            },
        })

        // revalidatePath("/list/classes")
        return { success: true, error: false }
    } catch (error) {
        console.log("error in createSubject serverActions", error);
        return { success: false, error: true }
    }
}