import { Notification } from './NotificationPanel';
import { MessageSquare, Package, FileText, AlertCircle, CheckCircle, Clock, Trash2 } from 'lucide-react';

interface NotificationsPageProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onAction: (notification: Notification) => void;
}

export function NotificationsPage({
  notifications,
  onMarkAsRead,
  onDismiss,
  onAction,
}: NotificationsPageProps) {
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
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'order':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'quote':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'alert':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'info':
        return 'bg-green-50 text-green-600 border-green-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'bg-blue-100 text-blue-800';
      case 'order':
        return 'bg-purple-100 text-purple-800';
      case 'quote':
        return 'bg-orange-100 text-orange-800';
      case 'alert':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const timeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadNotifications.length > 0
              ? `${unreadNotifications.length} unread notification${unreadNotifications.length !== 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Clock className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No notifications yet</p>
            <p className="text-gray-400 text-sm mt-2">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Unread Notifications */}
            {unreadNotifications.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Unread</h2>
                <div className="space-y-3">
                  {unreadNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`bg-white rounded-lg shadow-sm border-2 ${getTypeColor(
                        notification.type
                      )} p-4 hover:shadow-md transition-all cursor-pointer`}
                      onClick={() => {
                        onMarkAsRead(notification.id);
                        if (notification.actionUrl) {
                          onAction(notification);
                        }
                      }}
                    >
                      <div className="flex gap-4">
                        <div
                          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getTypeBadgeColor(
                            notification.type
                          )}`}
                        >
                          {getIcon(notification.type)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {notification.title}
                              </h3>
                              <p className="text-gray-600 text-sm mt-1">
                                {notification.description}
                              </p>
                              <p className="text-gray-500 text-xs mt-2">
                                {timeAgo(notification.timestamp)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <span className="inline-block w-3 h-3 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDismiss(notification.id);
                                }}
                                className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                <Trash2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Read Notifications */}
            {readNotifications.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Earlier</h2>
                <div className="space-y-3">
                  {readNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer"
                      onClick={() => {
                        if (notification.actionUrl) {
                          onAction(notification);
                        }
                      }}
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 text-gray-600">
                          {getIcon(notification.type)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-gray-700">
                                {notification.title}
                              </h3>
                              <p className="text-gray-500 text-sm mt-1">
                                {notification.description}
                              </p>
                              <p className="text-gray-400 text-xs mt-2">
                                {timeAgo(notification.timestamp)}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDismiss(notification.id);
                              }}
                              className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
