import { instance } from "@/services";

export async function fetchSchedules() {
  const { data } = await instance.get(`/schedule`);

  return data;
}

export async function getSchedule(id: string) {
  const { data } = await instance.get(`/schedule/${id}`);

  return data;
}

export async function deleteSchedule(id: string) {
  const { data } = await instance.delete(`/schedule/${id}`);

  return data;
}