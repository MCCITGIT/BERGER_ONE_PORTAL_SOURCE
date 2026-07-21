import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiThumbsDown, FiThumbsUp } from 'react-icons/fi';
import { GetConversationDetails, type ConversationDetails } from '../../services/api/AIassistant/AIChat';
import { commonErrorToast } from '../../services/functions/commonToast';
import { formatDateToIST } from './dateUtils';

const AIassistantDetailsScreen = () => {
    const navigate = useNavigate();
    const { chatId } = useParams<{ chatId: string }>();
    const [chat, setChat] = useState<ConversationDetails | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!chatId) {
            setChat(null);
            return;
        }

        const fetchConversationDetails = async () => {
            setLoading(true);
            try {
                const response = await GetConversationDetails({ chatId });
                if (response?.success && response?.data) {
                    setChat(response.data);
                } else {
                    setChat(null);
                    commonErrorToast(response?.message || 'Failed to load conversation details');
                }
            } catch {
                setChat(null);
                commonErrorToast('Failed to load conversation details');
            } finally {
                setLoading(false);
            }
        };

        fetchConversationDetails();
    }, [chatId]);

    const messages = useMemo(
        () => (chat ? chat.messages.filter((message) => message.role !== 'system') : []),
        [chat]
    );

    if (loading) {
        return (
            <div className="rounded-lg bg-white px-4 py-6 shadow-md">
                <p className="text-sm text-gray-600">Loading conversation...</p>
            </div>
        );
    }

    if (!chat) {
        return (
            <div className="rounded-lg bg-white px-4 py-6 shadow-md">
                <p className="text-sm text-gray-600">Chat not found.</p>
                <button
                    type="button"
                    onClick={() => navigate('/AIassistant/AIassistantListScreen')}
                    className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                    Back to list
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-1">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/AIassistant/AIassistantListScreen')}
                        className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                        <FiArrowLeft size={16} />
                        Back
                    </button>
                    <h5 className="text-lg font-semibold dark:text-white-light">
                        AI Assistant Chat
                    </h5>
                </div>
            </div>

            <div className="w-full rounded-lg bg-white shadow-md">
                <div className="border-b border-gray-200 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-800">
                        {chat.title ?? 'Untitled Chat'}
                    </p>
                    <p className="text-xs text-gray-500">
                        {formatDateToIST(chat.createdAt)}
                    </p>
                </div>

                <div className="flex h-[calc(100vh-220px)] min-h-[420px] flex-col bg-gray-50">
                    <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                        {messages.map((message) => {
                            const isUser = message.role === 'user';
                            const isLiked = !!message.userLiked;
                            const isDisliked = !!message.userDisliked;

                            return (
                                <div
                                    key={message.messageId}
                                    className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`w-1/2 rounded-2xl px-4 py-3 shadow-sm ${
                                            isUser
                                                ? 'rounded-br-md bg-blue-600 text-white'
                                                : 'rounded-bl-md border border-gray-200 bg-white text-gray-800'
                                        }`}
                                    >
                                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide opacity-70">
                                            {isUser ? 'You' : 'AI Assistant'}
                                        </p>
                                        {isUser ? (
                                            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                                        ) : (
                                            <>
                                                <div
                                                    className="ai-assistant-message-content prose prose-sm max-w-none text-sm [&_em]:not-italic [&_p]:mb-2 [&_p:last-child]:mb-0"
                                                    dangerouslySetInnerHTML={{ __html: message.content }}
                                                />
                                                <div className="mt-3 flex items-center gap-1">
                                                    <span
                                                        title="Liked"
                                                        className={`rounded-md p-1.5 ${
                                                            isLiked
                                                                ? 'bg-green-100 text-green-600'
                                                                : 'text-gray-400'
                                                        }`}
                                                    >
                                                        <FiThumbsUp
                                                            size={15}
                                                            className={isLiked ? 'fill-current' : ''}
                                                        />
                                                    </span>
                                                    <span
                                                        title="Disliked"
                                                        className={`rounded-md p-1.5 ${
                                                            isDisliked
                                                                ? 'bg-red-100 text-red-600'
                                                                : 'text-gray-400'
                                                        }`}
                                                    >
                                                        <FiThumbsDown
                                                            size={15}
                                                            className={isDisliked ? 'fill-current' : ''}
                                                        />
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        <p className={`mt-2 text-[11px] ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                                            {formatDateToIST(message.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AIassistantDetailsScreen;
