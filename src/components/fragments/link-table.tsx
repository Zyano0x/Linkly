"use client";

import React from "react";
import { getLinks } from "@/database/queries";
import { DataTableRowAction } from "@/types";
import { Link } from "@prisma/client";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DeleteTasksDialog } from "@/components/fragments/delete-link-dialog";
import { DownloadQrDialog } from "@/components/fragments/download-qr-dialog";
import { getColumns } from "@/components/fragments/link-table-columns";
import { TasksTableToolbarActions } from "@/components/fragments/link-table-toolbar-actions";
import { UpdateLinkSheet } from "@/components/fragments/update-link-sheet";

interface LinksTableProps {
  result: Awaited<ReturnType<typeof getLinks>>;
}

export default function LinkTable({ result }: LinksTableProps) {
  const { data, pageCount } = result;

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Link> | null>(null);

  const columns = React.useMemo(
    () => getColumns({ setRowAction }),
    [setRowAction],
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <section className="container py-20 grid items-center">
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={6}
            searchableColumnCount={0}
            filterableColumnCount={0}
            cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
            shrinkZero
          />
        }
      >
        <DataTable table={table}>
          <DataTableToolbar table={table}>
            <TasksTableToolbarActions table={table} />
          </DataTableToolbar>
        </DataTable>
        <UpdateLinkSheet
          open={rowAction?.type === "update"}
          onOpenChange={() => setRowAction(null)}
          link={rowAction?.row.original ?? null}
        />
        <DownloadQrDialog
          open={rowAction?.type === "download"}
          onOpenChange={() => setRowAction(null)}
          link={rowAction?.row.original ?? null}
        />
        <DeleteTasksDialog
          open={rowAction?.type === "delete"}
          onOpenChange={() => setRowAction(null)}
          links={rowAction?.row.original ? [rowAction?.row.original] : []}
          showTrigger={false}
          onSuccess={() => rowAction?.row.toggleSelected(false)}
        />
      </React.Suspense>
    </section>
  );
}
