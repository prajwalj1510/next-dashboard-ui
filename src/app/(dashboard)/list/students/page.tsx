import FormContainer from '@/components/FormContainer'
import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { getUserRole } from '@/lib/getUserRole'
import prisma from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/settings'
import { Class, Prisma, Student } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
const {Role} = getUserRole()

const columns = [
    {
        header: "Info",
        accessor: "info",
    },
    {
        header: "Student Id",
        accessor: "studentId",
        className: "hidden md:table-cell",
    },
    {
        header: "Grade",
        accessor: "grade",
        className: "hidden md:table-cell",
    },
    {
        header: "Phone",
        accessor: "phone",
        className: "hidden lg:table-cell",
    },
    {
        header: "Address",
        accessor: "address",
        className: "hidden lg:table-cell",
    },
    ...(Role === "admin" ? [{
        header: "Actions",
        accessor: "actions"
    }] : [])
]

type StudentList = Student & { class: Class }

const renderRow = (item: StudentList) => (
    <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-prajwalPurpleLight'>
        <td className='flex items-center gap-4 p-2'>
            <Image
                src={item.img || "/Avatar.png"}
                alt=''
                width={40}
                height={40}
                className='md:hidden xl:block w-10 h-10 rounded-full object-cover'
            />
            <div className='flex flex-col'>
                <h3 className='font-semibold'>{item.name}</h3>
                <p className='text-sm text-gray-500'>{item.class.name}</p>
            </div>
        </td>
        <td className='hidden md:table-cell'>{item.username}</td>
        <td className='hidden md:table-cell'>{item.class.name[0]}</td>
        <td className='hidden md:table-cell'>{item.phone}</td>
        <td className='hidden lg:table-cell'>{item.address}</td>
        <td>
            <div className='flex items-center gap-2'>
                <Link className='flex gap-2' href={`/list/students/${item.id}`}>
                    <button className='size-7 flex items-center justify-center rounded-full bg-prajwalSky'>
                        <Image src='/view.png' alt='' width={20} height={20} />
                    </button>
                </Link>
                {Role === "admin" &&
                    // <button className='size-7 flex items-center justify-center rounded-full bg-prajwalPurple'>
                    //     <Image src='/delete.png' alt='' width={20} height={20} />
                    // </button>
                    // <FormModal table='student' type='delete' id={item.id} />
                    <>
                        <FormContainer table='student' type='delete' id={item.id}/>
                    </>
                }
            </div>
        </td>
    </tr>
)


const StudentListPage = async ({
    searchParams
}: { searchParams: { [key: string]: string | undefined } }) => {

    const { page, ...queryParams } = searchParams

    const currentPage = page ? parseInt(page) : 1;

    // URL PARAMS CONDITION

    const query: Prisma.StudentWhereInput = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "teacherId":
                        query.class = {
                            lessons: {
                                some: {
                                    teacherId: value
                                }
                            }
                        }
                        break;
                    case "search":
                        query.name = { contains: value, mode: "insensitive" }
                        break;
                }
            }
        }
    }

    // $transaction takes multiple request as shown below
    const [students, count] = await prisma.$transaction([

        prisma.student.findMany({
            where: query,
            include: {
                class: true,
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (currentPage - 1),
        }),

        prisma.student.count({
            where: query,
        })

    ])

    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/* Top Section */}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block font-semibold text-xl'>All Students</h1>
                <div className='flex flex-col gap-4 md:flex-row items-center w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 flex items-center justify-center rounded-full bg-prajwalYellow'>
                            <Image src='/filter.png' alt='' width={20} height={20} />
                        </button>
                        <button className='w-8 h-8 flex items-center justify-center rounded-full bg-prajwalYellow'>
                            <Image src='/sort.png' alt='' width={20} height={20} />
                        </button>
                        {Role === "admin" &&
                            // <button className='w-8 h-8 flex items-center justify-center rounded-full bg-prajwalYellow'>
                            //     <Image src='/plus.png' alt='' width={20} height={20} />
                            // </button>
                            <FormContainer table='student' type='create' />
                        }
                    </div>
                </div>
            </div>

            {/* List */}
            <div className=''>
                <Table columns={columns} renderRow={renderRow} data={students} />
            </div>

            {/* Bottom Pagination */}
            <Pagination page={currentPage} count={count} />

        </div>
    )
}

export default StudentListPage
