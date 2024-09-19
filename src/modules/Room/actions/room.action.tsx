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

export async function fetchSchedules(id: string) {
  const { data } = await instance.get(`/room/${id}/schedule`);

  return data;
}

export async function createSchedule(id: string, values: any) {
  const { data } = await instance.post(`/room/${id}/schedule`, values);

  return data;
}

export async function updateSchedule(id: string, scheduleId: string, values: any) {
  const { data } = await instance.put(`/room/${id}/schedule/${scheduleId}`, values);

  return data;
}

export async function deleteSchedule(id: string, scheduleId: string) {
  const { data } = await instance.delete(`/room/${id}/schedule/${scheduleId}`);

  return data;
}
