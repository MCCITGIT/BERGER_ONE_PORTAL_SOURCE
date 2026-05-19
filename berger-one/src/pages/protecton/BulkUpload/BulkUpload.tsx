import React, { useRef, useState } from 'react';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { MdCloudUpload, MdCloudDownload } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';
import { PcaBulkDataUpload } from '../../../services/api/protectonEpca/BulkUpload';
import { commonErrorToast } from '../../../services/functions/commonToast';

const BulkUpload: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadResult, setUploadResult] = useState<{ message: string; downloadUrl: string } | null>(null);

    const handleDownloadTemplate = () => {
        const url = 'https://bpilmobileuat.bergerindia.com/VIRTUAL_DOCS/PROTECTON_MOB_APP/TEMP/PCA_BULK_UPLOAD/951f4064-712d-45fb-aea3-bb087a73504b.xlsx';
        const link = document.createElement('a');
        link.href = url;
        link.download = 'PCA_Bulk_Upload_Template.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const allowed = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv',
        ];
        if (!allowed.includes(file.type)) {
            commonErrorToast('Only Excel (.xlsx, .xls) or CSV files are allowed.');
            e.target.value = '';
            return;
        }
        setSelectedFile(file);
        setUploadResult(null);
        e.target.value = '';
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            commonErrorToast('Please select a file first.');
            return;
        }
        setLoading(true);
        try {
            const response: any = await PcaBulkDataUpload(selectedFile);
            if (response?.statusCode === 200 || response?.success) {
                setUploadResult({
                    message: response?.message ?? 'File uploaded successfully.',
                    downloadUrl: response?.data?.full_url ?? '',
                });
                setSelectedFile(null);
            } else {
                commonErrorToast(response?.message ?? 'Upload failed. Please try again.');
            }
        } catch {
            commonErrorToast('Upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!uploadResult?.downloadUrl) return;
        const link = document.createElement('a');
        link.href = uploadResult.downloadUrl;
        link.download = uploadResult.downloadUrl.split('/').pop() ?? 'PCA_Bulk_Upload_Result.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-1">
                <h5 className="text-lg font-semibold dark:text-white-light">Bulk Upload</h5>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Step 1 — Download Template */}
                    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col gap-4 border-t-4 border-green-500">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                                1
                            </div>
                            <h6 className="font-semibold text-gray-700 text-sm">Download Template</h6>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Download the Excel template, fill in the required data, and save the file before uploading.
                        </p>
                        <button
                            className="mt-auto bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors duration-200"
                            onClick={handleDownloadTemplate}
                        >
                            <RiFileExcel2Fill className="text-base" />
                            Download Template
                        </button>
                    </div>

                    {/* Step 2 — Upload */}
                    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col gap-4 border-t-4 border-blue-500">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                                2
                            </div>
                            <h6 className="font-semibold text-gray-700 text-sm">Upload File</h6>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Select the filled Excel file and click Upload. Supported formats: .xlsx, .xls, .csv.
                        </p>

                        {/* File pick area */}
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {selectedFile ? (
                                <>
                                    <RiFileExcel2Fill className="text-3xl text-green-500" />
                                    <p className="text-xs font-semibold text-gray-700 text-center break-all">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                    <button
                                        className="text-xs text-red-400 hover:text-red-600 underline"
                                        onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                    >
                                        Remove
                                    </button>
                                </>
                            ) : (
                                <>
                                    <MdCloudUpload className="text-3xl text-gray-300" />
                                    <p className="text-xs text-gray-400 text-center">
                                        Click to browse file
                                    </p>
                                </>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        <button
                            className="mt-auto bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors duration-200"
                            onClick={handleUpload}
                            disabled={loading || !selectedFile}
                        >
                            <MdCloudUpload className="text-base" />
                            {loading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>

                    {/* Step 3 — Download Result */}
                    <div className={`bg-white rounded-lg shadow-md p-5 flex flex-col gap-4 border-t-4 transition-all duration-300 ${uploadResult ? 'border-indigo-500' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold shrink-0 transition-colors duration-300 ${uploadResult ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                                3
                            </div>
                            <h6 className="font-semibold text-gray-700 text-sm">Download Result</h6>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            After a successful upload, download the result file to review processed records and any errors.
                        </p>

                        {uploadResult ? (
                            <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                <FaCheckCircle className="text-green-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-green-700 font-medium">{uploadResult.message}</p>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-xs text-gray-300 italic">
                                Waiting for upload…
                            </div>
                        )}

                        <button
                            className="mt-auto bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white text-sm px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors duration-200"
                            onClick={handleDownload}
                            disabled={!uploadResult?.downloadUrl}
                        >
                            <MdCloudDownload className="text-base" />
                            Download
                        </button>
                    </div>

                </div>
            </div>

            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
                    <div role="status" className="animate-spin">
                        <svg aria-hidden="true" className="h-8 w-8 fill-blue-600 text-gray-200" viewBox="0 0 100 101" fill="none">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Please Wait...</span>
                    </div>
                </div>
            )}
        </>
    );
};

export default BulkUpload;
