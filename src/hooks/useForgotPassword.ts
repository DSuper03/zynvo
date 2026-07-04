import axios from 'axios';
import { toast } from 'sonner';

export const forgot = async (email: string) => {
  try {
    const send = await axios.post<any>(`/api/v1/user/forgot`, { email });
    toast(send.data.msg);
  } catch (error: any) {
    const errorMsg =
      error?.response?.data?.msg || 'Something went wrong. Please try again.';
    toast(errorMsg);
  }
};
