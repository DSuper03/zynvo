import axios from 'axios';
import { toast } from 'sonner';

export const res = async (oldPassword: string, newPassword: string) => {
  try {
    const res = await axios.put<any>(`/api/v1/user/reset-password`, {
      oldPassword,
      newPassword,
    });
    toast(res.data.msg);
  } catch (error: any) {
    const message =
      error?.response?.data?.msg ||
      error?.message ||
      'Failed to reset password. Please try again.';
    toast(message);
  }
};
