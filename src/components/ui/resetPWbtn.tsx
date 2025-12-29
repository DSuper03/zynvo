'use client';

import { useRouter } from "next/navigation";
import { Button } from "./button";

export default function ResetBtn(){
    const router = useRouter()
    return (
        <div>
            <Button className="bg-yellow-400 text-black hover:bg-yellow-600"
            onClick={()=> {
                router.push('/reset-password')
            }}
            >Reset Password</Button>
        </div>
    )
}