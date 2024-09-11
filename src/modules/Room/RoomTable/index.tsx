"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { instance } from "@/services"
import { useToast } from "@/components/hooks/use-toast"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { CreateRoomModal } from "../Modal/CreateRoomModal"

interface IRoom {
  id: string;
  name: string;
}

export default function RoomTable() {
  const [rooms, getRooms] = useState([]);

  const { toast } = useToast()

  const handleDelete = (id: string) => {
    instance.delete(`/room/${id}`)
      .then((response) => {
        toast({
          title: "Yay!!! Success",
          description: "Room removed",
        })
        fetchRooms();
      })
      .catch((error) => {
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.response.data,
        })
      })
  }

  const fetchRooms = () => {
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
    fetchRooms();
  }, []);

  return (
    <>
      <div className="flex flew-row justify-between items-center mb-5">
        <h1>Rooms</h1>
        <CreateRoomModal fetchRooms={fetchRooms} />

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