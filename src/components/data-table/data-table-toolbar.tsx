import React from "react";
import { Table } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  return (
    <div
      className={cn("flex w-full items-center justify-end p-1", className)}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
