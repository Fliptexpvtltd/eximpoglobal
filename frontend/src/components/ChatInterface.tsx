import { useState } from 'react';
import { Send, Paperclip, Phone, Video, MoreVertical, Search, ArrowLeft } from 'lucide-react';
import type { User } from '../App';

interface ChatInterfaceProps {
  user: User | null;
  onBack: () => void;
}

interface Message {
  id: string;
  sender: 'buyer' | 'seller';
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'quote' | 'sample';
}

interface Conversation {
  id: string;
  partnerName: string;
  partnerRole: 'buyer' | 'seller';
  lastMessage: string;
  timestamp: string;
  unread: number;
  rfqId?: string;
  poId?: string;
}

const mockConversations: Conversation[] = [
  {
    id: 'c1',
    partnerName: 'Shanghai Textile Co.',
    partnerRole: 'seller',
    lastMessage: 'We can offer you a better price for larger quantities...',
    timestamp: '2 min ago',
    unread: 2,
    rfqId: 'rfq-1',
  },
  {
    id: 'c2',
    partnerName: 'Shenzhen Electronics Ltd.',
    partnerRole: 'seller',
    lastMessage: 'The samples have been shipped via DHL',
    timestamp: '1 hour ago',
    unread: 0,
    rfqId: 'rfq-2',
  },
  {
    id: 'c3',
    partnerName: 'Guangzhou Machinery Inc.',
    partnerRole: 'seller',
    lastMessage: 'Please find attached our latest catalog',
    timestamp: 'Yesterday',
    unread: 1,
  },
  {
    id: 'c4',
    partnerName: 'TechCorp GmbH',
    partnerRole: 'buyer',
    lastMessage: 'Can you provide FOB prices for 1000 units?',
    timestamp: '2 days ago',
    unread: 0,
  },
];

const mockMessages: Message[] = [
  {
    id: 'm1',
    sender: 'seller',
    content: 'Hello! Thank you for your RFQ. We can definitely help you with this order.',
    timestamp: '10:30 AM',
    type: 'text',
  },
  {
    id: 'm2',
    sender: 'buyer',
    content: 'Great! What lead time can you offer for 5000 units?',
    timestamp: '10:32 AM',
    type: 'text',
  },
  {
    id: 'm3',
    sender: 'seller',
    content: 'For 5000 units, we can ship in 25-30 days from order confirmation.',
    timestamp: '10:35 AM',
    type: 'text',
  },
  {
    id: 'm4',
    sender: 'seller',
    content: 'I\'ve prepared a detailed quote for you. Please review the attached document.',
    timestamp: '10:36 AM',
    type: 'file',
  },
  {
    id: 'm5',
    sender: 'buyer',
    content: 'Thanks! The quote looks good. Can you send me samples before I place the order?',
    timestamp: '11:15 AM',
    type: 'text',
  },
  {
    id: 'm6',
    sender: 'seller',
    content: 'Of course! Sample cost is ₹50 including shipping. I can send them today.',
    timestamp: '11:18 AM',
    type: 'text',
  },
  {
    id: 'm7',
    sender: 'buyer',
    content: 'Perfect. Also, is there room for negotiation on the unit price if we increase quantity to 10,000?',
    timestamp: '2:45 PM',
    type: 'text',
  },
  {
    id: 'm8',
    sender: 'seller',
    content: 'We can offer you a better price for larger quantities. Let me check with our production team and get back to you with a revised quote.',
    timestamp: '2:48 PM',
    type: 'text',
  },
];

export function ChatInterface({ user, onBack }: ChatInterfaceProps) {
  const [selectedConversation, setSelectedConversation] = useState<string>(mockConversations[0].id);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConversations, setShowConversations] = useState(true);

  const currentConversation = mockConversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const filteredConversations = mockConversations.filter(conv =>
    conv.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl mb-2">Messages</h1>
        <p className="text-base md:text-xl text-gray-600">Communicate with buyers and suppliers</p>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
        <div className="grid grid-cols-12 h-full">
          {/* Conversations List */}
          <div className={`${showConversations ? 'col-span-12 md:col-span-4' : 'hidden md:flex md:col-span-4'} border-r border-gray-200 flex flex-col`}>
            <div className="p-4 border-b border-gray-200">
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
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation.id);
                    setShowConversations(false);
                  }}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    selectedConversation === conversation.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="mb-1">{conversation.partnerName}</div>
                      {conversation.rfqId && (
                        <div className="text-xs text-blue-600">RFQ #{conversation.rfqId}</div>
                      )}
                    </div>
                    {conversation.unread > 0 && (
                      <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate mb-1">
                    {conversation.lastMessage}
                  </p>
                  <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Chat Area */}
          <div className={`${showConversations ? 'hidden md:flex md:col-span-8' : 'col-span-12 md:col-span-8 flex'} flex-col`}>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowConversations(true)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  {currentConversation?.partnerName.charAt(0)}
                </div>
                <div>
                  <div className="text-gray-900">{currentConversation?.partnerName}</div>
                  {currentConversation?.rfqId && (
                    <div className="text-xs text-gray-600">
                      Regarding: RFQ #{currentConversation.rfqId}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === (user?.role === 'buyer' ? 'buyer' : 'seller') ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md ${
                      message.sender === (user?.role === 'buyer' ? 'buyer' : 'seller')
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    } rounded-lg px-4 py-3`}
                  >
                    {message.type === 'file' && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/20">
                        <Paperclip className="w-4 h-4" />
                        <span className="text-sm">Quote_Document.pdf</span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.sender === (user?.role === 'buyer' ? 'buyer' : 'seller')
                        ? 'text-blue-200'
                        : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-white text-gray-700">
                  Request Sample
                </button>
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-white text-gray-700">
                  Propose Change
                </button>
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-white text-gray-700">
                  View RFQ
                </button>
              </div>
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                
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
                  disabled={!messageInput.trim()}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
