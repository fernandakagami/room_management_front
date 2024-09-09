'use client'

import { Button } from "@/components/ui/button"
import { Pencil, NotebookPenIcon } from "lucide-react"
import Link from "next/link"

export default function SideBarComponent() {  
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Register</h2>
      <Link href="/features" scroll={false}>
        <Button variant="ghost" className="w-full flex flex-row items-center justify-start rounded-lg"><Pencil className="mr-2 h-4 w-4"/><span className="text-sm" >Features</span></Button>
      </Link>
      <Link href="/rooms" scroll={false}>
        <Button variant="ghost" className="w-full flex flex-row items-center justify-start rounded-lg"><NotebookPenIcon className="mr-2 h-4 w-4"/><span className="text-sm" >Rooms</span></Button>
      </Link>      
    </div>
  )
}