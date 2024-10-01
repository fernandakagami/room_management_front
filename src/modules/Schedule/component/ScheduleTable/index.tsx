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

import { DeleteAlertDialogComponent } from "@/shared/DeleteAlertDialogComponent"

import { returnErrorMessageToast } from "@/utils/returnErrorMessageToast"
import { CreateScheduleModal } from "../Modal/CreateScheduleModal"
import { deleteSchedule, fetchSchedules } from "../../actions/schedule.action"
import moment from "moment"
import { UpdateScheduleModal } from "../Modal/UpdateScheduleModal"

export default function ScheduleTable() {
  const [schedules, getSchedules] = useState([]);

  const { toast } = useToast()

  async function handleDelete(id: string) {
    try {
      await deleteSchedule(id);

      toast({
        title: "Yay!!! Success",
        description: "Schedule removed",
      })
      getAllSchedules();

    } catch (error) {
      const message = returnErrorMessageToast(error);

      toast({
        title: "Uh oh! Something went wrong.",
        description: message,
      })
    }
  }

  async function getAllSchedules() {
    try {
      const response = await fetchSchedules();

      getSchedules(response);
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
    <>
      <div className="flex flew-row justify-between items-center mb-5">
        <h1>Schedules</h1>
        <CreateScheduleModal fetchSchedules={getAllSchedules} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule: any) => (
            <TableRow key={schedule.id}>
              <TableCell className="font-medium">{schedule.room.name}</TableCell>
              <TableCell className="font-medium">{schedule.title}</TableCell>
              <TableCell className="font-medium">{moment(schedule.start_time).format("YYYY-MM-DD")}</TableCell>
              <TableCell className="font-medium">{moment(schedule.end_time).format("YYYY-MM-DD")}</TableCell>
              <TableCell className="font-medium">
                <div className="flex flex-row items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger><UpdateScheduleModal fetchSchedules={getAllSchedules} schedule={schedule} /></TooltipTrigger>
                      <TooltipContent>
                        Edit Room
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger><DeleteAlertDialogComponent method={() => handleDelete(schedule.id)} type="schedule" /></TooltipTrigger>
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