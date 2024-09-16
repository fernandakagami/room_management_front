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
  FormDescription,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/hooks/use-toast"
import { instance } from "@/services"
import { use, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Pencil } from "lucide-react"

const defaultValues = {
  name: "",
  features: []
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Feature must be at least 2 characters.",
  }),
  features: z.number().array().nonempty({ message: "Features must have at least 1 item." }),
})

type TUpdateRoomModal = {
  fetchRooms: () => void;
  room: { id: string, name: string, features: { name: string, id: number }[] }
}

export function UpdateRoomModal({ fetchRooms, room }: TUpdateRoomModal) {
  const [open, setOpen] = useState(false);
  const [featuresList, setFeaturesList] = useState([]);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: room.name,
      features: room.features.map(feature => feature.id)
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    instance.put(`/room/${room.id}`, values)
      .then((response) => {
        toast({
          title: "Yay!!! Success",
          description: "Room updated",
        })
        form.reset(defaultValues);
        fetchRooms();
        setOpen(false);
      })
      .catch((error) => {
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.response.data.name,
        })
      })
  }

  const fetchFeatures = () => {
    instance.get(`/feature`)
      .then((response) => {
        setFeaturesList(response.data);
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

  useEffect(() => {
    if (open) {
      form.reset({
        name: room.name,
        features: room.features.map(feature => feature.id)
      })
    }
  }, [open, room]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Pencil className="text-blue-500 cursor-pointer" size={18} onClick={() => setOpen(true)} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
          <DialogDescription>
            Update your room.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="features"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Features</FormLabel>
                    <FormDescription>
                      Select the items which there are in the room.
                    </FormDescription>
                  </div>
                  {featuresList.map((item: { id: string; name: string }) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="features"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(Number(item.id))}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== Number(item.id)
                                      )
                                    )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.name}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}