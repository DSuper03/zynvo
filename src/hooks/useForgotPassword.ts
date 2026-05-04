import axios from "axios";
import { toast } from "sonner";

export const forgot = async(email : string) => {
  try {
    const send = await axios.post<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/forgot`, {
      email
    });
    toast(send.data.msg);
  } catch (error: any) {
    // Try to show a specific error message if available, otherwise show a generic one
    const errorMsg = error?.response?.data?.msg || "Something went wrong. Please try again.";
    toast(errorMsg);
  }
}