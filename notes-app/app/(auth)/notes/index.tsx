import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  RefreshControl,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../utils/authContext';

const colors = {
  background: '#0D1117',
  cardBg: '#161B22',
  accent: '#1F6FEB',
  secondaryAccent: '#58A6FF',
  success: '#238636',
  error: '#F85149',
  warning: '#D29922',
  text: '#C9D1D9',
  textDim: '#8B949E',
  border: '#30363D',
};

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isEncrypted: boolean;
  tags?: string[];
  color?: string;
}

// Note Card Component
const NoteCard: React.FC<{
  note: Note;
  onPress: () => void;
  onDelete: () => void;
  index: number;
}> = ({ note, onPress, onDelete, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Animated.View
      style={[
        styles.noteCard,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.noteHeader}>
          <View style={styles.noteTitleRow}>
            <View style={[styles.noteColorIndicator, { backgroundColor: note.color || colors.accent }]} />
            <Text style={styles.noteTitle} numberOfLines={1}>
              {note.title || 'Untitled Note'}
            </Text>
          </View>
          {note.isEncrypted && (
            <View style={styles.encryptedBadge}>
              <Ionicons name="lock-closed" size={12} color={colors.success} />
            </View>
          )}
        </View>
        
        <Text style={styles.noteContent} numberOfLines={2}>
          {note.content || 'No content'}
        </Text>
        
        <View style={styles.noteFooter}>
          <Text style={styles.noteDate}>
            {formatDate(note.updatedAt)}
          </Text>
          <TouchableOpacity
            onPress={onDelete}
            style={styles.deleteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Create Note Modal Component
const CreateNoteModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
}> = ({ visible, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(true);
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Error', 'Please enter a title or content');
      return;
    }
    onSave(title, content);
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>CREATE SECURE NOTE</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={colors.textDim} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>TITLE</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter note title"
                placeholderTextColor={colors.textDim}
                value={title}
                onChangeText={setTitle}
                autoFocus
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CONTENT</Text>
              <TextInput
                style={[styles.modalInput, styles.modalTextarea]}
                placeholder="Enter secure content"
                placeholderTextColor={colors.textDim}
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.encryptionToggle}>
              <Ionicons name="shield-checkmark" size={20} color={colors.success} />
              <Text style={styles.encryptionText}>256-BIT ENCRYPTION</Text>
              <View style={styles.encryptionStatus}>
                <Text style={styles.encryptionStatusText}>ENABLED</Text>
              </View>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Ionicons name="lock-closed" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>SECURE & SAVE</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  
  const router = useRouter();
  const { user } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadNotes();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadNotes = () => {
    // Mock data (replace with Firebase Firestore )
    const mockNotes: Note[] = [
      {
        id: '1',
        title: 'Security Protocols',
        content: 'Important security measures for the vault system...',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        isEncrypted: true,
        color: colors.accent,
      },
      {
        id: '2',
        title: 'API Keys',
        content: 'Production API keys and configurations...',
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14'),
        isEncrypted: true,
        color: colors.warning,
      },
      {
        id: '3',
        title: 'Meeting Notes',
        content: 'Team sync discussion points and action items...',
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-13'),
        isEncrypted: false,
        color: colors.secondaryAccent,
      },
    ];
    setNotes(mockNotes);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadNotes();
      setRefreshing(false);
    }, 1000);
  };

  const handleCreateNote = (title: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      isEncrypted: true,
      color: colors.accent,
    };
    
    setNotes([newNote, ...notes]);
    // In production, save to Firebase
  };

  const handleDeleteNote = (noteId: string) => {
    Alert.alert(
      'Delete Secure Note',
      'This action cannot be undone. The note will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setNotes(notes.filter(note => note.id !== noteId));
            // In production, delete from Firebase
          },
        },
      ],
    );
  };

  const handleBulkDelete = () => {
    if (selectedNotes.length === 0) return;
    
    Alert.alert(
      `Delete ${selectedNotes.length} Notes`,
      'This action cannot be undone. All selected notes will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => {
            setNotes(notes.filter(note => !selectedNotes.includes(note.id)));
            setSelectedNotes([]);
            setIsSelectionMode(false);
          },
        },
      ],
    );
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>SECURE NOTES</Text>
          <Text style={styles.headerSubtitle}>
            {notes.length} {notes.length === 1 ? 'note' : 'notes'} • All encrypted
          </Text>
        </View>
        <View style={styles.headerActions}>
          {isSelectionMode ? (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                setIsSelectionMode(false);
                setSelectedNotes([]);
              }}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setIsSelectionMode(true)}
            >
              <Ionicons name="checkmark-circle-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textDim} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search secure notes..."
          placeholderTextColor={colors.textDim}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textDim} />
          </TouchableOpacity>
        )}
      </View>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="document-lock" size={64} color={colors.textDim} />
          </View>
          <Text style={styles.emptyTitle}>No Secure Notes</Text>
          <Text style={styles.emptySubtitle}>
            Create your first encrypted note to get started
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => setCreateModalVisible(true)}
          >
            <Ionicons name="add-circle" size={20} color={colors.accent} />
            <Text style={styles.emptyButtonText}>CREATE NOTE</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <NoteCard
              note={item}
              index={index}
              onPress={() => {
                if (isSelectionMode) {
                  if (selectedNotes.includes(item.id)) {
                    setSelectedNotes(selectedNotes.filter(id => id !== item.id));
                  } else {
                    setSelectedNotes([...selectedNotes, item.id]);
                  }
                } else {
                  router.push(`/(auth)/notes/${item.id}`);
                }
              }}
              onDelete={() => handleDeleteNote(item.id)}
            />
          )}
          contentContainerStyle={styles.notesList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
        />
      )}

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        {isSelectionMode && selectedNotes.length > 0 && (
          <TouchableOpacity
            style={[styles.fab, styles.deleteFab]}
            onPress={handleBulkDelete}
          >
            <Ionicons name="trash" size={24} color="#fff" />
            <Text style={styles.fabBadge}>{selectedNotes.length}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.fab, styles.createFab]}
          onPress={() => setCreateModalVisible(true)}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Create Note Modal */}
      <CreateNoteModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSave={handleCreateNote}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textDim,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    marginHorizontal: 24,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  notesList: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  noteCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  noteColorIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  encryptedBadge: {
    backgroundColor: `${colors.success}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  noteContent: {
    fontSize: 14,
    color: colors.textDim,
    lineHeight: 20,
    marginBottom: 12,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteDate: {
    fontSize: 12,
    color: colors.textDim,
  },
  deleteButton: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${colors.accent}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textDim,
    textAlign: 'center',
    marginBottom: 32,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  emptyButtonText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: 8,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createFab: {
    backgroundColor: colors.accent,
  },
  deleteFab: {
    backgroundColor: colors.error,
    marginBottom: 16,
  },
  fabBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.error,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
  },
  modalBody: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDim,
    letterSpacing: 1,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  modalTextarea: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  encryptionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.success}10`,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${colors.success}30`,
  },
  encryptionText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  encryptionStatus: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  encryptionStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDim,
    letterSpacing: 1,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.accent,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
    marginLeft: 8,
  },
});