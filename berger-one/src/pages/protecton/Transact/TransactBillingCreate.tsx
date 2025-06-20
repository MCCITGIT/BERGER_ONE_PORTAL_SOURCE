import { useEffect, useState } from "react";
import Select from "react-select";
import { UseAuthStore } from "../../../services/store/AuthStore";
import * as common from "../../../services/api/users/UserProfile";
import * as Epca from "../../../services/api/protectonEpca/EpcaList";
import * as EpcaDtl from "../../../services/api/protectonEpca/EpcaDetails";
import * as PotentialLead from "../../../services/api/protectonTransact/TransactPotentialLead";
import * as Billing from "../../../services/api/protectonTransact/TransactBilling";
import AsyncSelectBox from "./Components/AsyncSelectBox";
import { FiTrash2 } from "react-icons/fi";
import { FaRegPaperPlane } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { commonErrorToast, commonSuccessToast } from "../../../services/functions/commonToast";
import { useNavigate } from 'react-router-dom';

const TransactBillingCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({
    regionList: [],
    depotList: [],
    terrList: [],
    custList: [],
    billToList: [],
    selectedRegion: "",
    selectedDepot: "",
    selectedTerr: "",
    selectedCust: "",
    pd_appl_yn: "N",
    selectedBillTo: "",
    project_appl_yn: "",
    TlvBal: [],
    projectList: [],
    selectedProject: 0,
  });

  const [billingPayload, setBillingPayload] = useState<any>({
    bill_to_code: '',
    project_id: '',
    billing_sku: [],
  });

  const [billingSkuPayload, setBillingSkuPayload] = useState<any>({
    bpd_sku_id: '',
    bpd_stock: '',
    bpd_declared_rate: '',
    bpd_approved_rate: '',
    bpd_no_of_pack: 1,
    bpd_total_amount: '',
    remarks: '', // current api does not have this field - just for handeling the reamrks input
    sku_label: '', // for displaying the sku name in the table - not using in API
    pack_size: '' // for displaying the in the table - not using in API
  });

  const [asyncSelectBoxData, setAsyncSelectBoxData] = useState<any>(null);

  const [PCASkuBillingDetails, setPCASkuBillingDetails] = useState<any>(null);

  const [showRestBasedOnProject, setShowRestBasedOnProject] = useState<boolean>(false);

  const user = UseAuthStore((state: any) => state.userDetails);

  const GetRegion = async () => {
    setLoading(true);
    const data: any = {
      user_group: user.group_code,
      app_id: "15",
      user_appl_yn: "Y",
    };
    try {
      const response: any = await common.GetProtectonRegion(data);
      setData((prevData: any) => ({
        ...prevData,
        regionList: response.data.table || [],
        selectedRegion: "",
        selectedDepot: "",
        selectedTerr: "",
        selectedCust: "",
        billToList: [],
        depotlist: [],
        terrlist: [],
        custlist: [],
        billtolist: [],
        selectedBillTo: "",
        project_appl_yn: "",
        TlvBal: [],
        projectList: [],
        selectedProject: 0,
      }));
      setAsyncSelectBoxData(null)
    } catch (error) {
      return;
    }
    setLoading(false);
  };

  const Getdepot = async (region: string) => {
    setLoading(true);

    const payload: any = {
      user_id: user.user_id,
      region: region,
      app_id: "15",
    };
    try {
      const response: any = await Epca.GetApplicableDepotList(payload);
      setData((prevData: any) => ({
        ...prevData,
        depotList: response.data || [],
        selectedRegion: region,
        selectedDepot: "",
        selectedTerr: "",
        selectedCust: "",
        billToList: [],
        terrlist: [],
        custlist: [],
        billtolist: [],
        selectedBillTo: "",
        project_appl_yn: "",
        TlvBal: "",
        projectList: [],
        selectedProject: 0,
      }));
      setAsyncSelectBoxData(null)
      setPCASkuBillingDetails(null)
    } catch (error) {
      return;
    }
    setLoading(false);
  };

  const GetTerr = async (depot: string) => {
    setLoading(true);
    const payload: any = {
      region: data.selectedRegion,
      depot_code: depot,
      app_id: "15",
      user_appl_yn: "Y",
    };
    try {
      const response: any = await common.GetProtectonApplicableTerr(payload);
      setData((prevData: any) => ({
        ...prevData,
        terrList: response.data.table || [],
        selectedDepot: depot,
        selectedTerr: "",
        selectedCust: "",
        billToList: [],
        custlist: [],
        billtolist: [],
        selectedBillTo: "",
        project_appl_yn: "",
        TlvBal: "",
        projectList: [],
        selectedProject: 0,
      }));
      setAsyncSelectBoxData(null)
      setPCASkuBillingDetails(null)
    } catch (error) {
      return;
    }
    setLoading(false);
  };

  const GetCust = async (terr: string) => {
    setLoading(true);
    const payload: any = {
      depot_regn: data.selectedRegion,
      depot_code: data.selectedDepot,
      terr_code: terr,
      app_id: "15",
      user_appl_yn: "Y",
    };
    try {
      const response: any = await Epca.GetUserApplicableDealer(payload);
      setData((prevData: any) => ({
        ...prevData,
        custList: response.data.table || [],
        selectedTerr: terr,
        selectedCust: "",
        billToList: [],
        billtolist: [],
        selectedBillTo: "",
        project_appl_yn: "",
        TlvBal: "",
        projectList: [],
        selectedProject: 0,
      }));
      setAsyncSelectBoxData(null)
      setPCASkuBillingDetails(null)
    } catch (error) {
      return;
    }
    setLoading(false);
  };

  const GetBillTo = async (cust: string, pd_appl_yn: string) => {
    setLoading(true);
    const payload: any = {
      depot_code: data.selectedDepot,
      dealer_code: cust,
      app_id: "15",
      pd_appl_yn: pd_appl_yn,
    };
    try {
      const response: any = await PotentialLead.PCADtlsBillto(payload);
      setData((prevData: any) => ({
        ...prevData,
        billToList: response.data.table || [],
        selectedCust: cust,
        pd_appl_yn: pd_appl_yn,
        selectedBillTo: "",
        TlvBal: "",
        project_appl_yn: "",
        projectList: [],
        selectedProject: 0,
      }));
      setAsyncSelectBoxData(null)
      setPCASkuBillingDetails(null)
      setBillingPayload({
        bill_to_code: '',
        project_id: '',
        billing_sku: [],
      })

    } catch (error) {
      return;
    }
    setLoading(false);
  };

  const GetProjectList = async (payload?: any) => {
    setLoading(true);
    try {
      const response: any = await Epca.GetProjectList(payload);
      setData((prevData: any) => ({
        ...prevData,
        projectList: response.data.table || [],
        selectedProject: 0,
      }));
    } catch (error) {
      return;
    }
    setLoading(false);
  };

  const GetBillingTLVBalance = async (selectedBillToItem: any) => {
    setLoading(true);
    if (selectedBillToItem.project_appl_yn == 'N') {
      setShowRestBasedOnProject(true)
    }
    else {
      setShowRestBasedOnProject(false)
    }

    const payload: any = {
      bill_to: selectedBillToItem.bill_to,
      app_id: "15",
      depot_code: data.selectedDepot,
      dealer_code: data.selectedCust,
    };
    try {
      const response: any = await Billing.GetBillingTLVBalance(payload);

      // Store the bill_to value before state update
      const billToValue = selectedBillToItem.bill_to;
      setData((prevData: any) => ({
        ...prevData,
        TlvBal: response.data.table[0] || [],
        project_appl_yn: selectedBillToItem.project_appl_yn,
        selectedBillTo: selectedBillToItem.bill_to,
        projectList: [],
        selectedProject: 0,
      }));

      setAsyncSelectBoxData(null)
      setPCASkuBillingDetails(null)

      setBillingPayload(() => ({
        bill_to_code: billToValue,
        project_id: "",
        billing_sku: [],
      }))

      const projectPayload: any = {
        billto_code: billToValue,
        app_id: "15",
      };
      await GetProjectList(projectPayload);
    } catch (error) {
      return;
    }
    setLoading(false);
  };

  const GetPCASkuBillingDetails = async (asyncSelectBoxData: any) => {
    if (!asyncSelectBoxData) {
      return;
    }
    const payload: any = {
      billto_code: data.selectedBillTo,
      sku_code: asyncSelectBoxData.selectedOption.value,
      depot_code: data.selectedDepot,
      project_id: data.selectedProject,
    };

    try {
      const response: any = await PotentialLead.GetPCASkuBillingDetails(payload);
      setPCASkuBillingDetails(response.data.table[0] || []);
      setBillingSkuPayload((pre: any) => ({
        ...pre, bpd_approved_rate: response.data.table[0].min_rate, bpd_stock: response.data.table[0].stock, pack_size: asyncSelectBoxData.selectedObj[0].sku_pack_size,
        bpd_declared_rate: response.data.table[0].min_rate, bpd_sku_id: response.data.table[0].sku, sku_label: asyncSelectBoxData.selectedOption.label,
        bpd_total_amount: response.data.table[0].min_rate * asyncSelectBoxData.selectedObj[0].sku_pack_size * pre.bpd_no_of_pack,
      }))
    } catch (error) {
      return;
    }
  }

  const handleAdd = () => {

    // check if billingSkuPayload.bpd_sku_id already exists in billingPayload - if already exist, show alert and return
    const existingSku = billingPayload.billing_sku.find((item: any) => item.bpd_sku_id === billingSkuPayload.bpd_sku_id);
    if (existingSku) {
      commonErrorToast('Duplicate entry not allowed');
      return;
    }


    // 1. Update billingPayload.billing_sku by appending billingSkuPayload
    setBillingPayload((prev: { billing_sku: any; }) => ({
      ...prev,
      billing_sku: [...prev.billing_sku, billingSkuPayload],
    }));

    // 2. (Optional) Reset your SKU form payload back to its initial shape
    setBillingSkuPayload({
      bpd_sku_id: '',
      bpd_stock: '',
      bpd_declared_rate: '',
      bpd_approved_rate: '',
      bpd_no_of_pack: 1,
      bpd_total_amount: '',
      remarks: '',
      sku_label: '',
      pack_size: ''
    });
    setAsyncSelectBoxData(null)
    setPCASkuBillingDetails(null)
  }

  const handleRemove = (indexToRemove: number) => {
    setBillingPayload((prev: { billing_sku: any[]; }) => ({
      ...prev,
      billing_sku: prev.billing_sku.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSubmit = async () => {
    const response: any = await Billing.InsertBillingSKU(billingPayload);
    if (response.success) {
      commonSuccessToast('Billing Request Submitted Successfully');
      navigate('/Protecton/Transact/TransactBilling');
    }
    else {
      commonErrorToast('Billing Request Failed');
    }
  }


  useEffect(() => {
    GetRegion();
  }, []);

  useEffect(() => {
    GetPCASkuBillingDetails(asyncSelectBoxData)
  }, [asyncSelectBoxData]);


  return (
    <>
      <div className="page-titlebar flex items-center justify-between bg-white px-4 py-1">
        <h5 className="text-lg font-semibold dark:text-white-light">
          Billing Request
        </h5>
      </div>

      <div className="bg-white rounded-lg px-4 py-2 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Region:</label>
            <Select
              className="text-sm"
              isSearchable={true}
              options={[
                ...data.regionList.map((d: any) => ({
                  value: d.depot_regn,
                  label: d.regn_new,
                })),
              ]}
              value={
                data.selectedRegion
                  ? { value: data.selectedRegion, label: data.selectedRegion }
                  : null
              }
              onChange={(event) => {
                Getdepot(event?.value);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Depot:</label>
            <Select
              className="text-sm"
              isSearchable={true}
              options={[
                ...data.depotList.map((d: any) => ({
                  value: d.depot_code,
                  label: d.depot_name,
                })),
              ]}
              value={
                data.selectedDepot
                  ? {
                    value: data.selectedDepot,
                    label: data.depotList.find(
                      (d: any) => d.depot_code === data.selectedDepot
                    )?.depot_name,
                  }
                  : null
              }
              onChange={(event) => {
                GetTerr(event?.value);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Territory:
            </label>
            <Select
              className="text-sm"
              isSearchable={true}
              options={[
                ...data.terrList.map((d: any) => ({
                  value: d.terr_code,
                  label: d.terr_name,
                })),
              ]}
              value={
                data.selectedTerr
                  ? {
                    value: data.selectedTerr,
                    label: data.terrList.find(
                      (d: any) => d.terr_code === data.selectedTerr
                    )?.terr_name,
                  }
                  : null
              }
              onChange={(event) => {
                GetCust(event?.value);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Customer:
            </label>
            <Select
              className="text-sm"
              isSearchable={true}
              options={[
                ...data.custList.map((d: any) => ({
                  value: d.dealer_code,
                  label: d.dealer_name,
                })),
              ]}
              value={
                data.selectedCust
                  ? {
                    value: data.selectedTerr,
                    label: data.custList.find(
                      (d: any) => d.dealer_code === data.selectedCust
                    )?.dealer_name,
                  }
                  : null
              }
              onChange={(event) => {
                GetBillTo(event?.value, data.pd_appl_yn);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              PD Applicable:
            </label>
            <Select
              className="text-sm"
              isSearchable={true}
              options={[
                { value: "Y", label: "YES" },
                { value: "N", label: "NO" },
              ]}
              value={
                data.pd_appl_yn
                  ? {
                    value: data.pd_appl_yn,
                    label: data.pd_appl_yn === "Y" ? "YES" : "NO",
                  }
                  : null
              }
              onChange={(event) => {
                GetBillTo(data.selectedCust, event?.value);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Bill To:</label>
            <Select
              className="text-sm"
              isSearchable={true}
              options={[
                ...data.billToList.map((d: any) => ({
                  value: d.bill_to,
                  label: d.bill_to_name,
                })),
              ]}
              value={
                data.selectedBillTo
                  ? {
                    value: data.selectedBillTo,
                    label: data.billToList.find(
                      (d: any) => d.bill_to === data.selectedBillTo
                    )?.bill_to_name,
                  }
                  : null
              }
              onChange={(event) => {
                const selectedBillToItem = data.billToList.find(
                  (d: any) => d.bill_to === event?.value
                );
                GetBillingTLVBalance(selectedBillToItem);
              }}
            />
          </div>
        </div>
      </div>

      <div>
        {data.TlvBal != "" && (
          <>
            <div className=" mt-4 bg-white rounded-lg px-4 py-2 shadow-md ">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="flex items-center">
                  <label className="block text-xs font-semibold mr-2 whitespace-nowrap">
                    Available Balance:
                  </label>
                  <input
                    type="text"
                    className="w-full rounded text-xs border-none p-1"
                    value={data.TlvBal.avl_balance}
                    readOnly
                  />
                </div>
                <div className="flex items-center">
                  <label className="block text-xs font-semibold mr-2">
                    TLV:
                  </label>
                  <input
                    type="text"
                    className="w-full rounded text-xs border-none p-1"
                    value={data.TlvBal.tlv_value}
                    readOnly
                  />
                </div>
                <div className="flex items-center">
                  <label className="block text-xs font-semibold mr-2 whitespace-nowrap">
                    Credit Days:
                  </label>
                  <input
                    type="text"
                    className="w-full rounded text-xs border-none p-1"
                    value={data.TlvBal.credit_days}
                    readOnly
                  />
                </div>
                <div className="flex items-center">
                  <label className="block text-xs font-semibold mr-2">
                    OS:
                  </label>
                  <input
                    type="text"
                    className="w-full rounded text-xs border-none p-1"
                    value={data.TlvBal.os_amount}
                    readOnly
                  />
                </div>
                <div className="flex items-center">
                  <label className="block text-xs font-semibold mr-2">
                    ODOS:
                  </label>
                  <input
                    type="text"
                    className="w-full rounded text-xs border-none p-1"
                    value={data.TlvBal.odos_amount}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 mt-2 pt-2 border-t-2 gap-4 mb-4">

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Search Project:
                    {data.project_appl_yn == 'Y' && (
                      <span className="text-red-600 font-bold">*</span>)}
                  </label>
                  <Select
                    className="text-sm"
                    isSearchable={true}
                    isDisabled={data.selectedProject != 0}
                    options={[
                      ...data.projectList.map((d: any) => ({
                        value: d.projectId,
                        label: d.projectName,
                      })),
                    ]}
                    value={
                      data.selectedProject
                        ? {
                          value: data.selectedProject,
                          label:
                            data.projectList.find((d: any) => d.projectId === data.selectedProject)
                              ?.projectName || "—",
                        }
                        : null
                    }
                    onChange={(event) => {
                      setData((prevData: any) => ({
                        ...prevData,
                        selectedProject: event?.value,
                      }));
                      setBillingPayload((prevData: any) => ({
                        ...prevData,
                        project_id: event?.value,
                      }))
                      setShowRestBasedOnProject(true)
                    }}
                  />
                </div>

                {showRestBasedOnProject && (
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Search SKU:<span className="text-red-600 font-bold">*</span>
                    </label>
                    <AsyncSelectBox data={asyncSelectBoxData} setData={setAsyncSelectBoxData} api={EpcaDtl.GetSKUList} apiPayload={{ app_id: 15 }} label="sku_desc"
                      value="sku_code" />
                  </div>
                )}

                {PCASkuBillingDetails && showRestBasedOnProject && (
                  <div className="col-span-2 h-full rounded-lg">
                    <div>
                      <div className="flex flex-wrap gap-2 p-3">
                        <div className="bg-cyan-100 rounded-full px-4 py-1 flex items-center">
                          <span className="text-xs font-semibold text-cyan-950 mr-2">
                            SKU:
                          </span>
                          <span className="text-xs text-cyan-950 font-semibold">
                            {PCASkuBillingDetails.sku}
                          </span>
                        </div>

                        <div className="bg-red-100 rounded-full px-4 py-1 flex items-center">
                          <span className="text-xs font-semibold text-red-950 mr-2">
                            UOM:
                          </span>
                          <span className="text-xs text-red-950 font-semibold">
                            {PCASkuBillingDetails.sku_uom}
                          </span>
                        </div>

                        <div className="bg-stone-100 rounded-full px-4 py-1 flex items-center">
                          <span className="text-xs font-semibold text-stone-950 mr-2">
                            Pack Size:
                          </span>
                          <span className="text-xs text-stone-950 font-semibold">
                            {PCASkuBillingDetails.pack_size}
                          </span>
                        </div>

                        <div className="bg-indigo-100 rounded-full px-4 py-1 flex items-center">
                          <span className="text-xs font-semibold text-indigo-950 mr-2">
                            DNP (Rate/L):
                          </span>
                          <span className="text-xs text-indigo-950 font-semibold">
                            {PCASkuBillingDetails.sku_dnp}
                          </span>
                        </div>

                        <div className="bg-green-100 rounded-full px-4 py-1 flex items-center">
                          <span className="text-xs font-semibold text-green-950 mr-2">
                            Declared PCA (Rate/L):
                          </span>
                          <span className="text-xs text-green-950 font-semibold">
                            {PCASkuBillingDetails.sku_mrp}
                          </span>
                        </div>

                        <div className="bg-gray-100 rounded-full px-4 py-1 flex items-center">
                          <span className="text-xs font-semibold text-gray-950 mr-2">
                            Special PCA (Rate/L):
                          </span>
                          <span className="text-xs text-gray-950 font-semibold">
                            {PCASkuBillingDetails.pd_rate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {showRestBasedOnProject && asyncSelectBoxData && (
                <div className="grid grid-cols-1 md:grid-cols-6 mt-2 pt-2 border-t-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Billing Price/L:<span className="text-red-600 font-bold">*</span></label>
                    <input type="number" autoComplete="off" placeholder="Billing Price/L" className="w-full border rounded form-input text-sm"
                      min={PCASkuBillingDetails?.min_rate} disabled={PCASkuBillingDetails?.min_rate == null}
                      value={billingSkuPayload?.bpd_declared_rate}
                      onChange={(e) => setBillingSkuPayload((pre: any) => ({
                        ...pre, bpd_declared_rate: e.target.value,
                        bpd_total_amount: Number(e.target.value) * pre.bpd_no_of_pack * PCASkuBillingDetails.pack_size
                      }))} />
                    {billingSkuPayload?.bpd_declared_rate < PCASkuBillingDetails?.min_rate && (
                      <span className="text-xs text-red-600 font-semibold">Billing Price must be equal to or greater than {PCASkuBillingDetails?.min_rate}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">NOP:<span className="text-red-600 font-bold">*</span></label>
                    <input type="number" autoComplete="off" placeholder="Enter Here" className="w-full border rounded form-input text-sm"
                      min={0} disabled={PCASkuBillingDetails?.min_rate == null} value={billingSkuPayload?.bpd_no_of_pack}
                      onChange={(e) => setBillingSkuPayload((pre: any) => ({
                        ...pre, bpd_no_of_pack: e.target.value,
                        bpd_total_amount: Number(e.target.value) * pre.bpd_declared_rate * PCASkuBillingDetails.pack_size
                      }))} />
                  </div>

                  <div className="col-span-3">
                    <label className="block text-sm font-semibold mb-1">Remarks:</label>
                    <input type="text" autoComplete="off" placeholder="Enter Here" className="w-full border rounded form-input text-sm"
                      disabled={PCASkuBillingDetails?.min_rate == null} value={billingSkuPayload?.remarks}
                      onChange={(e) => setBillingSkuPayload((pre: any) => ({ ...pre, remarks: e.target.value }))}
                    />
                  </div>

                  {billingSkuPayload.bpd_no_of_pack > 0 && PCASkuBillingDetails && billingSkuPayload?.bpd_declared_rate >= PCASkuBillingDetails?.min_rate && (
                    <div className='flex items-center justify-end'>
                      <button className='py-2 px-4 bg-gradient-to-b from-blue-500 to-blue-950 rounded-md text-white font-semibold flex items-center' type="button"
                        onClick={handleAdd} disabled={billingSkuPayload.bpd_no_of_pack < 1}>
                        <span>ADD</span>
                        <IoMdAdd />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {billingPayload.billing_sku.length > 0 && (
        <div className="flex justify-center">
          <span className="px-6 py-0.5 bg-slate-900 text-slate-200 mt-4 rounded-t-lg">Already Selected SKU</span>
        </div>
      )}

      {billingPayload.billing_sku.length > 0 &&
        billingPayload.billing_sku.map((sku: any, idx: number) => (
          <div key={sku.bpd_sku_id || idx} className="p-4 bg-white rounded-md mb-4">
            <div className="flex justify-between px-2">
              <div className="text-md text-slate-900 font-semibold border-b-2 border-dotted">
                {sku.sku_label} <span className="text-slate-700">({sku.bpd_sku_id})</span>
              </div>
              <div className="px-4 text-green-800 bg-green-200 rounded-full border-green-300 border-2">
                Stock: <span className="font-semibold text-green-950"> {sku.bpd_stock} </span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4 px-2 pt-2 items-center">
              <div className="text-slate-700">
                Billing Price (Rate/L):
                <span className="font-semibold text-slate-900"> {sku.bpd_declared_rate}</span>
              </div>
              <div className="text-slate-700">
                Pack Size (L):
                <span className="font-semibold text-slate-900"> {sku.pack_size}</span>
              </div>
              <div className="text-slate-700">
                No of Pack:
                <span className="font-semibold text-slate-900"> {sku.bpd_no_of_pack}</span>
              </div>
              <div className="text-slate-700">
                Total Amount:
                <span className="font-semibold text-slate-900"> {sku.bpd_total_amount}</span>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleRemove(idx)}
                  className="px-2 py-0.5 text-red-600 font-semibold border-2 border-red-600 rounded-md hover:bg-red-600 hover:text-white transition duration-300"
                >
                  <div className="flex items-center">
                    <FiTrash2 className="mr-1 text-sm" />
                    Remove
                  </div>
                </button>
              </div>
            </div>
          </div>
        ))}

      {billingPayload.billing_sku.length > 0 && (
        <>
          <div className="flex justify-between py-2 px-4 items-center bg-white rounded-md">
            <div className="text-lg">
              <span className="text-slate-700">Total Price:</span>
              <span className="font-semibold text-slate-900"> {billingPayload.billing_sku.reduce((acc: any, cur: any) => acc + cur.bpd_total_amount, 0)}</span>

            </div>
            <button className="bg-gradient-to-b from-blue-500 to-blue-950 px-4 py-2 rounded-lg text-white font-semibold flex items-center"
              onClick={handleSubmit}
            >
              <FaRegPaperPlane />
              <span className="ml-2">Submit</span>
            </button>
          </div>
        </>
      )}

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
          <div role="status" className="animate-spin">
            <svg
              aria-hidden="true"
              className="h-8 w-8 fill-blue-600 text-gray-200"
              viewBox="0 0 100 101"
              fill="none"
            >
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only text-white">Please Wait...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactBillingCreate;
