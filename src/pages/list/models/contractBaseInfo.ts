import { useState } from "react";
import { getContractBaseInfo, IContractBaseInfo, saveContractBase } from "../service";

export default () => {
  const [contractBaseInfo, setContractBaseInfo] =
    useState<IContractBaseInfo | null>(null);
  const [templentId, setTemplentId] = useState<any>(null);

  const saveContentBaseInfo = async (
    info: IContractBaseInfo
  ) => {
    const res = await saveContractBase({
      ...info
    })
    setContractBaseInfo({...info});
    return res.data;
  };

  const getContractInfo = async (id: string) => {
    getContractBaseInfo({ id }).then((res) => {
      setContractBaseInfo(res.data);
      setTemplentId(res.data.templentId);
    });
  };

  return {
    templentId,
    setTemplentId,
    setContractBaseInfo,
    getContractInfo,
    contractBaseInfo,
    saveContentBaseInfo
  };
};
