import React from "react";
import { StatusEnum } from "@/database/schema";
import { DataTableRowAction } from "@/types";
import { Link } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, Ellipsis, Eye, Pencil, QrCode, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { formatDate, getStatusIcon } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table/data-tabale-column-header";

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Link> | null>
  >;
}

export function getColumns({
  setRowAction,
}: GetColumnsProps): ColumnDef<Link>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={"Select all"}
          className={"translate-y-0.5"}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={"Selected row"}
          className={"translate-y-0.5"}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Link Code"} />
      ),
      cell: ({ row }) => <div className={"w-20"}>{row.getValue("code")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "originalUrl",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Original Url" />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <a
            href={row.getValue("originalUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-[31.25rem] truncate font-medium text-blue-500 hover:text-blue-400 visited:text-blue-500"
          >
            {row.getValue("originalUrl")}
          </a>
        </div>
      ),
    },
    {
      accessorKey: "shortUrl",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Short Url" />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <a
            href={row.getValue("shortUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-[31.25rem] truncate font-medium text-blue-500 hover:text-blue-400 visited:text-blue-500"
          >
            `${process.env.NEXT_PUBLIC_BASE_URL}/${row.getValue("shortUrl")}`
          </a>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = StatusEnum.options.find(
          (status) => status === row.original.status,
        );

        if (!status) return null;

        const Icon = getStatusIcon(status);

        return (
          <div className="flex w-[6.25rem] items-center">
            <Icon
              className="mr-2 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="capitalize">{status}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "clicks",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Clicks" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-[6.25rem] items-center">
            <Eye
              className="mr-2 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="capitalize">{row.getValue("clicks")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        // const [isUpdatePending, startUpdateTransition] = React.useTransition();

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, type: "update" })}
              >
                Edit
                <DropdownMenuShortcut>
                  <Pencil className="size-4 text-muted-foreground" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  navigator.clipboard
                    .writeText(row.getValue("shortUrl"))
                    .then(() => {
                      toast.success("Copied");
                    })
                    .catch(() => toast.error("Failed"));
                }}
              >
                Copy
                <DropdownMenuShortcut>
                  <Copy className="size-4 text-muted-foreground" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, type: "download" })}
              >
                Qr Code
                <DropdownMenuShortcut>
                  <QrCode className="size-4 text-muted-foreground" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, type: "delete" })}
              >
                Delete
                <DropdownMenuShortcut>
                  <Trash2 className="size-4 text-muted-foreground" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
