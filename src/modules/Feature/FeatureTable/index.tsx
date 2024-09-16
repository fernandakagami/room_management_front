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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { instance } from "@/services"
import { useToast } from "@/components/hooks/use-toast"
import { useEffect, useState } from "react"
import { Pencil, X } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const formSchema = z.object({
  name: z.string(),
})

interface IFeature {
  id: string;
  name: string;
}

const defaultValues = {
  name: "",
};

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})

export default function FeatureTable() {
  const [features, setFeatures] = useState([]);
  const [isEditing, setIsEditing] = useState("");

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const nameForm = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function handleCreateFeature(values: z.infer<typeof formSchema>) {
    if (values.name.length < 2) {
      return toast({
        title: "Uh oh! Something went wrong.",
        description: "Feature must be at least 2 characters.",
      })
    }

    instance.post(`/feature`, values)
      .then((response) => {
        toast({
          title: "Yay!!! Success",
          description: "Feature registred",
        })
        form.reset(defaultValues);
        fetchFeatures();
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.response.data.name,
        })
      })
  }

  function handleEditFeature(id: string, values: z.infer<typeof formSchema>) {
    if (values.name.length < 2) {
      return toast({
        title: "Uh oh! Something went wrong.",
        description: "Feature must be at least 2 characters.",
      })
    }

    instance.put(`/feature/${id}`, values)
      .then((response) => {
        toast({
          title: "Yay!!! Success",
          description: "Feature updated",
        })
        openEditField("")
        fetchFeatures();
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.response.data.name,
        })
      })
  }

  function openEditField(featureId: string) {
    if (isEditing === featureId) {
      return setIsEditing("");
    }
    return setIsEditing(featureId);
  }

  const handleDelete = (id: string) => {
    instance.delete(`/feature/${id}`)
      .then((response) => {
        toast({
          title: "Yay!!! Success",
          description: "Feature removed",
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
    instance.get(`/feature`)
      .then((response) => {
        setFeatures(response.data);
      })
      .catch((error) => {
        console.log(error);
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
      <div className="flex flex-row items-center justify-between mb-5">
        <h1>Features</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateFeature)} className="flex flex-row gap-3 justify-end items-start">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Add feature" {...field} className="w-96" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add feature</Button>
          </form>
        </Form>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((feature: IFeature) => (
            <TableRow key={feature.id}>
              <TableCell className="font-medium flex flex-row items-center justify-between h-12">
                {isEditing === feature.id ? <div className="flex flex-row justify-between items-center w-full me-6"><Form {...form}>
                  <form onSubmit={nameForm.handleSubmit((values) => handleEditFeature(feature.id, values))} className="w-full flex flex-row justify-between items-center">
                    <FormField
                      control={nameForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input className="w-full !border-0 p-0 focus-visible:ring-0 shadow-none" autoFocus {...field} defaultValue={feature.name} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-row items-center gap-1"><Button className="text-sm py-0 px-4" type="submit">Edit</Button><Button className="text-sm py-0 px-4" onClick={() => openEditField("")}>Cancel</Button></div>
                  </form>
                </Form></div> : <div className="flex flex-row items-center gap-2">{feature.name}<TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><Pencil className="text-blue-500 cursor-pointer" size={18} onClick={() => openEditField(feature.id)} /></TooltipTrigger>
                    <TooltipContent>
                      Edit Feature
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider></div>}
                <div className="flex flex-row gap-3 items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger> <X className="text-red-500 cursor-pointer" size={24} onClick={() => handleDelete(feature.id)} /></TooltipTrigger>
                      <TooltipContent>
                        Delete Feature
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table >
    </>
  )

}