import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import prisma from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/settings'
import { currentUserId, role } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import Image from 'next/image'
import { Result } from 'postcss'
import React from 'react'

const columns = [
    {
        header: "Subject Name",
        accessor: "subject",
    },
    {
        header: "Student",
        accessor: "student",
    },
    {
        header: "Score",
        accessor: "score",
        className: "hidden md:table-cell",
    },
    {
        header: "Class",
        accessor: "class",
        className: "hidden md:table-cell",
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
    ...(role === "admin" || role === "teacher" ? [{
        header: "Actions",
        accessor: "actions"
    }] : [])
]

type ResultList = {
    id: number,
    title: string,
    studentName: string,
    studentSurname: string,
    teacherName: string,
    teacherSurname: string,
    score: number,
    className: string,
    startTime: Date,
}

const renderRow = (item: ResultList) => (
    <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-prajwalPurpleLight'>
        <td className='flex items-center gap-4 p-2'>
            {item.title}
        </td>
        <td>{item.studentName + " " + item.studentSurname}</td>
        <td>{item.score}</td>
        <td className='hidden md:table-cell'>{item.className}</td>
        <td className='hidden md:table-cell'>{item.teacherName + " " + item.teacherSurname}</td>
        <td className='hidden md:table-cell'>{new Intl.DateTimeFormat("en-US").format(item.startTime)}</td>
        <td>
            <div className='flex items-center gap-2'>
                {/* <Link className='flex gap-2' href={`/list/teachers/${item.id}`}>
                        <button className='size-7 flex items-center justify-center rounded-full bg-prajwalSky'>
                            <Image src='/edit.png' alt='' width={20} height={20} />
                        </button>
                    </Link> */}
                {role === "admin" || role === "teacher" &&
                    // <button className='size-7 flex items-center justify-center rounded-full bg-prajwalPurple'>
                    //     <Image src='/delete.png' alt='' width={20} height={20} />
                    // </button>
                    <>
                        <FormModal table='result' type='update' data={item} />
                        <FormModal table='result' type='delete' id={item.id} />
                    </>
                }
            </div>
        </td>
    </tr>
)
const ResultListPage = async ({
    searchParams
}: { searchParams: { [key: string]: string | undefined } }) => {

    const { page, ...queryParams } = searchParams

    const currentPage = page ? parseInt(page) : 1;

    // URL PARAMS CONDITION

    const query: Prisma.ResultWhereInput = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "studentId":
                        query.studentId = value;
                        break;

                    case "search":
                        query.OR = [
                            { exam: { title: { contains: value, mode: "insensitive" } } },
                            { student: { name: { contains: value, mode: "insensitive" } } },
                        ]
                        break;
                    default:
                        break;
                }
            }
        }
    }

    // Role Conditions

    switch (role) {
        case "admin":
            break;
        case "teacher":
            query.OR = [
                { exam: { lesson: { teacherId: currentUserId! } } },
                { assignment: { lesson: { teacherId: currentUserId! } } },
            ]
            break;
        case 'student':
            query.studentId = currentUserId!
            break;
        case 'parent':
            query.student = {
                parentId: currentUserId!
            }
            break;
        default:
            break;
    }

    // $transaction takes multiple request as shown below
    const [dataRes, count] = await prisma.$transaction([

        prisma.result.findMany({
            where: query,
            include: {
                student: { select: { name: true, surname: true } },
                exam: {
                    include: {
                        lesson: {
                            select: {
                                class: { select: { name: true } },
                                teacher: { select: { name: true, surname: true } }
                            }
                        }
                    }
                },
                assignment: {
                    include: {
                        lesson: {
                            select: {
                                class: { select: { name: true } },
                                teacher: { select: { name: true, surname: true } }
                            }
                        }
                    }
                }

            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (currentPage - 1),
        }),

        prisma.result.count({
            where: query,
        })

    ])

    const results = dataRes.map((item => {
        const assessment = item.exam || item.assignment

        if (!assessment) return null

        const isExam = "startTime" in assessment

        return {
            id: item.id,
            title: assessment.title,
            studentName: item.student.name,
            studentSurname: item.student.surname,
            teacherName: assessment.lesson.teacher.name,
            teacherSurname: assessment.lesson.teacher.surname,
            score: item.score,
            className: assessment.lesson.class.name,
            startTime: isExam ? assessment.startTime : assessment.startDate
        }
    }))

    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/* Top Section */}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block font-semibold text-xl'>All Results</h1>
                <div className='flex flex-col gap-4 md:flex-row items-center w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 flex items-center justify-center rounded-full bg-prajwalYellow'>
                            <Image src='/filter.png' alt='' width={20} height={20} />
                        </button>
                        <button className='w-8 h-8 flex items-center justify-center rounded-full bg-prajwalYellow'>
                            <Image src='/sort.png' alt='' width={20} height={20} />
                        </button>
                        {role === "admin" || role === "teacher" &&
                            // <button className='w-8 h-8 flex items-center justify-center rounded-full bg-prajwalYellow'>
                            //     <Image src='/plus.png' alt='' width={20} height={20} />
                            // </button>
                            <FormModal table='result' type='create' />
                        }
                    </div>
                </div>
            </div>

            {/* List */}
            <div className=''>
                <Table columns={columns} renderRow={renderRow} data={results} />
            </div>

            {/* Bottom Pagination */}
            <Pagination page={currentPage} count={count} />

        </div>
    )
}

export default ResultListPage