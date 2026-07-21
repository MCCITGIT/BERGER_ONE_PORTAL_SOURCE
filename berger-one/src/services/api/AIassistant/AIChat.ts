import { HTTP_GET } from '../../../helper/ApiCall';
import { ENDPOINTS } from '../../../helper/EndPoints';

export type GetConversationListParams = {
    FromDate: string;
    ToDate: string;
    UserId: string;
    Keyword: string;
    AppName: string;
    PageNumber: number;
    PageSize: number;
};

export type ConversationListItem = {
    chatId: string;
    createdAt: string;
    messageCount: number;
    user_id: string;
    title: string;
    userName: string;
    designation: string;
};

export type GetConversationListResponse = {
    data: ConversationListItem[];
    statusCode: number;
    message: string;
    success: boolean;
};

export function GetConversationList(data: GetConversationListParams): Promise<GetConversationListResponse> {
    return HTTP_GET<GetConversationListParams, GetConversationListResponse>(data, ENDPOINTS.GetConversationList);
}

export type GetConversationDetailsParams = {
    chatId: string;
};

export type ConversationMessage = {
    messageId: string;
    role: string;
    content: string;
    timestamp: string;
    userLiked?: boolean;
    userDisliked?: boolean;
    llmConfidenceScore?: number | null;
};

export type ConversationDetails = {
    chatId: string;
    createdAt: string;
    title: string;
    conversationSummary?: string;
    messages: ConversationMessage[];
};

export type GetConversationDetailsResponse = {
    data: ConversationDetails;
    statusCode: number;
    message: string;
    success: boolean;
};

export function GetConversationDetails(data: GetConversationDetailsParams): Promise<GetConversationDetailsResponse> {
    return HTTP_GET<GetConversationDetailsParams, GetConversationDetailsResponse>(data, ENDPOINTS.GetConversationDetails);
}
