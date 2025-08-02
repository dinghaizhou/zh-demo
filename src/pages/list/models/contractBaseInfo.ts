import { useState } from "react";
import { getContractBaseInfo, IContractBaseInfo, saveContractBase } from "../service";

export default () => {
  const [contractBaseInfo, setContractBaseInfo] =
    useState<IContractBaseInfo | null>(null);
  const [templentId, setTemplentId] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);
  const [submitLoading, setSubmitLoading] = useState<any>(false);

  const saveContentBaseInfo = async (
    info: IContractBaseInfo
  ) => {
    setSubmitLoading(true);
    const res = await saveContractBase({
      ...info
    })
    setSubmitLoading(false);
    setContractBaseInfo({...info});
    return res.data;
  };

  const getContractInfo = async (id: string) => {
    setLoading(true);
    getContractBaseInfo({ id }).then((res) => {
      setContractBaseInfo(res.data);
      setTemplentId(res.data.templentId);
      setLoading(false);
    });
  };

  const reset = () => {
    setTemplentId(null);
    setContractBaseInfo(null);
  }

  return {
    loading,
    submitLoading,
    templentId,
    setTemplentId,
    setContractBaseInfo,
    getContractInfo,
    contractBaseInfo,
    saveContentBaseInfo,
    reset
  };
};
