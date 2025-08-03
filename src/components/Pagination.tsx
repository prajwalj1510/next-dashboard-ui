"use client"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { useRouter } from "next/navigation"

const Pagination = ({page, count}: {page: number, count: number}) => {
  
  const router = useRouter()

  // const hasPrev = ITEM_PER_PAGE * (page-1) > 0 ;
  // const hasNext = ITEM_PER_PAGE * (page-1) + ITEM_PER_PAGE < count ;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search)
    params.set("page", newPage.toString())
    router.push(`${window.location.pathname}?${params}`)
  }

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button onClick={()=> changePage(page-1)} disabled = {page == 1} className="p-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed">Prev</button>
      
      <div className="flex gap-2 items-center text-sm">
        {Array.from({length: Math.ceil(count/ITEM_PER_PAGE)}, (_,index) => {
          const pageIndex = index+1 ;
          return <button onClick={()=> changePage(pageIndex)} key={index} className={`px-2 rounded-sm ${page === pageIndex ? "bg-prajwalSky": ""}`}>{pageIndex}</button>
        })}
        
      </div>

      <button onClick={()=> changePage(page+1)} disabled = {page == Math.ceil(count/ITEM_PER_PAGE) }  className="p-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
    </div>
  )
}

export default Pagination
