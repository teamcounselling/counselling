import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Edit, 
  CheckCircle, 
  XCircle, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

export interface Action<T> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success' | 'warning';
  onClick: (item: T) => void;
  show?: (item: T) => boolean;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  primaryKey: keyof T;
  title?: string;
  subtitle?: string;
  addButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'admin' | 'student' | 'college' | 'success' | 'warning';
  };
  statusLegend?: Array<{
    label: string;
    className: string;
  }>;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  actions = [],
  primaryKey,
  title,
  subtitle,
  addButton,
  statusLegend,
  className = ''
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPrimaryKeyValue = (item: T): string => {
    const value = item[primaryKey];
    return typeof value === 'string' ? value : String(value);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {(title || addButton) && (
        <div className="flex justify-between items-center">
          <div>
            {title && <h2 className="text-2xl font-semibold text-foreground">{title}</h2>}
            {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          {addButton && (
            <Button 
              variant={addButton.variant || 'default'} 
              onClick={addButton.onClick}
              className="gap-2"
            >
              {addButton.icon}
              {addButton.label}
            </Button>
          )}
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((item) => (
              <TableRow key={getPrimaryKeyValue(item)}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render ? column.render(item) : String(item[column.key as keyof T] || '')}
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell>
                    <div className="flex items-center justify-end space-x-2">
                      {actions
                        .filter(action => !action.show || action.show(item))
                        .slice(0, 3) // Show first 3 actions as buttons
                        .map((action) => (
                          <Button
                            key={action.key}
                            variant={action.variant || 'outline'}
                            size="sm"
                            onClick={() => action.onClick(item)}
                            className={`h-8 ${action.icon ? 'w-8 p-0' : 'px-3'} ${action.className || ''}`}
                          >
                            {action.icon}
                            {!action.icon && action.label}
                          </Button>
                        ))}
                      
                      {actions.length > 3 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {actions
                              .filter(action => !action.show || action.show(item))
                              .slice(3) // Show remaining actions in dropdown
                              .map((action) => (
                                <DropdownMenuItem 
                                  key={action.key}
                                  onClick={() => action.onClick(item)}
                                  className={action.className}
                                >
                                  {action.icon && <span className="mr-2">{action.icon}</span>}
                                  {action.label}
                                </DropdownMenuItem>
                              ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Status Legend */}
      {statusLegend && statusLegend.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {data.length} entries</p>
          <div className="flex items-center space-x-4">
            <span>Status Legend:</span>
            <div className="flex items-center space-x-2">
              {statusLegend.map((legend, index) => (
                <Badge key={index} className={legend.className}>
                  {legend.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Common action creators
export const createViewAction = <T,>(
  onClick: (item: T) => void,
  label: string = 'View Details'
): Action<T> => ({
  key: 'view',
  label,
  icon: <Eye className="w-4 h-4" />,
  variant: 'outline',
  onClick,
  className: 'h-8 w-8 p-0'
});

export const createEditAction = <T,>(
  onClick: (item: T) => void,
  label: string = 'Edit'
): Action<T> => ({
  key: 'edit',
  label,
  icon: <Edit className="w-4 h-4" />,
  variant: 'outline',
  onClick,
  className: 'h-8 w-8 p-0'
});

export const createApproveAction = <T,>(
  onClick: (item: T) => void,
  label: string = 'Approve'
): Action<T> => ({
  key: 'approve',
  label,
  icon: <CheckCircle className="w-4 h-4" />,
  variant: 'success',
  onClick,
  className: 'h-8 px-3'
});

export const createRejectAction = <T,>(
  onClick: (item: T) => void,
  label: string = 'Reject'
): Action<T> => ({
  key: 'reject',
  label,
  icon: <XCircle className="w-4 h-4" />,
  variant: 'destructive',
  onClick,
  className: 'h-8 px-3'
});

// Common status badge renderer
export const createStatusBadgeRenderer = (statusMap: Record<string, string>) => {
  return (item: any) => {
    const status = item.status;
    const className = statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    return (
      <Badge className={`${className} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
};
