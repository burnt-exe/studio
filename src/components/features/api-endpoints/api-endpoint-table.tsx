
"use client";

import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from '@/components/common/icons';
import type { ApiEndpoint } from '@/lib/api-endpoints-data';

interface ApiEndpointTableProps {
  endpoints: ApiEndpoint[];
  onSelectEndpoint: (endpoint: ApiEndpoint) => void;
}

type SortKey = keyof ApiEndpoint | null;
type SortOrder = 'asc' | 'desc';

export function ApiEndpointTable({ endpoints, onSelectEndpoint }: ApiEndpointTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const sortedEndpoints = useMemo(() => {
    if (!sortKey) return endpoints;
    
    const sorted = [...endpoints].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return valA.localeCompare(valB);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return valA - valB;
      }
      return 0;
    });

    return sortOrder === 'asc' ? sorted : sorted.reverse();
  }, [endpoints, sortKey, sortOrder]);

  const handleSort = (key: keyof ApiEndpoint) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (key: keyof ApiEndpoint) => {
    if (sortKey !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortOrder === 'asc' ? <ArrowUpDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4" />; // TODO: Proper up/down arrows
  };
  
  const getMethodBadgeVariant = (method: ApiEndpoint['method']) => {
    switch (method) {
      case 'GET': return 'default'; // bg-primary (indigo)
      case 'POST': return 'secondary'; // bg-secondary (lighter indigo)
      case 'PUT': return 'outline'; // text-foreground, border
      case 'DELETE': return 'destructive';
      default: return 'default';
    }
  };


  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort('name')}>
              <div className="flex items-center">
                Name {getSortIcon('name')}
              </div>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px] text-center cursor-pointer" onClick={() => handleSort('method')}>
              <div className="flex items-center justify-center">
                Method {getSortIcon('method')}
              </div>
            </TableHead>
            <TableHead className="w-[250px]">Path</TableHead>
            <TableHead className="w-[120px] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEndpoints.map((endpoint) => (
            <TableRow key={endpoint.id}>
              <TableCell className="font-medium">{endpoint.name}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{endpoint.description}</TableCell>
              <TableCell className="text-center">
                <Badge variant={getMethodBadgeVariant(endpoint.method)} className="font-mono text-xs">
                  {endpoint.method}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">{endpoint.path}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => onSelectEndpoint(endpoint)}>
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
