export type AIChatListRecord = {
    chatId: string;
    createdAt: string;
    messageCount: number;
    user_id: string;
    title: string;
    userName: string;
    designation: string;
};

export type AIChatMessage = {
    MessageId: string;
    Role: string;
    Content: string;
    Timestamp: string;
    UserLiked?: boolean;
    UserDisliked?: boolean;
    LlmConfidenceScore?: number | null;
    GuardrailHit?: boolean;
    WorkflowSnapshot?: string;
    LlmResponseTimeMs?: number;
    LlmResponseTimeSeconds?: number;
};

export type AIChatRecord = {
    ChatId: string;
    AppName: string;
    ChatTitle: string | null;
    CreatedAt: string;
    Messages: AIChatMessage[];
    ConversationSummary?: string;
    id: string;
    user_id: string;
    _rid: string;
    _self: string;
    _etag: string;
    _attachments: string;
    _ts: number;
};

export const DEMO_CHAT_LIST_DATA: AIChatListRecord[] = [
    {
        chatId: '9d120e4b-163b-447f-84c9-dd5e6fc0159b',
        title: 'New Chat',
        createdAt: '2026-07-08T13:25:32.8711155Z',
        messageCount: 3,
        user_id: '5061',
        userName: 'Demo User',
        designation: 'Dist_DG',
    },
];

export const DEMO_CHAT_DETAILS_DATA: AIChatRecord[] = [
    {
        ChatId: '9d120e4b-163b-447f-84c9-dd5e6fc0159b',
        AppName: 'OneApp',
        ChatTitle: null,
        CreatedAt: '2026-07-08T13:25:32.8711155Z',
        Messages: [
            {
                MessageId: 'd8e40647ecee4eb586d0105ad06ec67b',
                Role: 'system',
                Content: 'Berger Paints supply-chain assistant. Workflow orchestration, entity extraction, validation, and business functions are handled by the server-side SemanticFlow pipeline.',
                Timestamp: '2026-07-07T15:25:32Z',
                UserLiked: false,
                UserDisliked: false,
                LlmConfidenceScore: null,
            },
            {
                MessageId: 'dc95a00400bb4f76a799c3e43e9180ee',
                Role: 'user',
                Content: 'Factory pending',
                Timestamp: '2026-07-07T09:55:32Z',
                UserLiked: false,
                UserDisliked: false,
                GuardrailHit: false,
                LlmConfidenceScore: null,
            },
            {
                MessageId: 'ce980667175a4954a691c83cc110bc86',
                Role: 'assistant',
                Content: "<br/>No SKU found for keyword: 'FACTORY'.",
                Timestamp: '2026-07-07T09:55:39Z',
                LlmConfidenceScore: 1,
                UserLiked: false,
                UserDisliked: false,
                LlmResponseTimeMs: 4958,
                LlmResponseTimeSeconds: 4.958,
            },
            {
                MessageId: '2bad2cac1f774235a747f00fb6addaee',
                Role: 'user',
                Content: 'F00p430633020000',
                Timestamp: '2026-07-07T15:25:57Z',
                UserLiked: false,
                UserDisliked: false,
                GuardrailHit: false,
                LlmConfidenceScore: null,
            },
            {
                MessageId: '327af982a0c34e7d823fdd147d590180',
                Role: 'assistant',
                Content: "After reviewing the available information, I found the SKU Code you have provided: <strong>'F00p430633020000:EPILUX 610 COATING-GREY-20 L'</strong> is valid. Accordingly, this SKU will be used for the requested process.<br/><br/><p><em>Please choose what you want to view for this SKU/product:</em></p><p><em>1. Do you want to view status/sales/stocks/plans etc. of the same?</em></p><p><em>2. Do you want to know the Estimated Factory Dispatch Date?</em></p><p><em>3. Do you want to view all the dispatch details?</em></p>",
                Timestamp: '2026-07-07T15:26:03Z',
                LlmConfidenceScore: 1,
                UserLiked: false,
                UserDisliked: false,
                LlmResponseTimeMs: 5378,
                LlmResponseTimeSeconds: 5.379,
            },
            {
                MessageId: '4eb4dd53add34c46a5e82cc774e17bea',
                Role: 'user',
                Content: 'Estimated factory dispatch date',
                Timestamp: '2026-07-07T20:56:34Z',
                UserLiked: false,
                UserDisliked: false,
                GuardrailHit: false,
                LlmConfidenceScore: null,
            },
            {
                MessageId: '27280e9120f34a66b7abd67c99674566',
                Role: 'assistant',
                Content: '<p><em>Certainly — I can show the Estimated Factory Dispatch Date. Would you like me to use SKU F00p430633020000, or share a different SKU or depot?</em></p>',
                Timestamp: '2026-07-07T20:56:42Z',
                LlmConfidenceScore: 1,
                UserLiked: false,
                UserDisliked: false,
                LlmResponseTimeMs: 7166,
                LlmResponseTimeSeconds: 7.166,
            },
            {
                MessageId: 'db8cbbe440594985b166a1a17ef4a09d',
                Role: 'user',
                Content: 'F00p430633020000',
                Timestamp: '2026-07-08T02:27:06Z',
                UserLiked: false,
                UserDisliked: false,
                GuardrailHit: false,
                LlmConfidenceScore: null,
            },
            {
                MessageId: 'aa64aa9399624fb88d148d86f5cfa24d',
                Role: 'assistant',
                Content: '<p><em>Please choose what you want to view for this SKU/product:</em></p><p><em>1. Do you want to view status/sales/stocks/plans etc. of the same?</em></p><p><em>2. Do you want to know the Estimated Factory Dispatch Date?</em></p><p><em>3. Do you want to view all the dispatch details?</em></p>',
                Timestamp: '2026-07-08T02:27:11Z',
                LlmConfidenceScore: 1,
                UserLiked: false,
                UserDisliked: false,
                LlmResponseTimeMs: 5133,
                LlmResponseTimeSeconds: 5.133,
            },
            {
                MessageId: 'b299fcf64af245388f8d9f4989b4d0eb',
                Role: 'user',
                Content: 'Factory dispatch date',
                Timestamp: '2026-07-08T07:57:22Z',
                UserLiked: false,
                UserDisliked: false,
                GuardrailHit: false,
                LlmConfidenceScore: null,
            },
            {
                MessageId: '34ed7f19e22a489d86f16aa506cad497',
                Role: 'assistant',
                Content: '<p><em>Certainly — I can show the Estimated Factory Dispatch Date. Would you like me to use SKU F00p430633020000, or share a different SKU or depot?</em></p>',
                Timestamp: '2026-07-08T07:57:29Z',
                LlmConfidenceScore: 1,
                UserLiked: true,
                UserDisliked: false,
                LlmResponseTimeMs: 6948,
                LlmResponseTimeSeconds: 6.949,
            },
            {
                MessageId: "7d89bea235b84ccb879040a3f8568eb4",
                Role: "user",
                Content: "F0013f",
                Timestamp: "2026-07-09T09:14:34.0000000Z",
                UserLiked: false,
                UserDisliked: false,
                GuardrailHit: false
            },
            {
                MessageId: "a75e541c190d44df9eecb0bb435ae6de",
                Role: "assistant",
                Content: "<p>Found <strong>17</strong> SKUs for <strong>F0013F</strong>. To help identify the exact SKU faster, please provide exactly the first 10 characters of the SKU code.</p>",
                Timestamp: "2026-07-09T09:14:42.0000000Z",
                LlmConfidenceScore: 1.0,
                UserLiked: false,
                UserDisliked: false
            },
            {
                MessageId: "ee12f82d406841389954ca3c848478fb",
                Role: "user",
                Content: "F0013F0360",
                Timestamp: "2026-07-09T14:44:55.0000000Z",
                UserLiked: false,
                UserDisliked: false,
                GuardrailHit: false
            },
            {
                MessageId: "92d098e1464e4065812497a7fbed8390",
                Role: "assistant",
                Content: "Your given product code <strong>'F0013F0360'</strong> has a single SKU: <strong>'F0013F0360020000:BR SYN ENLPRO IS 2932-GOLDEN YLW-20 L'</strong>.<br/><br/><p><em>Please choose what you want to view for this SKU/product:</em></p><p><em>1. Do you want to view status/sales/stocks/plans etc. of the same?</em></p><p><em>2. Do you want to know the Estimated Factory Dispatch Date?</em></p><p><em>3. Do you want to view all the dispatch details?</em></p>",
                Timestamp: "2026-07-09T14:45:05.0000000Z",
                LlmConfidenceScore: 1.0,
                UserLiked: false,
                UserDisliked: false
            },
            {
                MessageId: "ce45ea81b3c44d6e9c2f0098167ba87e",
                Role: "user",
                Content: "1",
                Timestamp: "2026-07-09T20:15:12.0000000Z",
                UserLiked: false,
                UserDisliked: false,
                GuardrailHit: false
            },
            {
                MessageId: "f93bc3717cb243dba8b6d03b8f6bfca6",
                Role: "assistant",
                Content: "<p><strong>Found (272) Depots for you. </strong>. Currently showing 30 Record(s). Please use one of the depot code for further process.</p>\r\n<table border='1' cellpadding='8' cellspacing='0' style='border-collapse: collapse; font-family: Arial, sans-serif; width: 100%;'>\r\n<colgroup><col width='10%' /><col width='15%' /><col width='75%' /></colgroup><thead style='background-color: #2196F3; color: white;'>\r\n<tr><th width='10%' style='text-align: left;'>#</th><th style='text-align: left; width: 20%;'>Depot Code</th><th style='text-align: left; width: 70%;'>Depot Name</th></tr>\r\n</thead>\r\n<tbody>\r\n<tr>\r\n<td><strong>1</strong></td>\r\n<td>001</td>\r\n<td>001:Kolkata</td>\r\n</tr>\r\n<tr>\r\n<td><strong>2</strong></td>\r\n<td>002</td>\r\n<td>002:Guwahati</td>\r\n</tr>\r\n<tr>\r\n<td><strong>3</strong></td>\r\n<td>003</td>\r\n<td>003:Patna</td>\r\n</tr>\r\n<tr>\r\n<td><strong>4</strong></td>\r\n<td>004</td>\r\n<td>004:Bhubaneswar</td>\r\n</tr>\r\n<tr>\r\n<td><strong>5</strong></td>\r\n<td>005</td>\r\n<td>005:Siliguri</td>\r\n</tr>\r\n<tr>\r\n<td><strong>6</strong></td>\r\n<td>006</td>\r\n<td>006:Kolkata-2</td>\r\n</tr>\r\n<tr>\r\n<td><strong>7</strong></td>\r\n<td>007</td>\r\n<td>007:Ranchi</td>\r\n</tr>\r\n<tr>\r\n<td><strong>8</strong></td>\r\n<td>008</td>\r\n<td>008:Cuttack</td>\r\n</tr>\r\n<tr>\r\n<td><strong>9</strong></td>\r\n<td>009</td>\r\n<td>009:Head Office</td>\r\n</tr>\r\n<tr>\r\n<td><strong>10</strong></td>\r\n<td>011</td>\r\n<td>011:Vadodara-2</td>\r\n</tr>\r\n<tr>\r\n<td><strong>11</strong></td>\r\n<td>012</td>\r\n<td>012:Indore</td>\r\n</tr>\r\n<tr>\r\n<td><strong>12</strong></td>\r\n<td>013</td>\r\n<td>013:Pune</td>\r\n</tr>\r\n<tr>\r\n<td><strong>13</strong></td>\r\n<td>014</td>\r\n<td>014:Ahmedabad</td>\r\n</tr>\r\n<tr>\r\n<td><strong>14</strong></td>\r\n<td>015</td>\r\n<td>015:Raipur</td>\r\n</tr>\r\n<tr>\r\n<td><strong>15</strong></td>\r\n<td>016</td>\r\n<td>016:Nagpur</td>\r\n</tr>\r\n<tr>\r\n<td><strong>16</strong></td>\r\n<td>017</td>\r\n<td>017:Vadodara</td>\r\n</tr>\r\n<tr>\r\n<td><strong>17</strong></td>\r\n<td>018</td>\r\n<td>018:Rajkot</td>\r\n</tr>\r\n<tr>\r\n<td><strong>18</strong></td>\r\n<td>020</td>\r\n<td>020:Delhi - Okhla</td>\r\n</tr>\r\n<tr>\r\n<td><strong>19</strong></td>\r\n<td>021</td>\r\n<td>021:Lucknow</td>\r\n</tr>\r\n<tr>\r\n<td><strong>20</strong></td>\r\n<td>022</td>\r\n<td>022:Ludhiana</td>\r\n</tr>\r\n<tr>\r\n<td><strong>21</strong></td>\r\n<td>023</td>\r\n<td>023:Jaipur</td>\r\n</tr>\r\n<tr>\r\n<td><strong>22</strong></td>\r\n<td>024</td>\r\n<td>024:Ghaziabad</td>\r\n</tr>\r\n<tr>\r\n<td><strong>23</strong></td>\r\n<td>025</td>\r\n<td>025:Faridabad</td>\r\n</tr>\r\n<tr>\r\n<td><strong>24</strong></td>\r\n<td>026</td>\r\n<td>026:Varanasi</td>\r\n</tr>\r\n<tr>\r\n<td><strong>25</strong></td>\r\n<td>027</td>\r\n<td>027:Jammu</td>\r\n</tr>\r\n<tr>\r\n<td><strong>26</strong></td>\r\n<td>029</td>\r\n<td>029:Chandigarh</td>\r\n</tr>\r\n<tr>\r\n<td><strong>27</strong></td>\r\n<td>030</td>\r\n<td>030:Chennai</td>\r\n</tr>\r\n<tr>\r\n<td><strong>28</strong></td>\r\n<td>031</td>\r\n<td>031:Bangalore Urban</td>\r\n</tr>\r\n<tr>\r\n<td><strong>29</strong></td>\r\n<td>032</td>\r\n<td>032:Cochin</td>\r\n</tr>\r\n<tr>\r\n<td><strong>30</strong></td>\r\n<td>033</td>\r\n<td>033:Visakhapatnam</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<br/>\r\n<p>Please choose one depot code from your applicable depots so I can continue with your request.</p>\r\n<br/><p>Please reply with one depot code from the list, say <strong>my depots</strong> to view this list again, or say <strong>all depots</strong> if you want the result for all your applicable depots.</p>",
                Timestamp: "2026-07-09T20:15:20.0000000Z",
                LlmConfidenceScore: 1.0,
                UserLiked: false,
                UserDisliked: false
            },
            {
                MessageId: "f2f6b8565eb9462e9fbe0a7c8ffd9f3b",
                Role: "user",
                Content: "063",
                Timestamp: "2026-07-10T01:45:29.0000000Z",
                UserLiked: false,
                UserDisliked: false,
                GuardrailHit: false
            },
            {
                MessageId: "ebf306d0198541d4a6f09f646b785179",
                Role: "assistant",
                Content: "After reviewing your applicable depots, your selected location code <strong>'063:Sreerampore Industrial'</strong> appears to be valid. Accordingly, this depot will be used for the requested process.<br/><br/><p><strong>Status for SKU &#39;F0013F0360020000&#39; for Location &#39;063&#39;</strong></p><p>Total Records: 1</p><p><em>The following data is as on: 10/07/2026 11:30 AM</em></p><div style='overflow-x:auto;'>\r\n<table border='1' cellpadding='8' cellspacing='0' style='border-collapse: collapse; font-family: Arial, sans-serif; width: 100%; white-space: nowrap; table-layout:fixed;'>\r\n <colgroup><col width='18%' /><col width='30%' /><col width='10%' /><col width='15%' /><col width='15%' /><col width='15%' /><col width='15%' /><col width='15%' /><col width='18%' /><col width='18%' /><col width='18%' /><col width='18%' /><col width='18%' /><col width='18%' /><col width='25%' /></colgroup>\r\n<thead style='background-color: #4c7caf; color: white;'>\r\n<tr>\r\n<th width='12%' style='text-align:left;white-space:normal;word-break:break-word;'>SKU Code</th>\r\n<th width='20%' style='text-align:left;white-space:normal;word-break:break-word;'>SKU Description</th>\r\n<th width='10%' style='text-align:center;white-space:normal;word-break:break-word;'>SKU Type</th>\r\n<th width='15%' style='text-align:left;white-space:normal;word-break:break-word;'>Depot</th>\r\n<th width='15%' style='text-align:right;white-space:normal;word-break:break-word;'>Final Total Demand</th>\r\n<th width='15%' style='text-align:right;white-space:normal;word-break:break-word;'>Manual Orders Supplied</th>\r\n<th width='15%' style='text-align:right;white-space:normal;word-break:break-word;'>Manual Orders Pending</th>\r\n<th width='15%' style='text-align:right;white-space:normal;word-break:break-word;'>LY Planning Month Sales</th>\r\n<th width='18%' style='text-align:right;white-space:normal;word-break:break-word;'>YTD Average Sale</th>\r\n<th width='18%' style='text-align:right;white-space:normal;word-break:break-word;'>Last 3 Months Average Sale</th>\r\n<th width='18%' style='text-align:right;white-space:normal;word-break:break-word;'>MTD Sales</th>\r\n<th width='18%' style='text-align:right;white-space:normal;word-break:break-word;'>Stock As On Date</th>\r\n<th width='18%' style='text-align:right;white-space:normal;word-break:break-word;'>In transit</th>\r\n<th width='18%' style='text-align:right;white-space:normal;word-break:break-word;'>MTD Dispatch</th>\r\n<th width='25%' style='text-align:right;white-space:normal;word-break:break-word;'>Full Planned Supplies(Planned + Manual Indents) For Rest of the Month incl. In transit</th>\r\n</tr>\r\n</thead>\r\n<tbody>\r\n<tr>\r\n<td width='12%' style='text-align:left;'>F0013F0360020000</td>\r\n<td width='20%' style='text-align:left;'>BR SYN ENLPRO IS 2932-GOLDEN YLW-20 L</td>\r\n<td width='10%' style='text-align:center;'></td>\r\n<td width='15%' style='text-align:left;'>063:Sreerampore Industrial</td>\r\n<td width='15%' style='text-align:right;'>200</td>\r\n<td width='15%' style='text-align:right;'>0</td>\r\n<td width='15%' style='text-align:right;'>0</td>\r\n<td width='15%' style='text-align:right;'>117</td>\r\n<td width='18%' style='text-align:right;'>61</td>\r\n<td width='18%' style='text-align:right;'>61</td>\r\n<td width='18%' style='text-align:right;'>17</td>\r\n<td width='18%' style='text-align:right;'>75</td>\r\n<td width='18%' style='text-align:right;'>0</td>\r\n<td width='18%' style='text-align:right;'>4</td>\r\n<td width='25%' style='text-align:right;'>121</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</div><p><em>What would you like to view next for the same SKU & Location?</em></p><p><em>1. Do you want to view all the dispatch details?</em></p><p><em>2. Do you want to know the Estimated Factory Dispatch Date?</em></p><div style='margin-top:16px; padding:12px; background-color:#FFF3CD; border-left:4px solid #FFC107; border-radius:4px; font-size:12px; color:#664D03;'>\r\n                        <strong>⚠️ Disclaimers: </strong>\r\n                        <ul style='padding-left: 15px;'>\r\n                            <li>Catalyst & Hardener can go into multiple products. The Stock shown here is as per complete stock availability.</li>                        \r\n                            <li><strong>Date & Volume for Supply are close approximation. This can vary due to various factors.</strong></li>                        \r\n                            <li>Planned supply is for the rest of the month (tentative), including in-transit quantities.</li>\r\n                            <li>All reported figures, including Sales, Forecasts, Stocks, Planned Supplies, and In-Transit Quantities, are presented in NOP (Number of Packs).</li>\r\n                        </ul>\r\n                        </div>",
                Timestamp: "2026-07-10T01:45:36.0000000Z",
                LlmConfidenceScore: 1.0,
                UserLiked: false,
                UserDisliked: false
            }
        ],
        id: '9d120e4b-163b-447f-84c9-dd5e6fc0159b',
        user_id: '5061',
        _rid: '-Gh2ALuAvdzOAQAAAAAAAA==',
        _self: 'dbs/-Gh2AA==/colls/-Gh2ALuAvdw=/docs/-Gh2ALuAvdzOAQAAAAAAAA==/',
        _etag: '"1500b9b6-0000-2000-0000-6a4e50410000"',
        _attachments: 'attachments/',
        _ts: 1783517249,
    },
];

export const getChatById = (chatId: string) =>
    DEMO_CHAT_DETAILS_DATA.find((chat) => chat.ChatId === chatId || chat.id === chatId);

export const getVisibleMessages = (chat: AIChatRecord) =>
    chat.Messages.filter((message) => message.Role !== 'system');
