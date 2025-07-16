import React, { useState, useMemo, useEffect } from 'react';
import { Tree, Button, Alert, Typography } from 'antd';

const { Title, Paragraph } = Typography;
interface TreeNode {
  id: string;
  name: string;
  childTemplent?: TreeNode[];
}

interface TransformedNode extends TreeNode {
  title: string;
  key: string;
  children: TransformedNode[] | null;
}

function transformTreeData(data: TreeNode[]): TransformedNode[] {
  return data.map(item => ({
    ...item,
    title: item.name,
    key: item.id,
    disabled: item.childTemplent && item.childTemplent?.length > 0,
    children: item.childTemplent && item.childTemplent?.length > 0 ? transformTreeData(item.childTemplent) : null
  }));
}

// 递归查找节点名称
function findNodeTitleById(data: TreeNode[], id: string): string | null {
  for (const item of data) {
    if (item.id === id) return item.name;
    if (item.childTemplent) {
      const found = findNodeTitleById(item.childTemplent, id);
      if (found) return found;
    }
  }
  return null;
}

export default function Step1({ categoryTree = [], onNext, templentId }: { categoryTree: TreeNode[], onNext: (v:string) => void, templentId: string }) {
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [selectedTitle, setSelectedTitle] = useState('');
  
  useEffect(() => {
    if (!selectedKey && templentId) {
      setSelectedKey(templentId);
      const title = findNodeTitleById(categoryTree, templentId);
      if (title) setSelectedTitle(title);
    }
  }, [templentId, categoryTree]);

  const onSelect = (selectedKeys: any[], info: any) => {
    // 只允许选择最后一级
    if (info.node.children && info.node.children.length > 0) return;
    setSelectedKey(selectedKeys[0]);
    setSelectedTitle(info.node.title);
  };

  const _treeData = transformTreeData(categoryTree);
  const handleNextStep = () => {
    if (selectedKey) {
      onNext?.(selectedKey);
    }
  }

  return (
    <div>
      <Title level={3}>步骤一：项目初始化</Title>
      <Paragraph>
        请选择本次采购的类型。<b>本次POC演示主要支持服务类采购项目的文件生成。</b>
        <br />
        <span className="step-tip">提示：请选择最具体的采购类型（最后一级），上级分类仅用于导航。</span>
      </Paragraph>
      <Title level={4}>采购类型选择</Title>
      <div className="step-type-select">
        <Tree
          showLine
          className="step-type-tree"
          treeData={_treeData}
          onSelect={onSelect}
          selectedKeys={selectedKey ? [selectedKey] : []}
          defaultExpandAll
          autoExpandParent
        />
      </div>
      {selectedKey && (
        <Alert
          message={
            <>
              已选择采购类型：<a>{selectedTitle}</a>
            </>
          }
          type="info"
          showIcon
          className="step-alert"
        />
      )}
      <div className="step-btn-group">
        <Button type="primary" size="large" disabled={!selectedKey} onClick={handleNextStep}>
          下一步
        </Button>
      </div>
    </div>
  );
}