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
import { useToast } from "@/components/hooks/use-toast"
import { useEffect, useState } from "react"
import { CreateRoomModal } from "../Modal/CreateRoomModal"
import { Badge } from "@/components/ui/badge"
import { UpdateRoomModal } from "../Modal/UpdateRoomModal"
import { DeleteAlertDialogComponent } from "@/shared/DeleteAlertDialogComponent"
import { deleteRoom, fetchRooms } from "../../actions/room.action"
import { returnErrorMessageToast } from "@/utils/returnErrorMessageToast"

interface IRoom {
  id: string;
  name: string;
  features: { name: string, id: number, created_at: string }[];
}

export default function RoomTable() {
  const [rooms, getRooms] = useState([]);

  const { toast } = useToast()

  async function handleDelete(id: string) {
    try {
      await deleteRoom(id);

      toast({
        title: "Yay!!! Success",
        description: "Room removed",
      })
      getAllRooms();

    } catch (error) {
      const message = returnErrorMessageToast(error);

      toast({
        title: "Uh oh! Something went wrong.",
        description: message,
      })
    }
  }

  async function getAllRooms() {
    try {
      const response = await fetchRooms();

      getRooms(response);
    } catch (error) {
      const message = returnErrorMessageToast(error);

      toast({
        title: "Uh oh! Something went wrong.",
        description: message,
      })
    }
  }

  useEffect(() => {
    getAllRooms();
  }, []);

  return (
    <>
      <div className="flex flew-row justify-between items-center mb-5">
        <h1>Rooms</h1>
        <CreateRoomModal fetchRooms={getAllRooms} />
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
                <div className="flex flex-row items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger><UpdateRoomModal fetchRooms={getAllRooms} room={room} /></TooltipTrigger>
                      <TooltipContent>
                        Edit Room
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger><DeleteAlertDialogComponent method={() => handleDelete(room.id)} type="room" /></TooltipTrigger>
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