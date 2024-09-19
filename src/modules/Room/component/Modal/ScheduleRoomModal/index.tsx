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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/components/hooks/use-toast"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { CalendarClock, CalendarIcon } from "lucide-react"
import { returnErrorMessageToast } from "@/utils/returnErrorMessageToast"
import { Calendar } from "@/components/ui/calendar"
import { CreateScheduleRoomModal } from "./CreateScheduleRoomModal"
import { fetchSchedules } from "@/modules/Room/actions/room.action"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  start_time: z.date({
    required_error: "A date of birth is required.",
  }),
  end_time: z.date({
    required_error: "A date of birth is required.",
  }),
})

type TUpdateRoomModal = {
  fetchRooms: () => void;
  room: { id: string, name: string, features: { name: string, id: number }[] }
}

export function ScheduleRoomModal({ fetchRooms, room }: TUpdateRoomModal) {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // try {
    //   await updateRoom(room.id, values);

    //   toast({
    //     title: "Yay!!! Success",
    //     description: "Room registred",
    //   })

    //   form.reset(defaultValues);
    //   fetchRooms();
    //   setOpen(false);

    // } catch (error) {
    //   const message = returnErrorMessageToast(error);

    //   toast({
    //     title: "Uh oh! Something went wrong.",
    //     description: message,
    //   })
    // }
  }

  async function getAllSchedules() {
    try {
      const response = await fetchSchedules(room.id);

      console.log(response);
    } catch (error) {
      const message = returnErrorMessageToast(error);

      toast({
        title: "Uh oh! Something went wrong.",
        description: message,
      })
    }
  }

  useEffect(() => {
    getAllSchedules();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CalendarClock className="text-green-500 cursor-pointer" size={18} onClick={() => setOpen(true)} />
      </DialogTrigger>
      <DialogContent className="w-[1000px] max-w-[1000px] h-[600px]">
        <DialogHeader className="space-none">
          <DialogTitle>Room - {room.name}</DialogTitle>
          <DialogDescription className="flex flex-row justify-between items-center">
            Show schedule of your room.
            <CreateScheduleRoomModal room={room} />
          </DialogDescription>
        </DialogHeader>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {rooms.map((room: IRoom) => (
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
                        <TooltipTrigger><ScheduleRoomModal fetchRooms={getAllRooms} room={room} /></TooltipTrigger>
                        <TooltipContent>
                          Schedule Room
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
            ))} */}
            </TableBody >
          </Table >
        </div>
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}