"use client";

import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

export default function LeaveBtn({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);

  const handleLeave = async () => {
    try {
      setLoading(true);
      const leave = await axios.put<any>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/leaveClub`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(leave.data.msg);
    } catch (error) {
      toast.error("Error leaving club");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={handleLeave}
        disabled={loading}
        className={`px-6 py-3 font-semibold rounded-2xl border border-yellow-500 
        text-yellow-400 bg-black hover:bg-yellow-500 hover:text-black transition-all 
        duration-300 shadow-[0_0_15px_rgba(255,215,0,0.2)] ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Leaving..." : "🚪 Leave Club"}
      </button>
    </div>
  );
}
