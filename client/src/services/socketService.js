import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.onlineUsers = new Set();
    this.onlineStatusCallbacks = [];
  }

  connect(token) {
    if (this.socket && this.isConnected) {
      return;
    }

    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8080';
    
    this.socket = io(SOCKET_URL, {
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });

    // Listen for online users updates
    this.socket.on('online_users', (users) => {
      console.log('Socket: Received online users:', users);
      this.onlineUsers = new Set(users);
      this.notifyOnlineStatusCallbacks();
    });

    this.socket.on('user_online', (userId) => {
      console.log('Socket: User came online:', userId);
      this.onlineUsers.add(userId);
      this.notifyOnlineStatusCallbacks();
    });

    this.socket.on('user_offline', (userId) => {
      console.log('Socket: User went offline:', userId);
      this.onlineUsers.delete(userId);
      this.notifyOnlineStatusCallbacks();
    });
  }

  authenticate(userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('authenticate', userId);
    }
  }

  sendMessage(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('private_message', data);
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on('message_sent', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  sendTypingIndicator(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', data);
    }
  }

  // Online status methods
  isUserOnline(userId) {
    return this.onlineUsers.has(userId);
  }

  onOnlineStatusChange(callback) {
    this.onlineStatusCallbacks.push(callback);
  }

  notifyOnlineStatusCallbacks() {
    this.onlineStatusCallbacks.forEach(callback => callback(this.onlineUsers));
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export default new SocketService(); 