import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { ChapterItem, getAiOptimize } from '../service';
import { useModel } from 'umi';

interface AiOptimizeModalProps {
  open: boolean;
  onClose: () => void;
  onOk: () => void;
  currentChapter: ChapterItem | null;
  onChange: (v: string) => void;
}

const AiOptimizeModal: React.FC<AiOptimizeModalProps> = ({ open, onClose, onOk, currentChapter, onChange }) => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const {
    saveContentBaseInfo,
    contractBaseInfo,
    submitLoading
  } = useModel("list.contractBaseInfo");
  useEffect(() => {
    setBlocks([
      {
        title: '项目描述/范围',
        key: 'productOverview',
        value: contractBaseInfo?.productOverview,
        placeholder: '请输入项目描述/范围...',
        type: 'ov'
      },
      {
        title: '质量要求/服务标准',
        key: 'serviceStandards',
        value: contractBaseInfo?.serviceStandards,
        placeholder: '请输入质量要求/服务标准...',
        type: 'req'
      }
    ])
    
  }, [open])

  const handleChange = (v: string, index: number) => {
    blocks[index].value = v;
    setBlocks([...blocks]);
  }

  const handleSubmit = async () => {
    if (contractBaseInfo) {
      await saveContentBaseInfo({
        ...contractBaseInfo,
        productOverview: blocks[0].value,
        serviceStandards: blocks[1].value,
      });
      message.success('更新成功');
      onOk();
    }
  }

  const handleAiWrite = async (block: any) => {
    if (!block.value) {
      message.warning('请先输入内容');
      return;
    }
    const res = await getAiOptimize({
      content: block.value,
      type: block.type
    });
  }

  return (
    <Modal
      open={open}
      title={<span><EditOutlined style={{ marginRight: 8 }} />编辑章节 - 第一章-采购公告</span>}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>取消</Button>,
        <Button key="ok" type="primary" onClick={handleSubmit} loading={submitLoading}>确认更新</Button>
      ]}
      width="80%"
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
    >
      {blocks.map((block, idx) => (
        <div key={idx} style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{idx + 1}. {block.title}</div>
          <Input.TextArea
            value={block.value}
            onChange={e => handleChange(e.target.value, idx)}
            autoSize={{ minRows: 4, maxRows: 10 }}
            placeholder={block.placeholder}
          />
          <div style={{ textAlign: 'right', marginTop: 8 }}>
            <Button icon={<EditOutlined />} onClick={() => handleAiWrite(block)}>AI 帮我写</Button>
          </div>
        </div>
      ))}
    </Modal>
  );
};

export default AiOptimizeModal; 