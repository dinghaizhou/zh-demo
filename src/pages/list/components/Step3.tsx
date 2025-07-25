import React, { useEffect, useState } from 'react';
import { Button, Tag, Modal } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import PreviewModal from './PreviewModal';
import AiOptimizeModal from './AiOptimizeModal';
import MarkdownEditModal from './MarkdownEditModal';
import { ChapterItem, initContractContent, saveContentBase} from '../service';


interface ChapterEditProps {
  contractBaseId: number,
  contractBaseInfo: any,
  onPrev: () => void,
  onNext: () => void,
  actionType: string
}

const ChapterEdit = (props: ChapterEditProps) => {
  const { contractBaseId, contractBaseInfo } = props;
  const [chapterList, setChapterList] = useState<Array<ChapterItem>>([]);
  const [currentChapter, setCurrentChapter] = useState<ChapterItem | null>(null);

  // 预览框
  const [previewVisible, setPreviewVisible] = useState(false);
  // ai编辑框
  const [aiModalVisible, setAiModalVisible] = useState(false);
  // markdown编辑框
  const [mdModalOpen, setmdModalVisible] = useState(false);

  useEffect(() => {
    if (contractBaseId) {
      initContractContent({ contractBaseId })
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
    } 
  }, [contractBaseId])

  const handlePreview = (chapter: ChapterItem) => {
    setCurrentChapter(chapter);
    setPreviewVisible(true);
  };

  const handleAiEdit = (chapter: ChapterItem) => {
    setAiModalVisible(true);
    setCurrentChapter(chapter);
  };

  const handleMarkdownEdit = (chapter: ChapterItem) => {
    setCurrentChapter(chapter);
    setmdModalVisible(true);
  };

  const handlePrev = () => {
    if (props.onPrev) props.onPrev();
  };

  const handleContentUpdate = async (value: string) => {
    let _contentList =  chapterList.map((item: ChapterItem) => {
      if (item.templentChapterId === currentChapter?.templentChapterId) {
        return {
          ...item,
          templentChapterContent: value
        }
      }
      return item
    })
    setChapterList(_contentList);
  };

  const handleAiEditorChange = (value: string) => {
    console.log('value', value);
  };

  const handleContentSave = async () => {
    await saveContentBase({
      contractBaseId,
      contractContents: chapterList
    })
    props?.onNext();
  }

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
        <Button onClick={handlePrev}>上一步</Button>
        <Button onClick={handleContentSave} type="primary">保存并进入下一步</Button>
      </div>
      <PreviewModal
        open={previewVisible}
        onClose={() => setPreviewVisible(false)}
        currentChapter={currentChapter}
      />
      <AiOptimizeModal
        open={aiModalVisible}
        onClose={() => setAiModalVisible(false)}
        onOk={() => setAiModalVisible(false)}
        currentChapter={currentChapter}
        contractBaseInfo={contractBaseInfo}
        onChange={handleAiEditorChange}
      />
      <MarkdownEditModal
        open={mdModalOpen}  
        onOk={(v) => {
          handleContentUpdate(v);
          setmdModalVisible(false);
        }}
        onCancel={() => setmdModalVisible(false)}
        currentChapter={currentChapter}
      />
    </>
  );
};

export default ChapterEdit;