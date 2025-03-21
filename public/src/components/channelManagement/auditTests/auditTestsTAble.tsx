import React from 'react';
import { AuditDataRow } from './AuditTestsButton';

interface AuditTestsTableProps {
  rows: AuditDataRow[];
}

export const AuditTestsTable: React.FC<AuditTestsTableProps> = ({ rows }: AuditTestsTableProps) => {
  console.log('Rows in AuditTestsTable', rows);

  return <div style={{ width: '100%' }}>{console.log('rows', rows)}</div>;
};
