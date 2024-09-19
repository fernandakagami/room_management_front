import { instance } from "@/services";

export async function fetchFeatures() {
  const { data } = await instance.get(`/feature`);

  return data;
}

export async function createFeature(values: { name: string }) {
  const { data } = await instance.post(`/feature`, values);

  return data;
}

export async function updateFeature(id: string, values: { name: string }) {
  const { data } = await instance.put(`/feature/${id}`, values);

  return data;
}

export async function deleteFeature(id: string) {
  const { data } = await instance.delete(`/feature/${id}`);

  return data;
}