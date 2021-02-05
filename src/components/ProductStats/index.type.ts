export interface FilterConfirmProps {
  closeDropdown: boolean;
}

export interface ColumnFilterItem {
  text: React.ReactNode;
  value: string | number | boolean;
  children?: ColumnFilterItem[];
}

export interface FilterDropdownProps {
  prefixCls: string;
  setSelectedKeys: (selectedKeys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: (param: FilterConfirmProps) => void;
  clearFilters: () => void;
  filters?: ColumnFilterItem[];
  visible: boolean;
}

export interface IProductStats {
  form: any;
}
