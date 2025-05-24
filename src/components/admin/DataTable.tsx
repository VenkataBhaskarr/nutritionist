import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: { key: keyof T | string; label: string }[];
  actions: {
    view?: (id: number) => void;
    edit?: (item: T) => void;
    delete?: (id: number) => void;
  };
  onAdd: () => void;
  renderCell?: (key: string, item: T) => React.ReactNode;
}

const DataTable = <T extends { id: number }>({
  title,
  data,
  columns,
  actions,
  onAdd,
  renderCell,
}: DataTableProps<T>) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <Button
            size="sm"
            className="bg-primary-500 hover:bg-primary-600"
            onClick={onAdd}
          >
            Add {title.slice(0, -1)}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {columns.map((col) => (
                  <th key={col.key as string} className="py-3 px-2 text-left font-medium text-gray-500">
                    {col.label}
                  </th>
                ))}
                <th className="py-3 px-2 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    {columns.map((col) => (
                      <td key={col.key as string} className="py-3 px-2">
                        {renderCell ? renderCell(col.key as string, item) : (item[col.key as keyof T] as React.ReactNode)}
                      </td>
                    ))}
                    <td className="py-3 px-2">
                      <div className="flex space-x-2">
                        {actions.view && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => actions.view!(item.id)}
                          >
                            View
                          </Button>
                        )}
                        {actions.edit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => actions.edit!(item)}
                          >
                            Edit
                          </Button>
                        )}
                        {actions.delete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => actions.delete!(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="py-3 px-2 text-center text-gray-500">
                    No {title.toLowerCase()} found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
