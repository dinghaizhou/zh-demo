import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';

const steps = [
  {
    index: 1,
    title: '步骤一：项目初始化',
    desc: '流程始于项目初始化。用户首先选择本次采购的类型（POC）和采购“服务类”类型，系统会基于该选择，智能匹配并初始化结构化的采购文件章节结构与导航表模板，为后续的结构细化信息采集奠定基础。',
  },
  {
    index: 2,
    title: '步骤二：导航表单填写',
    desc: '系统提供一个多步骤的导航式表单，用户需按照步骤填写基础信息、采购信息、项目特点等结构化数据（如技术参数、以及供应商准入标准等），系统将结构化的数据整合后续章节内容生成的基础。',
  },
  {
    index: 3,
    title: '步骤三：章节内容生成',
    desc: '这是本系统的核心。系统采用混合模式生成采购文件章节内容：对于“第一章 项目概况及公司/管理要求”等采购专业内容，利用知识库和大模型，结合知识与用户填写数据智能创作；对于“第二、三、四章”等标准内容，则进行模板化数据填充。',
  },
  {
    index: 4,
    title: '步骤四：整合与导出',
    desc: '所有章节生成后，系统会自动整合为一份完整的采购文件草案。提供在线预览与富文本编辑功能，支持用户进行最终内容查阅与修改。确认无误后，一键导出为PDF或Word格式，归档或直接进行提交。',
  },
];

const highlights = [
  {
    title: '混合式内容引擎',
    desc: '将大模型（AI）的灵活性与固化模板的确定性相结合。既能确保动态内容（如采购需求、服务标准）的专业创新，又能保证标准内容（如合同条款、固定声明）的绝对准确无误。',
  },
  {
    title: '基于知识库的专业Prompt',
    desc: '内置了行业标杆案例与专业知识库，结合采购场景精细化设计的Prompt指令集，引导AI生成高质量的行业规范和商业标准的专业文案，避免了通用模型的“空话套话”。',
  },
  {
    title: '人机协作的编辑流程',
    desc: 'AI生成内容后，提供实时在线预览与富文本编辑功能。用户可以随时补充个性化内容，对特定段落进行调整与改动，实现“AI赋能而非取代人”的高效协作模式，确保最终文档100%符合需求。',
  },
];

const StepCard: React.FC<{ index: number; title: string; desc: string }> = ({ index, title, desc }) => {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
        margin: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#1677ff',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: 18,
            marginRight: 12,
          }}
        >
          {index}
        </div>
        <div style={{ fontSize: 16, color: token.colorTextHeading, fontWeight: 500 }}>{title}</div>
      </div>
      <div style={{ fontSize: 14, color: token.colorTextSecondary, textAlign: 'justify' }}>{desc}</div>
    </div>
  );
};

const HighlightCard: React.FC<{ title: string; desc: string }> = ({ title, desc }) => {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        background: token.colorBgContainer,
        borderRadius: 8,
        boxShadow: token.boxShadowSecondary,
        padding: '18px 20px',
        flex: 1,
        minWidth: 220,
        margin: '8px',
      }}
    >
      <div style={{ fontWeight: 500, fontSize: 16, color: token.colorTextHeading, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: token.colorTextSecondary, textAlign: 'justify' }}>{desc}</div>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  return (
    <PageContainer>
      <Card
        style={{ borderRadius: 8 }}
        styles={{
          body: {
            backgroundImage:
              initialState?.settings?.navTheme === 'realDark'
                ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
                : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
          },
        }}
      >
        <div style={{ padding: '8px 0 24px 0' }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: token.colorTextHeading, marginBottom: 8 }}>
            欢迎使用 智能采购文件生成系统（POC）
          </div>
          <div style={{ fontSize: 15, color: token.colorTextSecondary, marginBottom: 24, lineHeight: '24px', width: '90%' }}>
            本系统致力于解决传统采购文件编制申报时，易错、繁琐、标准化难的问题。我们通过结合前端引导式表单、固定模板填充与大模型（AI）智能生成的混合模式，将繁琐的文档生产流程提化、自动化。用户只需按照引导完成结构信息输入，即可一键生成结构完整、内容准确、专业规范的采购文件，显著提升企业采购工作的效率与合规性。
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {steps.map((step) => (
              <StepCard key={step.index} {...step} />
            ))}
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: token.colorTextHeading, margin: '32px 0 16px 0' }}>
            核心亮点
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {highlights.map((item, idx) => (
              <HighlightCard key={idx} {...item} />
            ))}
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
