"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, Trash2, Pencil, Eye } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T extends { id: string }> {
  title: string;
  description?: string;
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  createHref?: string;
  createLabel?: string;
  onDelete?: (id: string) => void;
  editHref?: (id: string) => string;
  viewHref?: (id: string) => string;
  searchField?: keyof T;
}

export default function DataTable<T extends { id: string }>({
  title,
  description,
  columns,
  data,
  loading,
  createHref,
  createLabel = "Tambah Baru",
  onDelete,
  editHref,
  viewHref,
  searchField,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search || !searchField) return data;
    return data.filter((item) => {
      const val = item[searchField];
      if (typeof val === "string") return val.toLowerCase().includes(search.toLowerCase());
      return true;
    });
  }, [data, search, searchField]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-teal-deep">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {createHref && (
          <Link href={createHref}>
            <Button className="bg-teal hover:bg-teal-dark gap-2">
              <Plus className="w-4 h-4" />
              {createLabel}
            </Button>
          </Link>
        )}
      </div>

      {/* Search */}
      {searchField && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Table */}
      <div className="border rounded-xl bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              {columns.map((col) => (
                <TableHead key={col.key} className="text-xs font-semibold uppercase tracking-wider">
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </TableCell>
                  ))}
                  <TableCell />
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-12 text-muted-foreground">
                  Belum ada data.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/20">
                  {columns.map((col) => (
                    <TableCell key={col.key} className="text-sm">
                      {col.render
                        ? col.render(item)
                        : String((item as Record<string, unknown>)[col.key] ?? "-")}
                    </TableCell>
                  ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        <MoreHorizontal className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {viewHref && (
                          <Link href={viewHref(item.id)} className="w-full">
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Eye className="w-4 h-4" /> Lihat
                            </DropdownMenuItem>
                          </Link>
                        )}
                        {editHref && (
                          <Link href={editHref(item.id)} className="w-full">
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Pencil className="w-4 h-4" /> Edit
                            </DropdownMenuItem>
                          </Link>
                        )}
                        {onDelete && (
                          <DropdownMenuItem
                            className="text-destructive gap-2"
                            onClick={() => onDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4" /> Hapus
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Menampilkan {filtered.length} dari {data.length} data
      </p>
    </div>
  );
}
