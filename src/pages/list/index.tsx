import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type {
  ActionType,
  ProColumns,
} from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, Input, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import type { TableListItem, TableListPagination } from './data';
import { getContractBasePage, deleteContractBase } from './service';
import { history } from '@umijs/max';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      hideInSearch: true,
    },
    {
      title: '采购项目名称',
      dataIndex: 'projectName',
      ellipsis: true,
      formItemProps: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
    },
    {
      title: '采购数量',
      dataIndex: 'supplierContent',
      hideInSearch: true,
    },
    {
      title: '采购范围',
      dataIndex: 'procurementScope',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '服务期限',
      dataIndex: 'servicePeriod',
      hideInSearch: true,
    },
    {
      title: '服务地点',
      dataIndex: 'serviceLocation',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'modifiyTime',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 140,
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            handleEdit(record);
          }}
        >
          <EditOutlined style={{ marginRight: 4 }} />编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确认删除"
          description="确定要删除该条数据吗？"
          okText="确认"
          cancelText="取消"
          onConfirm={() => handleDelete(record)}
        >
          <a style={{ color: 'red', marginLeft: 8 }}>
            <DeleteOutlined style={{ marginRight: 4 }} />删除
          </a>
        </Popconfirm>,
      ],
    },
  ];

  const handleDelete = async (record: TableListItem) => {
    const res = await deleteContractBase({ id: record.id });
    if (res.status === 200) {
      message.success('删除成功');
      actionRef.current?.reloadAndRest?.();
    }
  }
  const handleEdit = (record: TableListItem) => {
    history.push(`/list/detail/${record.id}`);
  }

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        actionRef={actionRef}
        rowKey="key"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              history.push('/list/detail/add')
            }}
            style={{ marginLeft: 8 }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params) => {
          const res = await getContractBasePage({
            ...params,
            pageNum: params.current,
            pageSize: params.pageSize,
          })
          return {
            data: res.data.records || [],
            success: res.status === 200,
            total: res.data.total,
          }
        }}
        columns={columns}
        pagination={{ showQuickJumper: true }}
      />
    </PageContainer>
  );
};

export default TableList;
