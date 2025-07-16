import React from 'react';
import { Modal } from 'antd';
import ReactMarkdown from 'react-markdown';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

interface MarkdownEditModalProps {
  open: boolean;
  title?: string;
  value: string;
  onChange: (v: string) => void;
  onOk: () => void;
  onCancel: () => void;
}

const MarkdownEditModal: React.FC<MarkdownEditModalProps> = ({
  open, title, value, onChange, onOk, onCancel
}) => {
  // 编辑器内容变化
  const handleEditorChange = ({ text }: { text: string }) => {
    onChange(text);
  };

  // 自定义渲染预览
  const renderHTML = (text: string) => {
    return <ReactMarkdown>{text}</ReactMarkdown>;
  };

  return (
    <Modal
      open={open}
      title={title}
      onOk={onOk}
      onCancel={onCancel}
      width='80%'
      style={{ top: '20px' }}
      bodyStyle={{ height: '75vh', minHeight: 500 }}
    >
      <div style={{ display: 'flex', height: '100%', flexDirection: 'row', gap: 16 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            <MdEditor
              value={value}
              style={{ height: '100%', minHeight: 350 }}
              renderHTML={renderHTML}
              onChange={handleEditorChange}
              view={{ menu: true, md: true, html: false }}
              config={{ view: { menu: true, md: true, html: false } }}
            />
          </div>
        </div>
        {/* <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>实时预览</div>
          <div style={{ flex: 1, overflow: 'auto', background: '#fafbfc', borderRadius: 4, padding: 12, border: '1px solid #eee' }}>
            <ReactMarkdown>{value}</ReactMarkdown>
          </div>
        </div> */}
      </div>
    </Modal>
  );
};

export default MarkdownEditModal; 