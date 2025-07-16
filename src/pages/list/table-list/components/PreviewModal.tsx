import React from 'react';
import { Modal, Button } from 'antd';
import ReactMarkdown from 'react-markdown';

interface PreviewModalProps {
  open: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ open, title, content, onClose }) => {
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onClose}
      footer={<Button onClick={onClose}>关闭</Button>}
      width={800}
      bodyStyle={{ maxHeight: '60vh', overflow: 'auto' }}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </Modal>
  );
};

export default PreviewModal; 