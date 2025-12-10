import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Input, Avatar, Badge } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Feather';
import { mockConversations } from '../../services/mockData';
import { Conversation } from '../../types';

export default function ChatScreen() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState('');

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => setSelectedConversation(item)}
    >
      <Avatar
        rounded
        size={50}
        title={item.participantName.substring(0, 2)}
        containerStyle={styles.avatar}
      />
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.participantName}>{item.participantName}</Text>
          <Text style={styles.time}>{new Date(item.lastMessageTime).toLocaleTimeString()}</Text>
        </View>
        <View style={styles.conversationFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <Badge value={item.unreadCount} status="primary" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!selectedConversation) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text h4>Messages</Text>
        </View>
        <FlatList
          data={mockConversations}
          renderItem={renderConversation}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => setSelectedConversation(null)}>
          <Icon name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.chatHeaderInfo}>
          <Text style={styles.chatHeaderName}>{selectedConversation.participantName}</Text>
          <Text style={styles.chatHeaderRole}>{selectedConversation.participantRole}</Text>
        </View>
      </View>

      <View style={styles.messagesContainer}>
        <Text style={styles.emptyChat}>No messages yet. Start a conversation!</Text>
      </View>

      <View style={styles.inputContainer}>
        <Input
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          containerStyle={styles.inputWrapper}
          inputContainerStyle={styles.input}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Icon name="send" size={24} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  avatar: {
    backgroundColor: '#2563eb',
  },
  conversationContent: {
    flex: 1,
    marginLeft: 12,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  time: {
    fontSize: 13,
    color: '#94a3b8',
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
    marginRight: 8,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  chatHeaderInfo: {
    marginLeft: 16,
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  chatHeaderRole: {
    fontSize: 14,
    color: '#64748b',
  },
  messagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyChat: {
    fontSize: 16,
    color: '#94a3b8',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  sendButton: {
    padding: 12,
  },
});
