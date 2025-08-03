import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import prisma from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/settings'
import { currentUserId, role } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import { Assignment, Class, Prisma, Subject, Teacher } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// const {sessionClaims} = auth()
// const role = (sessionClaims?.metadata as {role?: string})?.role

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
        header: "Due Date",
        accessor: "dueDate",
        className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher"? [{
        header: "Actions",
        accessor: "actions"
    }]:[])
]

type AssignmentList = Assignment & {
    lesson: {
        subject: Subject,
        class: Class,
        teacher: Teacher,
    }
}

const renderRow = (item: AssignmentList) => (
    <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-prajwalPurpleLight'>
        <td className='flex items-center gap-4 p-2'>
            {item.lesson.subject.name}
        </td>
        <td>{item.lesson.class.name}</td>
        <td className='hidden md:table-cell'>{item.lesson.teacher.name + " " + item.lesson.teacher.surname}</td>
        <td className='hidden md:table-cell'>{new Intl.DateTimeFormat("en-US").format(item.dueDate)}</td>
        <td>
            <div className='flex items-center gap-2'>
                {role === "admin" || role === "teacher" && (
                    <>
                        <FormModal table='assignment' type='update' data={item} />
                        <FormModal table='assignment' type='delete' id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
)
const AssignmentListPage = async ({
    searchParams
}: { searchParams: { [key: string]: string | undefined } }) => {

    const { page, ...queryParams } = searchParams

    const currentPage = page ? parseInt(page) : 1;

    // URL PARAMS CONDITION

    const query: Prisma.AssignmentWhereInput = {}

    query.lesson = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "teacherId":
                        query.lesson.teacherId =  value
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

    // Role condition
    switch(role) {
        case "admin" :
            break;
        case "teacher":
            query.lesson.teacherId = currentUserId! 
            break;
        case "student":
            query.lesson.class = {
                students: {
                    some: {
                        id: currentUserId! 
                    }
                }
            }
            break;
        case "parent":
            query.lesson.class = {
                students: {
                    some: {
                        parentId: currentUserId! 
                    }
                }
            }
            break;
        default:
            break;
    }


    // $transaction takes multiple request as shown below
    const [assignments, count] = await prisma.$transaction([

        prisma.assignment.findMany({
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

        prisma.assignment.count({
            where: query,
        })

    ])

    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/* Top Section */}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block font-semibold text-xl'>All Assignments</h1>
                <div className='flex flex-col gap-4 md:flex-row items-center w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 flex items-center justify-center rounded-full bg-prajwalYellow'>
                            <Image src='/filter.png' alt='' width={20} height={20} />
                        </button>
                        <button className='w-8 h-8 flex items-center justify-center rounded-full bg-prajwalYellow'>
                            <Image src='/sort.png' alt='' width={20} height={20} />
                        </button>
                        {role === "admin" && <button className='w-8 h-8 flex items-center justify-center rounded-full bg-prajwalYellow'>
                            <Image src='/plus.png' alt='' width={20} height={20} />
                        </button>}
                    </div>
                </div>
            </div>

            {/* List */}
            <div className=''>
                <Table columns={columns} renderRow={renderRow} data={assignments} />
            </div>

            {/* Bottom Pagination */}
            <Pagination page={currentPage} count={count} />

        </div>
    )
}

export default AssignmentListPage