import axios from "axios";
import { toast } from "sonner";

export const forgot = async(email : string) => {
   const send = await axios.post<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/forgot`, {
     email
    })
    toast(send.data.msg);
  }