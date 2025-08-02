import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Modal } from 'antd';
import { ChapterItem } from '../service';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  currentChapter: ChapterItem | null;
  fullDocumentContent?: string;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  open,
  onClose,
  currentChapter,
  fullDocumentContent
}) => {
  return (
    <Modal
      title="文档预览"
      open={open}
      onCancel={onClose}
      footer={null}
      width="80%"
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
      destroyOnHidden
    >
      <div className='react-markdown-viewer' style={{ padding: '20px', background: 'white' }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {fullDocumentContent || currentChapter?.templentChapterContent}
        </ReactMarkdown>
      </div>
    </Modal>
  );
};

export default PreviewModal; 