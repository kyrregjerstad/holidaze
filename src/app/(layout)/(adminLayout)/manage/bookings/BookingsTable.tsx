'use client';

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Booking = {
  id: string;
  dateFrom: Date;
  dateTo: Date;
  totalPrice: number;
  guests: number;
  customer: {
    name: string;
    avatar: {
      url: string;
      alt: string;
    } | null;
    banner: {
      url: string;
      alt: string;
    } | null;
  } | null;
  venue: {
    name: string;
    id: string;
  };
};

type Props = {
  bookings: Booking[];
  deleteVenue: (venueId: string) => Promise<boolean>;
};

export const BookingsTable = ({ bookings }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo(() => createColumns(), []);

  const table = useReactTable({
    data: bookings,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className=" w-full max-w-[100vw] p-4 sm:max-w-[calc(100vw_-_200px)]">
      <div className="flex items-center py-4">
        <div className="flex gap-2">
          <Input
            placeholder="Filter by venue name..."
            value={(table.getColumn('venue')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('venue')?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <span>Columns</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

function createColumns(): ColumnDef<Booking>[] {
  return [
    {
      id: 'venue',
      accessorKey: 'venue',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="gap-2"
          >
            <span>Venue</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const url = `/manage/venues/${row.original.venue.id}`;
        const value: { name: string } = row.getValue('venue');

        return (
          <Link href={url} className="whitespace-nowrap text-nowrap px-4 lowercase hover:underline">
            {value.name}
          </Link>
        );
      },
    },
    {
      accessorKey: 'customer',
      enableSorting: true,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="gap-2"
          >
            Customer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value: { name: string; avatar: { url: string; alt: string } | null } =
          row.getValue('customer');

        return (
          <div className="flex items-center px-4">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage
                src={value.avatar?.url ?? '/avatar-placeholder.svg'}
                alt={value.avatar?.alt ?? 'Avatar'}
              />
              <AvatarFallback className="h-8 w-8 rounded-full bg-gray-200">
                {value.name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Link href={`/profiles/${value.name}`} className="ml-2 hover:underline">
              {value.name}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: 'dateFrom',
      enableSorting: true,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="gap-2"
          >
            Check in
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value: Date = row.getValue('dateFrom');
        return <div className="px-4">{value.toDateString()}</div>;
      },
    },
    {
      accessorKey: 'dateTo',
      enableSorting: true,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="gap-2"
          >
            Check out
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value: Date = row.getValue('dateTo');
        return <div className="px-4">{value.toDateString()}</div>;
      },
    },
    {
      accessorKey: 'totalDays',
      enableSorting: true,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="gap-2"
          >
            Days
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value: number = row.getValue('totalDays');
        return <div className="px-4">{value}</div>;
      },
    },
    {
      accessorKey: 'guests',
      enableSorting: true,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="gap-2"
          >
            Guests
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value: number = row.getValue('guests');
        return <div className="px-4">{value}</div>;
      },
    },
    {
      accessorKey: 'totalPrice',
      enableSorting: true,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="gap-2"
          >
            Total Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value: number = row.getValue('totalPrice');
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
        return <div className="px-4">{formatted}</div>;
      },
    },
  ];
}
