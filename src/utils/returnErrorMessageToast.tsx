export function returnErrorMessageToast(error: any) {
  const message: string[] = Object.values(error.response.data);

  return message[0];
}