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
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { CreateRoom } from "@/modules/Room/action/room.action"

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

type TCreateRoomModal = {
  fetchRooms: () => void;
}

export function CreateRoomModal({ fetchRooms }: TCreateRoomModal) {
  const [open, setOpen] = useState(false);
  const [featuresList, setFeaturesList] = useState([]);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = await CreateRoom(values)

      console.log(data);

      if (data.error)
        console.log(data);
      // .then((response) => {
      //   toast({
      //     title: "Yay!!! Success",
      //     description: "Room registred",
      //   })
      //   form.reset(defaultValues);
      //   fetchRooms();
      //   setOpen(false);
      // })
      //   .catch((error) => {
      //     toast({
      //       title: "Uh oh! Something went wrong.",
      //       description: error.response.data.name,
      //     })
      //   })
    } catch (error) {
      console.log(error);
    }
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Add room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Room</DialogTitle>
          <DialogDescription>
            Create your room.
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