import axios from "axios";
import { toast } from "sonner";

export const res = async(oldPassword : string, newPassword :string) => {
  try {
    const res = await axios.post<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/reset-password`, {
      oldPassword,
      newPassword,
    });
    toast(res.data.msg);
  } catch (error: any) {
    // Attempt to show a specific error message if available, otherwise show a generic one
    const message = error?.response?.data?.msg || error?.message || "Failed to reset password. Please try again.";
    toast(message);
  }
}