import { instance } from "@/services";

export async function fetchRooms() {
  const { data } = await instance.get(`/room`);

  return data;
}

export async function createRoom(values: { name: string, features: number[] }) {
  const { data } = await instance.post(`/room`, values);

  return data;
}

export async function updateRoom(id: string, values: { name: string, features: number[] }) {
  const { data } = await instance.put(`/room/${id}`, values);

  return data;
}

export async function deleteRoom(id: string) {
  const { data } = await instance.delete(`/room/${id}`);

  return data;
}

export async function createSchedule(values: {
  id: string,
  title: string
  start_time: Date
  end_time: Date
}) {
  const { data } = await instance.post(`/room/${values.id}/schedule`, values);

  return data;
}

export async function updateSchedule(values: {
  id: string,
  scheduleId: number,
  title: string
  start_time: Date
  end_time: Date
}) {
  const { data } = await instance.put(`/room/${values.id}/schedule/${values.scheduleId}`, values);

  return data;
}


