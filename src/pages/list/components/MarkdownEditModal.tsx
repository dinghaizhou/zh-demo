import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import ReactMarkdown from 'react-markdown';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { EditOutlined } from '@ant-design/icons';
import { ChapterItem } from '../service';
import remarkGfm from 'remark-gfm';

interface MarkdownEditModalProps {
  open: boolean;
  onOk: (v: string) => void;
  onCancel: () => void;
  currentChapter: ChapterItem | null;
  value?: string;
}

const MarkdownEditModal: React.FC<MarkdownEditModalProps> = ({
  open, onOk, onCancel, currentChapter
}) => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setContent(currentChapter?.templentChapterContent || '')
  }, [currentChapter, open])

  // 编辑器内容变化
  const handleEditorChange = ({ text }: { text: string }) => {
    setContent(text)
  };

  // 自定义渲染预览
  const renderHTML = (text: string) => {
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>;
  };

  const handleUpdate = async () => {
    onOk(content);
  }

  return (
    <Modal
      open={open}
      title={<span><EditOutlined style={{ marginRight: 8 }} />编辑章节 - {currentChapter?.templentChapterName}</span>}
      onOk={handleUpdate}
      onCancel={onCancel}
      width='80%'
      className="mdedit-modal"
      okText='确认更新'
      okButtonProps={{ loading: loading }}
      bodyStyle={{ height: '75vh', minHeight: 500 }}
    >
      <div className="mdedit-main">
        <div className="mdedit-editor-col">
          <div style={{ flex: 1, minHeight: 0 }}>
            <MdEditor
              plugins= {['link', 'clear', 'mode-toggle', 'full-screen']}
              value={content}
              style={{ height: '100%', minHeight: 350 }}
              renderHTML={renderHTML}
              onChange={handleEditorChange}
              view={{ menu: true, md: true, html: false }}
              
            />
          </div>
          
        </div>
      </div>
    </Modal>
  );
};

export default MarkdownEditModal; 