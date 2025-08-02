import { PageContainer, ProCard } from "@ant-design/pro-components";
import { useParams } from "@umijs/max";
import { Steps } from "antd";
import React, { useEffect, useState } from "react";
import { useModel } from "umi";
import Step1 from "../components/Step1";
import Step2 from "../components/Step2";
import Step3 from "../components/Step3";
import Step4 from "../components/Step4";
import { history } from "umi";
import { saveContractBase } from "../service";
import "./index.less";

const actionTypeName = {
  create: "新建",
  edit: "编辑",
};

const Details: React.FC = () => {
  const params = useParams();
  const actionType = params.id === "add" ? "create" : "edit";
  const [currentStep, setCurrentStep] = useState(0);
  const [contractBaseId, setContractBaseId] = useState<any>(params.id || null);
  const {
    contractBaseInfo,
    setTemplentId,
    getContractInfo,
    templentId,
    saveContentBaseInfo,
    reset
  } = useModel("list.contractBaseInfo");

  useEffect(() => {
    if (actionType === "edit" && params.id) {
      getContractInfo(params.id);
    } else {
      reset();
    }
  }, []);

  const handleStep1Submit = (value: string) => {
    setTemplentId(value);
    setCurrentStep(1);
  };

  const handleStep2Submit = async (value: any) => {
    const data = await saveContentBaseInfo({
      ...(contractBaseInfo || {}),
      ...value,
      templentId,
    })
    setCurrentStep(2);
    setContractBaseId(data);
  };

  const handleStep3Submit = () => {
    setCurrentStep(3);
  };

  const handleStep4Submit = () => {
    setCurrentStep(3);
    history.push('/list')
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };
  return (
    <PageContainer
      pageHeaderRender={() => {
        return <h2>{actionTypeName[actionType]} 大模型辅助采购生成</h2>;
      }}
    >
      <ProCard boxShadow style={{ marginTop: 20 }}>
        <Steps
          current={currentStep}
          onChange={(val) => {
            if (val < currentStep) setCurrentStep(val);
          }}
          items={[
            {
              title: "项目初始化",
              description: "选择采购类型",
            },
            {
              title: "导航表单填写",
              description: "填写项目基本信息",
            },
            {
              title: "章节内容生成",
              description: "生成和编辑章节内容",
            },
            {
              title: "整合与导出",
              description: "预览和导出文档",
            },
          ]}
        />
      </ProCard>
      <div className="step-content">
        <ProCard bordered>
          {currentStep === 0 && (
            <Step1 onNext={handleStep1Submit} templentId={templentId} />
          )}
          {currentStep === 1 && (
            <Step2 onPrev={handleBack} onNext={handleStep2Submit} />
          )}
          {currentStep === 2 && contractBaseId && (
            <Step3
              onPrev={handleBack}
              onNext={handleStep3Submit}
              contractBaseId={contractBaseId}
              actionType={actionType}
            />
          )}
          {currentStep === 3 && (
            <Step4
              onPrev={handleBack}
              onNext={handleStep4Submit}
              contractBaseId={contractBaseId}
              actionType={actionType}
            />
          )}
        </ProCard>
      </div>
    </PageContainer>
  );
};

export default Details;
