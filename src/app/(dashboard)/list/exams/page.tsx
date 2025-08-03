import FormContainer from '@/components/FormContainer'
import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { getUserRole } from '@/lib/getUserRole'
import prisma from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/settings'
import { Class, Exam, Prisma, Subject, Teacher } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

const {Role, userId} = getUserRole()

const columns = [
    {
        header: "Subject Name",
        accessor: "subject",
    },
    {
        header: "Class",
        accessor: "class",
    },
    {
        header: "Teacher",
        accessor: "teacher",
        className: "hidden md:table-cell",
    },
    {
        header: "Date",
        accessor: "date",
        className: "hidden md:table-cell",
    },
    ...(Role=== "admin" || Role === "teacher" ? [{
        header: "Actions",
        accessor: "actions"
    }] : [])
]

type ExamList = Exam & {
    lesson: {
        subject: Subject,
        class: Class,
        teacher: Teacher,
    }
}

const renderRow = (item: ExamList) => (
    <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-prajwalPurpleLight'>
        <td className='flex items-center gap-4 p-2'>
            {item.lesson.subject.name}
        </td>
        <td>{item.lesson.class.name}</td>
        <td className='hidden md:table-cell'>{item.lesson.teacher.name + " " + item.lesson.teacher.surname}</td>
        <td className='hidden md:table-cell'>{new Intl.DateTimeFormat("en-US").format(item.startTime)}</td>
        <td>
            <div className='flex items-center gap-2'>
                {/* <Link className='flex gap-2' href={`/list/teachers/${item.id}`}>
                        <button className='size-7 flex items-center justify-center rounded-full bg-prajwalSky'>
                            <Image src='/edit.png' alt='' width={20} height={20} />
                        </button>
                    </Link> */}
                {Role === "admin" || Role === "teacher" &&
                    // <button className='size-7 flex items-center justify-center rounded-full bg-prajwalPurple'>
                    //     <Image src='/delete.png' alt='' width={20} height={20} />
                    // </button>
                    <>
                        <FormContainer table='exam' type='update' data={item} />
                        <FormContainer table='exam' type='delete' id={item.id} />
                    </>
                }
            </div>
        </td>
    </tr>
)

const ExamListPage = async ({
    searchParams
}: { searchParams: { [key: string]: string | undefined } }) => {

    const { page, ...queryParams } = searchParams

    const currentPage = page ? parseInt(page) : 1;

    // URL PARAMS CONDITION

    const query: Prisma.ExamWhereInput = {}

    query.lesson = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "teacherId":
                        query.lesson.teacherId = value
                        break;
                    case "classId":
                        query.lesson.classId = parseInt(value)
                        break;

                    case "search":
                        query.lesson.subject = {
                            name: { contains: value, mode: "insensitive" },
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    // Role Conditions
    switch (Role) {
        case "admin":
            break;
        case 'teacher':
            query.lesson.teacherId = userId!
            break;
        case 'student':
            query.lesson.class = {
                students: {
                    some: {
                        id: userId!
                    }
                }
            }
            break;
        case 'parent':
            query.lesson.class = {
                students: {
                    some: {
                        parentId: userId!
                    }
                }
            }
            break;
        default:
            break;
    }

    // $transaction takes multiple request as shown below
    const [exams, count] = await prisma.$transaction([

        prisma.exam.findMany({
            where: query,
            include: {
                lesson: {
                    select: {
                        subject: { select: { name: true } },
                        teacher: { select: { name: true, surname: true } },
                        class: { select: { name: true } },
                    }
                }
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (currentPage - 1),
        }),

        prisma.exam.count({
            where: query,
        })

    ])
    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/* Top Section */}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block font-semibold text-xl'>All Exams</h1>
                <div className='flex flex-col gap-4 md:flex-row items-center w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 flex items-center justify-center rounded-full bg-prajwalYellow'>
                            <Image src='/filter.png' alt='' width={20} height={20} />
                        </button>
                        <button className='w-8 h-8 flex items-center justify-center rounded-full bg-prajwalYellow'>
                            <Image src='/sort.png' alt='' width={20} height={20} />
                        </button>
                        {Role === "admin" || Role === "teacher" &&
                            // <button className='w-8 h-8 flex items-center justify-center rounded-full bg-prajwalYellow'>
                            //     <Image src='/plus.png' alt='' width={20} height={20} />
                            // </button>
                            <FormContainer table='exam' type='create' />
                        }
                    </div>
                </div>
            </div>

            {/* List */}
            <div className=''>
                <Table columns={columns} renderRow={renderRow} data={exams} />
            </div>

            {/* Bottom Pagination */}
            <Pagination page={currentPage} count={count} />

        </div>
    )
}

export default ExamListPage