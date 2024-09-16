import { instance } from "@/services";

export async function CreateRoom(values: { name: string, features: number[] }) {
  try {
    const { data } = await instance.post(`/room`, values);

    return data;
  } catch (error) {
    console.log(error);

    return error;
  }
}