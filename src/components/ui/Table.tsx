import { forwardRef, HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'

const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-auto">
      <table
        ref={ref}
        className={`w-full caption-bottom text-sm border-collapse border border-amber-300 ${className || ''}`}
        {...props}
      />
    </div>
  )
)
Table.displayName = 'Table'

const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead 
      ref={ref} 
      className={`bg-amber-100 border-b border-amber-300 ${className || ''}`} 
      {...props} 
    />
  )
)
TableHeader.displayName = 'TableHeader'

const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={`bg-parchment ${className || ''}`}
      {...props}
    />
  )
)
TableBody.displayName = 'TableBody'

const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={`bg-amber-50 border-t border-amber-300 font-medium ${className || ''}`}
      {...props}
    />
  )
)
TableFooter.displayName = 'TableFooter'

const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={`border-b border-amber-200 transition-colors hover:bg-amber-50 data-[state=selected]:bg-amber-100 ${className || ''}`}
      {...props}
    />
  )
)
TableRow.displayName = 'TableRow'

const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={`h-12 px-4 text-left align-middle font-medium text-amber-900 border-r border-amber-300 last:border-r-0 ${className || ''}`}
      {...props}
    />
  )
)
TableHead.displayName = 'TableHead'

const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={`p-4 align-middle text-amber-900 border-r border-amber-200 last:border-r-0 ${className || ''}`}
      {...props}
    />
  )
)
TableCell.displayName = 'TableCell'

const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={`mt-4 text-sm text-amber-700 ${className || ''}`}
      {...props}
    />
  )
)
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
}