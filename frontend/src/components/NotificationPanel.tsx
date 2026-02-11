import { X, MessageSquare, Package, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'message' | 'order' | 'quote' | 'alert' | 'info';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function NotificationPanel({
  notifications,
  onClose,
  onMarkAsRead,
  onDismiss,
}: NotificationPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5" />;
      case 'order':
        return <Package className="w-5 h-5" />;
      case 'quote':
        return <FileText className="w-5 h-5" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'bg-blue-100 text-blue-700';
      case 'order':
        return 'bg-purple-100 text-purple-700';
      case 'quote':
        return 'bg-orange-100 text-orange-700';
      case 'alert':
        return 'bg-red-100 text-red-700';
      case 'info':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const timeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="absolute right-0 top-full mt-3 w-[700px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-[500px] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-gray-600 mt-1">{unreadCount} new notification{unreadCount !== 1 ? 's' : ''}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-base font-medium">No notifications</p>
            <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 group ${
                  !notification.isRead ? 'bg-blue-50 border-l-blue-600' : 'border-l-transparent'
                }`}
                onClick={() => {
                  if (!notification.isRead) {
                    onMarkAsRead(notification.id);
                  }
                }}
              >
                <div className="flex gap-3 items-start justify-between">
                  <div className="flex gap-3 items-start flex-1">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-base mt-0.5 ${getTypeColor(
                        notification.type
                      )}`}
                    >
                      {getIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h4 className="font-semibold text-gray-900 text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                        {notification.title}
                      </h4>
                      <p className="text-xs text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                        {notification.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1 ml-1 flex-shrink-0">
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDismiss(notification.id);
                      }}
                      className="p-0.5 hover:bg-gray-300 rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Removed */}
    </div>
  );
}
