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
import { X } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Feature must be at least 2 characters.",
  }),
})

interface IFeature {
  id: string;
  name: string;
}

export default function FeatureTable() {
  const [features, setFeatures] = useState([]);

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    instance.post(`/feature`, values)
      .then((response) => {
        toast({
          title: "Yay!!! Success",
          description: "Feature registred",
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row gap-3 justify-end items-start">
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
            <TableHead className="w-[100px]">Feature</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((feature: IFeature) => (
            <TableRow key={feature.id}>
              <TableCell className="font-medium">{feature.id}</TableCell>
              <TableCell className="font-medium">{feature.name}</TableCell>
              <TableCell className="font-medium"><X className="text-red-500 cursor-pointer" onClick={() => handleDelete(feature.id)} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )

}