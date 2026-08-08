"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteShoeAction } from "../actions";

interface ShoeActionsProps {
  shoeId: number;
  shoeTitle?: string;
}

export function ShoeActions({ shoeId }: ShoeActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteShoeAction(shoeId);
      if (result.ok) {
        router.refresh();
      } else {
        alert(result.error || "删除失败");
      }
      setShowConfirm(false);
    });
  };

  return (
    <div className="flex shrink-0 items-center gap-1">
      <Link href={`/admin/shoes/${shoeId}/edit`}>
        <Button variant="ghost" size="icon-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
        </Button>
      </Link>

      {showConfirm ? (
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">确认删除？</span>
          <Button
            variant="destructive"
            size="xs"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "删除中..." : "确认"}
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setShowConfirm(false)}
            disabled={isPending}
          >
            取消
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setShowConfirm(true)}
          disabled={isPending}
          className="text-destructive hover:text-destructive"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </Button>
      )}
    </div>
  );
}
