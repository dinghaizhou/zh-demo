import { FileTextOutlined } from "@ant-design/icons";
import { Button, Card, Col, Descriptions, Row, Spin, Tag, message } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useModel } from "umi";
import { ChapterItem } from "../service";
import { exportMarkdownToWord } from "../utils/wordExport";
import PreviewModal from "./PreviewModal";

interface Step4Props {
  contractBaseId: string;
  onPrev: () => void;
  onNext: () => void;
  actionType: string;
}

const Step4 = (props: Step4Props) => {
  const { contractBaseId } = props;
  const [chapterList, setChapterList] = useState<Array<ChapterItem>>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const { contractBaseInfo, getContractInfo, loading } = useModel(
    "list.contractBaseInfo"
  );

  useEffect(() => {
    getContractInfo(contractBaseId);
  }, [contractBaseId]);

  useEffect(() => {
    if (contractBaseInfo?.contentList) {
      setChapterList(contractBaseInfo.contentList);
    }
  }, [contractBaseInfo]);

  // 拼接所有章节内容
  const getFullDocumentContent = () => {
    if (!chapterList || chapterList.length === 0) {
      return "";
    }
    return chapterList
      .sort((a, b) => a.templentChapterId - b.templentChapterId) // 按章节ID排序
      .map((chapter) => {
        const content = chapter.templentChapterContent || "";
        return `${content}`;
      })
      .join("\n");
  };

  // 使用docx结构化导出Word文档
  const handleDownloadWord = async () => {
    const content = getFullDocumentContent();
    if (!content) {
      message.warning("暂无文档内容可导出");
      return;
    }

    setExportLoading(true);
    try {
      console.log('contractBaseInfo', contractBaseInfo)
      await exportMarkdownToWord(
        content,
        contractBaseInfo?.projectName || "采购文档",
        {
          projectName: contractBaseInfo?.projectName,
          procurementUnit: contractBaseInfo?.procurementUnit || '中国宝原投资有限公司集采中心',
          servicePeriod: contractBaseInfo?.servicePeriod,
          serviceLocation: contractBaseInfo?.serviceLocation,
        }
      );
      message.success("Word文档导出成功");
    } catch (error) {
      console.error("导出Word文档失败:", error);
      message.error("导出失败，请重试");
    } finally {
      setExportLoading(false);
    }
  };

  const handlePrev = () => {
    if (props.onPrev) props.onPrev();
  };

  const handleFinish = () => {
    message.success("文档生成完成！");
    if (props.onNext) props.onNext();
  };

  // 计算字符数
  const getCharCount = (content: string) => {
    return content ? content.length : 0;
  };

  return (
    <>
      <Title level={3}>步骤四：整合与导出</Title>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 16, color: "#666", marginBottom: 16 }}>
          文档生成完成！您可以预览完整的采购文件内容，并选择导出格式。
        </p>
      </div>
      <Spin spinning={loading} size="large" tip="数据加载中">
        {/* 项目信息摘要 */}
        <Card title="项目信息摘要" style={{ marginBottom: 24 }}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="项目名称" span={2}>
              {contractBaseInfo?.projectName ||
                "大连中核凯利企业管理有限责任公司车辆定点维修保养服务采购项目"}
            </Descriptions.Item>
            <Descriptions.Item label="采购单位">
              {contractBaseInfo?.procurementUnit ||
                "中国宝原投资有限公司集采中心"}
            </Descriptions.Item>
            <Descriptions.Item label="服务期限">
              {contractBaseInfo?.servicePeriod || ""}
            </Descriptions.Item>
            <Descriptions.Item label="服务地点" span={2}>
              {contractBaseInfo?.serviceLocation || "辽宁省大连市"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 章节完成情况 */}
        <Card title="章节完成情况" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              {chapterList
                .slice(0, Math.ceil(chapterList.length / 2))
                .map((chapter, index) => (
                  <div
                    key={chapter.templentChapterId}
                    className="step4-chapter-item"
                  >
                    <div className="step4-chapter-header">
                      <span className="step4-chapter-name">
                        {chapter.templentChapterName}
                      </span>
                      <Tag color="green">已完成</Tag>
                    </div>
                    <div className="step4-chapter-info">
                      <span className="step4-chapter-count">
                        {getCharCount(chapter.templentChapterContent)} 字符
                      </span>
                    </div>
                  </div>
                ))}
            </Col>
            <Col span={12}>
              {chapterList
                .slice(Math.ceil(chapterList.length / 2))
                .map((chapter, index) => (
                  <div
                    key={chapter.templentChapterId}
                    className="step4-chapter-item"
                  >
                    <div className="step4-chapter-header">
                      <span className="step4-chapter-name">
                        {chapter.templentChapterName}
                      </span>
                      <Tag color="green">已完成</Tag>
                    </div>
                    <div className="step4-chapter-info">
                      <span className="step4-chapter-count">
                        {getCharCount(chapter.templentChapterContent)} 字符
                      </span>
                    </div>
                  </div>
                ))}
            </Col>
          </Row>
        </Card>

        {/* 文档预览 */}
        <Card title="文档预览" style={{ marginBottom: 24 }}>
          <div className="step4-document-preview">
            <div className="step4-preview-content">
              {chapterList && chapterList.length > 0 ? (
                <div className="react-markdown-viewer">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {getFullDocumentContent()}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="step4-preview-placeholder">
                  <FileTextOutlined
                    style={{ fontSize: 48, color: "#d9d9d9" }}
                  />
                  <p style={{ color: "#999", marginTop: 16 }}>暂无文档内容</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* 操作按钮 */}
        <div className="step4-btn-group">
          <div className="step4-btn-left">
            <Button size="large" onClick={handlePrev}>
              上一步
            </Button>
          </div>
          <div className="step4-btn-right">
            <Button
              size="large"
              icon={<FileTextOutlined />}
              onClick={handleDownloadWord}
              loading={exportLoading}
            >
              导出Word
            </Button>
            <Button size="large" type="primary" onClick={handleFinish}>
              提交
            </Button>
          </div>
        </div>
      </Spin>

      {/* 预览模态框 */}
      <PreviewModal
        open={previewVisible}
        onClose={() => setPreviewVisible(false)}
        currentChapter={null}
        fullDocumentContent={getFullDocumentContent()}
      />
    </>
  );
};

export default Step4;
