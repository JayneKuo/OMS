export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'ko' | 'zh-CN' | 'zh-TW';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface TreeSelectOption extends SelectOption {
  children?: TreeSelectOption[];
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface TableColumn {
  label: string;
  prop: string;
  width?: number | string;
  minWidth?: number;
  fixed?: boolean | 'left' | 'right';
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  formatter?: (row: any, column: TableColumn, cellValue: any, index: number) => string;
}
