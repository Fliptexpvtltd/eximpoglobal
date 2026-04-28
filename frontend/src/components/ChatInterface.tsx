import { useState, useEffect, useRef } from 'react';
import { Send, MoreVertical, Search, ArrowLeft, Plus, X } from 'lucide-react';
import type { User } from '../App';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ChatInterfaceProps {
  user: User | null;
  activeMode?: 'buyer' | 'seller';
  partnerId?: string;
  onBack: () => void;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
  sender_name?: string;
  receiver_name?: string;
}

interface Conversation {
  conversation_partner: string;
  partner_name: string;
  partner_role: string;
  message: string;
  created_at: string;
  unread_count: number;
  rfq_id?: string;
  order_id?: string;
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString();
};

const formatMessageTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export function ChatInterface({ user, activeMode = 'buyer', partnerId, onBack }: ChatInterfaceProps) {
  const effectiveRole = user?.role === 'both' ? activeMode : (user?.role || 'buyer');
  const isSeller = effectiveRole === 'seller';
  const themeColor = isSeller ? '#059669' : '#2563eb';
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(partnerId || null);
  const [partnerInfo, setPartnerInfo] = useState<{ id: string; name: string; role: string } | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConversations, setShowConversations] = useState(!partnerId);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchConversations();
    fetchAvailableUsers(); // Fetch users on component mount
    
    // Auto-refresh conversations every 10 seconds to check for new messages
    const conversationInterval = setInterval(() => {
      fetchConversations();
    }, 10000);
    
    return () => clearInterval(conversationInterval);
  }, []);

  const fetchAvailableUsers = async () => {
    try {
      setLoadingUsers(true);
      // Fetch users - buyers if seller, suppliers if buyer
      const endpoint = isSeller ? `${API_BASE_URL}/users?role=buyer` : `${API_BASE_URL}/suppliers`;
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAvailableUsers(data.data || data || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleStartNewConversation = (userId: string, userName: string) => {
    setSelectedConversation(userId);
    setPartnerInfo({ id: userId, name: userName, role: isSeller ? 'buyer' : 'seller' });
    setShowNewMessage(false);
    setShowConversations(false);
    setMessages([]);
  };

  useEffect(() => {
    if (partnerId) {
      setSelectedConversation(partnerId);
      setShowConversations(false);
      fetchPartnerInfo(partnerId);
    }
  }, [partnerId]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      // If we don't have partner info and no conversation exists, fetch it
      if (!partnerInfo && !conversations.find(c => c.conversation_partner === selectedConversation)) {
        fetchPartnerInfo(selectedConversation);
      }
      
      // Auto-refresh messages every 5 seconds when a conversation is selected
      const messageInterval = setInterval(() => {
        fetchMessages(selectedConversation);
      }, 5000);
      
      return () => clearInterval(messageInterval);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch conversations: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setConversations(data.data);
        if (data.data.length > 0 && !selectedConversation) {
          setSelectedConversation(data.data[0].conversation_partner);
        }
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (partnerId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${partnerId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Only update if messages changed to avoid flickering
        const newMessages = data.data;
        setMessages(prev => {
          if (JSON.stringify(prev) === JSON.stringify(newMessages)) {
            return prev; // No change, keep existing reference
          }
          return newMessages;
        });
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages');
    }
  };

  const fetchPartnerInfo = async (partnerId: string) => {
    try {
      // Fetch user info from suppliers endpoint
      const response = await fetch(`${API_BASE_URL}/suppliers/${partnerId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setPartnerInfo({
            id: partnerId,
            name: data.data.company_name || data.data.name || 'Unknown',
            role: 'supplier'
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch partner info:', err);
      // Fallback to generic name
      setPartnerInfo({
        id: partnerId,
        name: 'Supplier',
        role: 'supplier'
      });
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;
    
    try {
      setSending(true);
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          receiver_id: selectedConversation,
          message: messageInput.trim()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Add the new message with sender info
        const newMessage = {
          ...data.data,
          sender_id: user?.id
        };
        setMessages(prev => [...prev, newMessage]);
        setMessageInput('');
        
        // Refresh conversations list to show the latest message
        fetchConversations();
      } else {
        setError(data.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const currentConversation = conversations.find(c => c.conversation_partner === selectedConversation);

  const filteredConversations = conversations.filter(conv =>
    (conv.partner_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden" aria-label="Go back">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl mb-2">Messages</h1>
            <p className="text-base md:text-xl text-gray-600">Communicate with buyers and suppliers</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="text-gray-600">Loading conversations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl mb-2">Messages</h1>
          <p className="text-base md:text-xl text-gray-600">Communicate with buyers and suppliers</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
        <div className="flex h-full">
          {/* Conversations List - Full width on mobile, fixed width on desktop */}
          <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-gray-200 flex-col`}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-lg font-semibold flex-1">Messages</h2>
                <button
                  onClick={() => {
                    setShowNewMessage(true);
                    fetchAvailableUsers();
                  }}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  title="New Message"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.conversation_partner}
                    onClick={() => {
                      setSelectedConversation(conversation.conversation_partner);
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                      selectedConversation === conversation.conversation_partner ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="mb-1">{conversation.partner_name}</div>
                        {conversation.rfq_id && (
                          <div className="text-xs text-blue-600">RFQ #{conversation.rfq_id}</div>
                        )}
                        {conversation.order_id && (
                          <div className="text-xs text-green-600">Order #{conversation.order_id}</div>
                        )}
                      </div>
                      {conversation.unread_count > 0 && (
                        <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">
                      {conversation.message}
                    </p>
                    <p className="text-xs text-gray-500">{formatTimestamp(conversation.created_at)}</p>
                  </button>
                ))
              )}
            </div>
          </div>
          
          {/* Chat Area - Full width on mobile when selected, takes remaining space on desktop */}
          <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} w-full md:flex-1 flex-col`}>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  {(currentConversation?.partner_name || partnerInfo?.name || 'S').charAt(0)}
                </div>
                <div>
                  <div className="text-gray-900">{currentConversation?.partner_name || partnerInfo?.name || 'Supplier'}</div>
                  {currentConversation?.rfq_id && (
                    <div className="text-xs text-gray-600">
                      Regarding: RFQ #{currentConversation.rfq_id}
                    </div>
                  )}
                  {currentConversation?.order_id && (
                    <div className="text-xs text-gray-600">
                      Regarding: Order #{currentConversation.order_id}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 messages-container">
              {!selectedConversation ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="max-w-md w-full space-y-4">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Start a Conversation
                      </h3>
                      <p className="text-gray-600">
                        Select a {isSeller ? 'buyer' : 'supplier'} to send a message
                      </p>
                    </div>
                    
                    {loadingUsers ? (
                      <div className="text-center py-8 text-gray-600">Loading...</div>
                    ) : availableUsers.length === 0 ? (
                      <div className="text-center py-8 text-gray-600">
                        No {isSeller ? 'buyers' : 'suppliers'} available
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {availableUsers.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => handleStartNewConversation(user.id, user.company_name || user.name || 'User')}
                            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-lg">
                                {(user.company_name || user.name || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{user.company_name || user.name}</div>
                                {user.email && (
                                  <div className="text-sm text-gray-600">{user.email}</div>
                                )}
                                {user.country && (
                                  <div className="text-xs text-gray-500 mt-1">📍 {user.country}</div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => {
                  const isOwnMessage = message.sender_id === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md ${
                          isOwnMessage
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        } rounded-lg px-4 py-3`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                        <p className={`text-xs mt-2 ${
                          isOwnMessage
                            ? 'text-blue-200'
                            : 'text-gray-500'
                        }`}>
                          {formatMessageTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input - Only show when conversation is selected */}
            {selectedConversation && (
              <>
                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type your message..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                    
                    <button
                      onClick={handleSendMessage}
                      className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!messageInput.trim() || sending}
                    >
                      {sending ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      
      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">New Message</h3>
              <button
                onClick={() => setShowNewMessage(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {loadingUsers ? (
                <div className="text-center py-8 text-gray-600">Loading users...</div>
              ) : availableUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No {isSeller ? 'buyers' : 'suppliers'} available
                </div>
              ) : (
                <div className="space-y-2">
                  {availableUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleStartNewConversation(user.id, user.company_name || user.name || 'User')}
                      className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                          {(user.company_name || user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{user.company_name || user.name}</div>
                          {user.email && (
                            <div className="text-sm text-gray-600">{user.email}</div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <span className="block mb-1">💡 Communication Tips:</span>
          • Be clear and specific about requirements • Request samples before large orders • 
          Document all agreements in writing • Use the platform for all communications to maintain records
        </p>
      </div>
    </div>
  );
}
