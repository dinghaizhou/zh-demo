import { Button, Form, Input, Radio, Typography } from "antd";
import { useEffect } from "react";
import { useModel } from "umi";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export default function Step2(props: any) {
  const { contractBaseInfo } = useModel("list.contractBaseInfo");
  const [form] = Form.useForm();

  useEffect(() => {
    if (contractBaseInfo) {
      form.setFieldsValue(contractBaseInfo);
    }
  }, [contractBaseInfo]);

  // 下一步、上一步事件（可根据props传递实现）
  const onFinish = (values: any) => {
    if (props.onNext) props.onNext(values);
  };
  const onPrev = () => {
    if (props.onPrev) props.onPrev();
  };

  return (
    <div className="step2-content">
      <Title level={3}>步骤二：导航表单填写</Title>
      <Paragraph>
        请填写采购项目的基本信息，这些信息将用于生成采购公告和相关章节内容。
      </Paragraph>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* 1. 采购项目简介 */}
        <Title level={5} className="step2-section-title">
          1. 采购项目简介
        </Title>
        <Form.Item
          label="1.1 采购项目名称"
          name="projectName"
          rules={[{ required: true, message: "请输入采购项目名称" }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="1.2 采购单位"
          name="procurementUnit"
          initialValue="中国宝原投资有限公司集采中心"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="1.3 采购代理机构（如有）"
          name="procurementAgent"
          initialValue="无"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="1.4 采购项目资金落实情况"
          name="fundingStatus"
          initialValue="本项目资金来源已落实，且具备竞争性谈判条件"
        >
          <TextArea disabled />
        </Form.Item>
        <Form.Item
          label="1.5 采购项目概况"
          name="productOverview"
          rules={[{ required: true, message: "请输入采购项目概况" }]}
        >
          <TextArea placeholder="请输入" autoSize />
        </Form.Item>
        <Form.Item label="1.6 成交供应商成交总金额" name="supplierContent">
          <Input placeholder="请输入" />
        </Form.Item>

        {/* 2. 采购范围及相关要求 */}
        <Title level={5} className="step2-section-title">
          2. 采购范围及相关要求
        </Title>
        <Form.Item
          label="2.1 采购范围"
          name="procurementScope"
          rules={[{ required: true, message: "请输入采购范围" }]}
        >
          <TextArea placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="2.2 服务期限"
          name="servicePeriod"
          rules={[{ required: true, message: "请输入服务期限" }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="2.3 服务地点" name="serviceLocation">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="2.4 质量要求或服务标准" name="serviceStandards">
          <TextArea placeholder="请输入" autoSize />
        </Form.Item>

        {/* 3. 供应商资格要求 */}
        <Title level={5} className="step2-section-title">
          3. 供应商资格要求
        </Title>
        <Form.Item
          label="3.1 供应商资格要求"
          name="supplierDemandTitle"
          rules={[{ required: true, message: "请选择供应商资格要求" }]}
        >
          <Radio.Group>
            <Radio value="01">01 财务要求</Radio>
            <Radio value="02">02 业绩要求</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="3.2 资格要求详细描述"
          name="supplierDemandRemark"
          rules={[{ required: true, message: "请输入资格要求详细描述" }]}
        >
          <TextArea placeholder="请根据所选要求，详细描述财务状况或项目业绩的具体标准" />
        </Form.Item>

        {/* 按钮区域 */}
        <Form.Item>
          <div className="step2-btn-group">
            <Button onClick={onPrev} size="large" className="step2-btn-prev">
              上一步
            </Button>
            <Button size="large" type="primary" htmlType="submit">
              下一步
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
