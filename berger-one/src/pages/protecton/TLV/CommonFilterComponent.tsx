// import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import Select from 'react-select';

const CommonFilterComponent = ({ selectBoxData, filterData, setFilterData, handleSearch }: any) => {

    const handleSelectChange = (event: any, field: string) => {
        setFilterData({ ...filterData, [field]: event.value });
    }
    const handleChange = (event: any, field: string) => {
        setFilterData({ ...filterData, [field]: event.target.value });
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-1">
            <div>
                <label className="block text-sm font-semibold mb-1">Depot:</label>
                <Select
                    className="text-sm"
                    isSearchable={true}
                    value={filterData?.depotCode ? selectBoxData?.depot.find((option: any) => option.value === filterData.depotCode) : null}
                    options={selectBoxData?.depot}
                    onChange={(event) => {
                        setFilterData({
                            ...filterData,
                            depotCode: event?.value ?? '',
                            terrCode: '',
                        });
                    }}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold mb-1">Territory:</label>
                <Select
                    className="text-sm"
                    isSearchable={true}
                    value={filterData?.terrCode ? selectBoxData?.terr.find((option: any) => option.value === filterData.terrCode) : null}
                    options={selectBoxData?.terr}
                    onChange={(event) => {
                        handleSelectChange(event, 'terrCode');
                    }}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold mb-1">Acct. No.:</label>
                <input type="text" placeholder="Acct. No." className="w-full border rounded form-input text-sm" name="dealerCode" value={filterData.dealerCode} onChange={(event) => handleChange(event, 'dealerCode')} autoComplete="off" />
            </div>
            <div>
                <label className="block text-sm font-semibold mb-1">Customer Name:</label>
                <input type="text" placeholder="Customer Name" className="w-full border rounded form-input text-sm" name="dealerName" value={filterData.dealerName} onChange={(event) => handleChange(event, 'dealerName')} autoComplete="off" />
            </div>
            <div>
                <label className="block text-sm font-semibold mb-1">Bill To:</label>
                <input type="text" placeholder="Bill To" className="w-full border rounded form-input text-sm" name="billToCode" value={filterData.billToCode} onChange={(event) => handleChange(event, 'billToCode')} autoComplete="off" />
            </div>

            <div>
                <label className="block text-sm font-semibold mb-1">Status:</label>
                <Select
                    className="text-sm"
                    isSearchable={true}
                    value={filterData?.mainStatus ? selectBoxData?.mainStatus.find((option: any) => option.value === filterData.mainStatus) : null}
                    options={selectBoxData?.mainStatus}
                    onChange={(event) => {
                        handleSelectChange(event, 'mainStatus');
                    }}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold mb-1">Sub Status:</label>
                <Select
                    className="text-sm"
                    isSearchable={true}
                    value={filterData?.aprvStatus ? selectBoxData?.aprvStatus.find((option: any) => option.value === filterData.aprvStatus) : null}
                    options={selectBoxData?.aprvStatus}
                    onChange={(event) => {
                        handleSelectChange(event, 'aprvStatus');
                    }}
                />
            </div>

            {/* Buttons */}
            <div className="flex items-end space-x-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm flex items-center" onClick={handleSearch}>
                    <CiSearch /> Search
                </button>
            </div>
        </div>
    )
}

export default CommonFilterComponent