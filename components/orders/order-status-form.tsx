"use client";

import { useTransition } from "react";
import { toast } from "sonner";

type Props = {
  orderId: string;
  currentStatus: string;
  updateStatusAction: (formData: FormData) => Promise<void>;
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PACKED: "bg-blue-100 text-blue-800 border-blue-200",
  DISPATCHED: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

export function OrderStatusForm({
  orderId,
  currentStatus,
  updateStatusAction,
}: Props) {
  const [isPending, startTransition] = useTransition();

  function handleChange(status: string) {
    const formData = new FormData();
    formData.set("orderId", orderId);
    formData.set("status", status);

    startTransition(async () => {
      try {
        await updateStatusAction(formData);
        toast.success("Order status updated");
      } catch {
        toast.error("Failed to update status");
      }
    });
  }

  return (
    <select
      defaultValue={currentStatus}
      disabled={isPending}
      onChange={(event) => handleChange(event.target.value)}
      className={`rounded-full border px-4 py-2 text-sm font-semibold outline-none disabled:opacity-60 ${
        statusStyles[currentStatus] || "bg-gray-100 text-gray-800 border-gray-200"
      }`}
    >
      <option value="PENDING">PENDING</option>
      <option value="PACKED">PACKED</option>
      <option value="DISPATCHED">DISPATCHED</option>
      <option value="DELIVERED">DELIVERED</option>
      <option value="CANCELLED">CANCELLED</option>
    </select>
  );
}