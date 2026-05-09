"use client";

import { toast } from "sonner";
import { useTransition } from "react";

type Props = {
  action: () => Promise<void>;
};

export function DeletePaymentButton({ action }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        await action();

        toast.success("Payment deleted successfully");
      } catch {
        toast.error("Failed to delete payment");
      }
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleDelete}
      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}