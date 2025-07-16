import {
  PageContainer,
  ProCard,
  ProFormInstance,
} from "@ant-design/pro-components";
import { useParams } from "@umijs/max";
import { Steps, Spin } from "antd";
import React, { useRef, useState, useEffect } from "react";
import Step1 from "../components/Step1";
import Step2 from "../components/Step2";
import Step3 from "../components/Step3";
import { getCategoryTree, saveContractBase, getContractBaseInfo } from "../service"; 
import "./index.less";
import Base from "antd/es/typography/Base";

const actionTypeName = {
  create: "新建",
  edit: "编辑",
};

const Details: React.FC = () => {
  const params = useParams();
  const actionType = params.id === "add" ? "create" : "edit";
  const [currentStep, setCurrentStep] = useState(0);
  const [categoryTree, setCategoryTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [templentId, setTemplentId] = useState<any>(null);
  const [contractBaseId, setContractBaseId] = useState<any>(params.id || null);
  const [contractBaseInfo, setContractBaseInfo] = useState<any>(null);

  useEffect(() => {
    getCategoryTree().then((res) => {
      setLoading(false);
      setCategoryTree(res.data);
    });
    if (actionType === "edit") {
      getContractBaseInfo({ id: params.id }).then((res) => {
        console.log('res', res);
        setContractBaseInfo(res.data);
        setTemplentId(res.data.templentId);
      });
    }
  }, []);

  const handleStep1Submit = (value: string) => {
    setTemplentId(value);
    setCurrentStep(1);
  }

  const handleStep2Submit = (value: any) => {
    saveContractBase({
      ...value,
      templentId,
      id: contractBaseId
    }).then((res) => {
      console.log('res', res);
      setContractBaseId(res.data);
      setCurrentStep(2);
      setContractBaseInfo({
        ...contractBaseInfo,
        ...value,
      });
    })
  }

  const handleStep3Submit = (value: any) => {
    console.log("value", value);
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  }
  return (
    <PageContainer
      pageHeaderRender={() => {
        return <h2>{actionTypeName[actionType]} 大模型辅助采购生成</h2>;
      }}
    >
      <ProCard boxShadow style={{marginTop: 20}}>
        <Steps
          current={currentStep}
          onChange={
            (val) => {
              if(val < currentStep) setCurrentStep(val);
            }
          }
          items={[
            {
              title: '项目初始化',
              description: '选择采购类型',
            },
            {
              title: '导航表单填写',
              description: '填写项目基本信息',
            },
            {
              title: '章节内容生成',
              description: '生成和编辑章节内容',
            },
            {
              title: '整合与导出',
              description: '预览和导出文档',
            },
          ]}
        />
      </ProCard>
      <div className="step-content"> 
        <ProCard
          bordered
        >
          <Spin spinning={loading} size="large">
            { currentStep === 0 && categoryTree.length > 0 && 
            <Step1 
              categoryTree={categoryTree} 
              onNext={handleStep1Submit}
              templentId={templentId}
            /> }
            { currentStep === 1 && 
            <Step2 
              onPrev={handleBack} 
              onNext={handleStep2Submit}
              contractBaseInfo={contractBaseInfo}
            /> }
            { currentStep === 2 && 
            <Step3 
              onPrev={handleBack} 
              onNext={handleStep3Submit} 
              contractBaseId={contractBaseId}
            /> }
          </Spin>
        </ProCard>
      </div>
    </PageContainer>
  );
};

export default Details;
