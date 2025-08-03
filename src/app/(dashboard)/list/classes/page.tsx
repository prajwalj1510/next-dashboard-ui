import FormContainer from '@/components/FormContainer'
import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { getUserRole } from '@/lib/getUserRole'
import prisma from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/settings'
import { Class, Prisma, Teacher } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

const {Role} = getUserRole()

const columns = [
    {
        header: "Class Name",
        accessor: "name",
    },
    {
        header: "Capacity",
        accessor: "capacity",
        className: "hidden md:table-cell",
    },
    {
        header: "Grade",
        accessor: "grade",
        className: "hidden md:table-cell",
    },
    {
        header: "Supervisor",
        accessor: "supervisor",
        className: "hidden md:table-cell",
    },
    ...(Role ==="admin" ?[{
        header: "Actions",
        accessor: "actions"
    }]:[])
]

type ClassList = Class & {supervisor: Teacher} 

const renderRow = (item: ClassList) => (
    <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-prajwalPurpleLight'>
        <td className='flex items-center gap-4 p-2'>
            {item.name}
        </td>
        <td className='hidden md:table-cell'>{item.capacity}</td>
        <td className='hidden md:table-cell'>{item.name[0]}</td>
        <td className='hidden md:table-cell'>{item.supervisor.name + " " + item.supervisor.surname}</td>
        <td>
            <div className='flex items-center gap-2'>
                {/* <Link className='flex gap-2' href={`/list/teachers/${item.id}`}>
                        <button className='size-7 flex items-center justify-center rounded-full bg-prajwalSky'>
                            <Image src='/edit.png' alt='' width={20} height={20} />
                        </button>
                    </Link> */}
                {Role === "admin" &&
                    // <button className='size-7 flex items-center justify-center rounded-full bg-prajwalPurple'>
                    //     <Image src='/delete.png' alt='' width={20} height={20} />
                    // </button>
                    <>
                        <FormContainer table='class' type='update' data={item} />
                        <FormContainer table='class' type='delete' id={item.id} />
                    </>
                }
            </div>
        </td>
    </tr>
)

const ClassListPage = async ({
    searchParams
}: { searchParams: { [key: string]: string | undefined } }) => {

    const { page, ...queryParams } = searchParams

    const currentPage = page ? parseInt(page) : 1;

    // URL PARAMS CONDITION

    const query: Prisma.ClassWhereInput = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "supervisorId":
                        query.supervisorId = value
                        break;

                    case "search":
                        query.name = { contains: value, mode: "insensitive" }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    // $transaction takes multiple request as shown below
    const [classes, count] = await prisma.$transaction([

        prisma.class.findMany({
            where: query,
            include: {
                supervisor: true,
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (currentPage - 1),
        }),

        prisma.class.count({
            where: query,
        })

    ])
    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/* Top Section */}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block font-semibold text-xl'>All Classes</h1>
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
                            <FormContainer table='class' type='create' />
                        }
                    </div>
                </div>
            </div>

            {/* List */}
            <div className=''>
                <Table columns={columns} renderRow={renderRow} data={classes} />
            </div>

            {/* Bottom Pagination */}
            <Pagination page={currentPage} count={count} />

        </div>
    )
}

export default ClassListPage
