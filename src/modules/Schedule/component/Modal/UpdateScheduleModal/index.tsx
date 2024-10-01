"use client";

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
  Select,
  SelectContent,

  SelectItem,

  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/components/hooks/use-toast"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { CalendarIcon, Pencil } from "lucide-react"
import { returnErrorMessageToast } from "@/utils/returnErrorMessageToast"
import { Calendar } from "@/components/ui/calendar"
import { fetchRooms, updateSchedule } from "@/modules/Room/actions/room.action"

import moment from 'moment';
import { getSchedule } from "@/modules/Schedule/actions/schedule.action";

const defaultValues = {
  room_id: undefined,
  title: "",
  start_time: undefined,
  end_time: undefined,
};

const formSchema = z.object({
  room_id: z.string({
    required_error: "Choose a room.",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  start_time: z.date({
    required_error: "The initial date is required.",
  }),
  end_time: z.date({
    required_error: "The final date is required.",
  }),
})

type TUpdateScheduleModal = {
  fetchSchedules: () => void;
  schedule: any;
}

export function UpdateScheduleModal({ fetchSchedules, schedule }: TUpdateScheduleModal) {
  const [open, setOpen] = useState(false);
  const [rooms, getRooms] = useState([]);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateSchedule({ id: values.room_id, scheduleId: schedule.id, ...values });

      toast({
        title: "Yay!!! Success",
        description: "Schedule updated",
      })

      form.reset(defaultValues);
      fetchSchedules();
      setOpen(false);

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

  async function getOneSchedule() {
    try {
      const response = await getSchedule(schedule.id);

      form.setValue("room_id", response.room_id);
      form.setValue("title", response.title);
      form.setValue("start_time", new Date(response.start_time));
      form.setValue("end_time", new Date(response.end_time));

    } catch (error) {
      const message = returnErrorMessageToast(error);

      toast({
        title: "Uh oh! Something went wrong.",
        description: message,
      })
    }
  }

  useEffect(() => {
    if (open) {
      getAllRooms()
      getOneSchedule()
    };

  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Pencil className="text-blue-500 cursor-pointer" size={18} onClick={() => setOpen(true)} />
      </DialogTrigger>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Schedule</DialogTitle>
          <DialogDescription>
            Change the schedule of your room.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              <FormField
                control={form.control}
                name="room_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a room" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rooms.map((room: { id: string, name: string }) => (
                          <SelectItem key={room.id} value={String(room.id)}>{room.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Initial date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            moment(date).isBefore(moment().subtract(1, 'days'))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Final date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            moment(date).isBefore(moment().subtract(1, 'days'))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}