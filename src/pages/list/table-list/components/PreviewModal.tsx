import React from 'react';
import { Modal, Button } from 'antd';
import ReactMarkdown from 'react-markdown';
import { ChapterItem } from './Step3';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  currentChapter: ChapterItem | null;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ open, onClose, currentChapter }) => {
  return (
    <Modal
      open={open}
      title={<span>预览章节 - {currentChapter?.templentChapterName}</span>}
      onCancel={onClose}
      footer={<Button onClick={onClose}>关闭</Button>}
      width={800}
      bodyStyle={{ maxHeight: '60vh', overflow: 'auto' }}
    >
      <ReactMarkdown>{currentChapter?.templentChapterContent}</ReactMarkdown>
    </Modal>
  );
};

export default PreviewModal; 