import React, { useEffect, useState } from 'react';
import { Modal, Button, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { IContractBaseInfo, ChapterItem } from '../service';

interface Block {
  title: string;
  value: string;
  onChange: (v: string) => void;
  onAiClick: () => void;
  placeholder?: string;
}

interface AiOptimizeModalProps {
  open: boolean;
  onClose: () => void;
  onOk: () => void;
  currentChapter: ChapterItem | null;
  onChange: (v: string) => void;
  contractBaseInfo: IContractBaseInfo
}

const AiOptimizeModal: React.FC<AiOptimizeModalProps> = ({ open, onClose, onOk, currentChapter, onChange, contractBaseInfo }) => {
  const [blocks, setBlocks] = useState<any[]>([]);
  useEffect(() => {
    setBlocks([
      {
        title: '项目描述/范围',
        key: 'productOverview',
        value: contractBaseInfo.productOverview,
        placeholder: '请输入项目描述/范围...'
      },
      {
        title: '质量要求/服务标准',
        key: 'serviceStandards',
        value: contractBaseInfo.serviceStandards,
        placeholder: '请输入质量要求/服务标准...'
      }
    ])
    
  }, [open])

  const handleChange = (v: string) => {

  }

  return (
    <Modal
      open={open}
      title={<span><EditOutlined style={{ marginRight: 8 }} />编辑章节 - 第一章-采购公告</span>}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>取消</Button>,
        <Button key="ok" type="primary" onClick={onOk}>确认更新</Button>
      ]}
      width="80%"
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
    >
      {blocks.map((block, idx) => (
        <div key={idx} style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{idx + 1}. {block.title}</div>
          <Input.TextArea
            value={block.value}
            onChange={e => handleChange(e.target.value)}
            autoSize={{ minRows: 4, maxRows: 10 }}
            placeholder={block.placeholder}
          />
          <div style={{ textAlign: 'right', marginTop: 8 }}>
            <Button icon={<EditOutlined />} onClick={block.onAiClick}>AI 帮我写</Button>
          </div>
        </div>
      ))}
    </Modal>
  );
};

export default AiOptimizeModal; 