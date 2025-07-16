export type TableListItem = {
  id: number;
  key: number;
  createTime: string;
  creator: string;
  isDeleted: string;
  modifier: string;
  modifiyTime: string;
  procurementScope: string;
  productOverview: string;
  projectName: string;
  serviceLocation: string;
  servicePeriod: string;
  serviceStandards: string;
  status: string;
  supplierContent: string;
  supplierDemandRemark: string;
  supplierDemandTitle: string;
  templentId: number;
  tenantId: number | null;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
