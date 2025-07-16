import React from 'react';
import { Modal, Button, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';

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
  blocks: Block[];
}

const AiOptimizeModal: React.FC<AiOptimizeModalProps> = ({ open, onClose, onOk, blocks }) => {
  return (
    <Modal
      open={open}
      title={<span><EditOutlined style={{ marginRight: 8 }} />编辑章节 - 第一章-采购公告</span>}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>取消</Button>,
        <Button key="ok" type="primary" onClick={onOk}>确认更新</Button>
      ]}
      width={900}
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
    >
      {blocks.map((block, idx) => (
        <div key={idx} style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{idx + 1}. {block.title}</div>
          <Input.TextArea
            value={block.value}
            onChange={e => block.onChange(e.target.value)}
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