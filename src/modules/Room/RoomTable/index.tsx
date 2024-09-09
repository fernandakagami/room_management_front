"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { instance } from "@/services"
import { useToast } from "@/components/hooks/use-toast"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { CreateRoomModal } from "../Modal/CreateRoomModal"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Feature must be at least 2 characters.",
  }),
})

interface IRoom {
  id: string;
  name: string;
}

export default function RoomTable() {
  const [rooms, getRooms] = useState([]);

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    instance.post(`/rooms`, values)
      .then((response) => {
        toast({
          title: "Yay!!! Success",
          description: "Room registred",
        })
        fetchFeatures();
      })
      .catch((error) => {
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.response.data.name,
        })
      })
  }

  const handleDelete = (id: string) => {
    instance.delete(`/room/${id}`)
      .then((response) => {
        toast({
          title: "Yay!!! Success",
          description: "Room removed",
        })
        fetchFeatures();
      })
      .catch((error) => {
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.response.data,
        })
      })
  }

  const fetchFeatures = () => {
    instance.get(`/room`)
      .then((response) => {
        getRooms(response.data);
      })
      .catch((error) => {
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.response.data,
        })
      })
  }

  useEffect(() => {
    fetchFeatures();
  }, []);

  return (
    <>
      <div className="flex flew-row justify-between items-center mb-5">
        <h1>Rooms</h1>
        <CreateRoomModal />

      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Room</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room: IRoom) => (
            <TableRow key={room.id}>
              <TableCell className="font-medium">{room.id}</TableCell>
              <TableCell className="font-medium">{room.name}</TableCell>
              <TableCell className="font-medium"><X className="text-red-500 cursor-pointer" onClick={() => handleDelete(room.id)} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )

}