import React, { useEffect, useState } from 'react';
import { Button, Tag, Modal } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import PreviewModal from './PreviewModal';
import AiOptimizeModal from './AiOptimizeModal';
import MarkdownEditModal from './MarkdownEditModal';
import { initContractContent } from '../service';

interface ChapterItem {
  contractBaseId: number,
  id: number, 
  templent: string,
  templentChapterContent: string,
  templentChapterId: number,
  templentChapterName: string,
  [key: string]: any
}

const ChapterEdit = (props: { contractBaseId: number }) => {
  const { contractBaseId = 150 } = props;
  const [chapterList, setChapterList] = useState([]);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [aiModalBlocks, setAiModalBlocks] = useState<any[]>([]);
  const [aiModalTitle, setAiModalTitle] = useState('');

  const [mdModalOpen, setMdModalOpen] = useState(false);
  const [mdValue, setMdValue] = useState('');
  const [mdTitle, setMdTitle] = useState('');

  useEffect(() => {
    // if (contractBaseId) {
      initContractContent({contractBaseId: 122})
      .then((res) => {
          if (res.status === 200) {
            let _data = res.data.map((item: ChapterItem, index: number) => {
              return {
                ...item,
                aiSupport: !![0, 4].includes(index),
                disabled: +index === 4,
                status: '已完成',
                description: [0, 4].includes(index) ? '支持AI优化和分点编辑' : '通用Markdown编辑器'
              }
            })
            setChapterList(_data)
          }
      })
    // }
  }, [contractBaseId])

  const handlePreview = (chapter: ChapterItem) => {
    setPreviewContent(chapter.templentChapterContent || '');
    setPreviewTitle(chapter.templentChapterName || '');
    setPreviewVisible(true);
  };

  const handleAiEdit = (chapter: ChapterItem) => {
    // 这里只做简单mock，实际可根据chapter内容动态生成blocks
    setAiModalTitle(`编辑章节 - ${chapter.templentChapterName}`);
    setAiModalBlocks([
      {
        title: '项目描述/范围',
        value: '',
        onChange: (v: string) => {},
        onAiClick: () => {},
        placeholder: '请输入项目描述/范围...'
      },
      {
        title: '质量要求/服务标准',
        value: '',
        onChange: (v: string) => {},
        onAiClick: () => {},
        placeholder: '请输入质量要求/服务标准...'
      }
    ]);
    setAiModalVisible(true);
  };

  const handleMarkdownEdit = (chapter: ChapterItem) => {
    setMdTitle(chapter.templentChapterName);
    setMdValue(chapter.templentChapterContent || '');
    setMdModalOpen(true);
  };

  const onPrev = () => {
    if (props.onPrev) props.onPrev();
  };


  return (
    <>
      <Title level={3}>步骤三：章节内容生成与编辑</Title>
      {chapterList.map((chapter: ChapterItem, idx) => (
        <div key={chapter.templentChapterId} className="step3-chapter-row">
          <div className="step3-chapter-info">
            <div className="step3-chapter-title-row">
              <span className="step3-chapter-title">{chapter.templentChapterName}</span>
              <Tag color="green" className="step3-chapter-status">{chapter.status}</Tag>
            </div>
            <div className="step3-chapter-desc">{chapter.description}</div>
          </div>
          <div className="step3-chapter-btns">
            <Button icon={<EyeOutlined />} onClick={() => handlePreview(chapter)}>预览</Button>
            <Button
              disabled={chapter.disabled}
              type={chapter.aiSupport ? 'primary' : 'default'}
              className={chapter.aiSupport ? 'step3-btn-ai' : 'step3-btn'}
              icon={<EditOutlined />}
              onClick={chapter.aiSupport ? () => handleAiEdit(chapter) : () => handleMarkdownEdit(chapter)}
            >
              {chapter.aiSupport ? '编辑/AI 优化' : '编辑'}
            </Button>
          </div>
        </div>
      ))}
      <div className="step3-btn-group">
        <Button onClick={onPrev}>上一步</Button>
        <Button type="primary">保存并进入下一步</Button>
      </div>
      <PreviewModal
        open={previewVisible}
        title={previewTitle}
        content={previewContent}
        onClose={() => setPreviewVisible(false)}
      />
      <AiOptimizeModal
        open={aiModalVisible}
        onClose={() => setAiModalVisible(false)}
        onOk={() => setAiModalVisible(false)}
        blocks={aiModalBlocks}
      />
      <MarkdownEditModal
        open={mdModalOpen}
        title={mdTitle}
        value={mdValue}
        onChange={setMdValue}
        onOk={() => setMdModalOpen(false)}
        onCancel={() => setMdModalOpen(false)}
      />
    </>
  );
};

export default ChapterEdit;