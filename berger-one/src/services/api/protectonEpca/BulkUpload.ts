import AXIOS_HTTP from '../../../helper/Interceptor';
import { API_ENDPOINT } from '../../../helper/DB';
import { ENDPOINTS } from '../../../helper/EndPoints';

export function PcaBulkDataUpload(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    return AXIOS_HTTP.post(API_ENDPOINT(ENDPOINTS.PcaBulkDataUpload), formData);
}
