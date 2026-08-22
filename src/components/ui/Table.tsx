import type { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
}

export function Table({ children }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        {children}
      </table>
    </div>
  );
}

interface TableHeadProps {
  children: ReactNode;
}

export function TableHead({ children }: TableHeadProps) {
  return (
    <thead className="bg-slate-50">
      <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
        {children}
      </tr>
    </thead>
  );
}

interface TableHeaderCellProps {
  children: ReactNode;
}

export function TableHeaderCell({ children }: TableHeaderCellProps) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

export function TableRow({ children, className = "" }: TableRowProps) {
  return (
    <tr
      className={`border-t border-slate-100 transition-colors hover:bg-slate-50 ${className}`}
    >
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className = "" }: TableCellProps) {
  return <td className={`px-4 py-3 text-slate-700 ${className}`}>{children}</td>;
}