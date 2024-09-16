"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { instance } from "@/services"
import { useToast } from "@/components/hooks/use-toast"
import { useEffect, useState } from "react"
import { CreateRoomModal } from "../Modal/CreateRoomModal"
import { Badge } from "@/components/ui/badge"
import { UpdateRoomModal } from "../Modal/UpdateRoomModal"
import { DeleteAlertDialogComponent } from "@/shared/DeleteAlertDialogComponent"

interface IRoom {
  id: string;
  name: string;
  features: { name: string, id: number, created_at: string }[];
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
            <TableHead>Name</TableHead>
            <TableHead>Features</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room: IRoom) => (
            <TableRow key={room.id}>
              <TableCell className="font-medium">{room.name}</TableCell>
              <TableCell className="font-medium flex flex-row gap-1">{room?.features?.map((feature) => <Badge key={feature.created_at}>{feature.name}</Badge>)}</TableCell>
              <TableCell className="font-medium">
                <div className="flex flex-row items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger><UpdateRoomModal fetchRooms={fetchRooms} room={room} /></TooltipTrigger>
                      <TooltipContent>
                        Edit Room
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger><DeleteAlertDialogComponent method={handleDelete} id={room.id} type="room" /></TooltipTrigger>
                      <TooltipContent>
                        Delete Room
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody >
      </Table >
    </>
  )

}