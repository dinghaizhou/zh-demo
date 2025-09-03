import React, { useEffect, useState } from 'react';
import { Button, message, Modal } from 'antd';
import ReactMarkdown from 'react-markdown';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { EditOutlined, RobotOutlined } from '@ant-design/icons';
import { ChapterItem, getAiOptimize } from '../service';
import remarkGfm from 'remark-gfm';
import { useModel } from 'umi';

interface MarkdownEditModalProps {
  open: boolean;
  onOk: (v: string) => void;
  onCancel: () => void;
  currentChapter: ChapterItem | null;
  currentChapterIndex: number;
}

const MarkdownEditModal: React.FC<MarkdownEditModalProps> = ({
  open, onOk, onCancel, currentChapter, currentChapterIndex
}) => {
  const [content, setContent] = useState('')
  const [ailoading, setAiLoading] = useState(false);
  const {
    contractBaseInfo,
  } = useModel("list.contractBaseInfo");
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

  const handleAiWrite = async () => {
    try {
      setAiLoading(true);
      const res = await getAiOptimize({
        type: 'chapter',
        content: contractBaseInfo?.productOverview || '',
        templentId: contractBaseInfo?.templentId
      });
      if (res.status === 200) {
        setContent(res.data)
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error('AI 优化失败');
    } finally {
      setAiLoading(false);
    }
  }

  const handleCancel = () => {
    setAiLoading(false);
    onCancel()
  }

  return (
    <Modal
      destroyOnClose
      open={open}
      title={<span><EditOutlined style={{ marginRight: 8 }} />编辑章节 - {currentChapter?.templentChapterName}</span>}
      onOk={handleUpdate}
      onCancel={handleCancel}
      width='80%'
      className="mdedit-modal"
      okText='确认更新'
      cancelText="取消"
      bodyStyle={{ height: '75vh', minHeight: 500 }}
      footer={<>
        <Button onClick={handleCancel}>取消</Button>
        {currentChapterIndex === 4 && <Button loading={ailoading} icon={<RobotOutlined />} onClick={() => handleAiWrite()}>AI 帮我写</Button>}
        <Button disabled={ailoading} onClick={handleUpdate}>确认更新</Button>
      </>}
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
              view={{ menu: true, md: true, html: true }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MarkdownEditModal; 