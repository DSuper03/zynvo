import axios from "axios";
import { toast } from "sonner";

export const res = async(oldPassword : string, newPassword :string) => {
   const res = await axios.post<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/reset-password`, {
        oldPassword,
        newPassword,
      });
      toast(res.data.msg) 
    }