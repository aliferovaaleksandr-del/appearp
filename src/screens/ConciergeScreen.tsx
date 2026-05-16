// src/screens/ConciergeScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Radius } from '../theme';
import { getConciergeReply, type ChatMessage, type Hotel } from '../services/claude';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const QUICK_QUESTIONS = [
  'Как добраться?',
  'Что включён завтрак?',
  'Лучшее время года?',
  'Есть ли парковка?',
];

export default function ConciergeScreen({ navigation, route }: any) {
  const hotel: Hotel = route.params?.hotel;
  const mood: string = route.params?.mood || '';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      text: `Привет! Расскажу всё о **${hotel?.name}** в ${hotel?.location}. Это место отлично подойдёт под твоё настроение — ${hotel?.atmosphere || 'идеальная атмосфера'}. О чём хочешь узнать?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const chatHistory = (): ChatMessage[] =>
    messages.map(m => ({ role: m.role, content: m.text }));

  const sendMessage = async (text?: string) => {
    const msgText = text ?? input.trim();
    if (!msgText || loading) return;
    setInput('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: msgText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = [...chatHistory(), { role: 'user' as const, content: msgText }];
      const reply = await getConciergeReply(history, hotel, mood);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: reply };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: 'Произошла ошибка. Попробуй ещё раз.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const renderBold = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1
        ? <Text key={i} style={{ fontWeight: '700' }}>{part}</Text>
        : <Text key={i}>{part}</Text>
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.msgRow, item.role === 'user' ? styles.msgRowUser : styles.msgRowAI]}>
      {item.role === 'assistant' && (
        <View style={styles.avatar}>
          <Ionicons name="sparkles" size={14} color={Colors.white} />
        </View>
      )}
      <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleAI]}>
        <Text style={item.role === 'user' ? styles.bubbleUserText : styles.bubbleAIText}>
          {renderBold(item.text)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Ionicons name="sparkles" size={16} color={Colors.white} />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Консьерж</Text>
            <Text style={styles.headerSub}>{hotel?.name}</Text>
          </View>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Hotel context bar */}
        <View style={styles.contextBar}>
          <Ionicons name="location-outline" size={14} color={Colors.primary} />
          <Text style={styles.contextText}>
            <Text style={{ color: Colors.text, fontWeight: '500' }}>{hotel?.name}</Text>
            {' · '}{hotel?.location} · ${hotel?.price_per_night}/ночь
          </Text>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={m => m.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={loading ? (
            <View style={[styles.msgRow, styles.msgRowAI]}>
              <View style={styles.avatar}>
                <Ionicons name="sparkles" size={14} color={Colors.white} />
              </View>
              <View style={styles.bubbleAI}>
                <ActivityIndicator size="small" color={Colors.textTertiary} />
              </View>
            </View>
          ) : null}
        />

        {/* Quick questions */}
        {messages.length <= 1 && (
          <View style={styles.quickList}>
            {QUICK_QUESTIONS.map(q => (
              <TouchableOpacity key={q} style={styles.quickChip} onPress={() => sendMessage(q)}>
                <Text style={styles.quickChipText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Спроси про отель..."
            placeholderTextColor={Colors.textTertiary}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            <Ionicons name="send" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    borderBottomWidth: 0.5, borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: Radius.sm,
    borderWidth: 0.5, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  headerAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 14, fontWeight: '600', color: Colors.text },
  headerSub: { fontSize: 11, color: Colors.textTertiary },
  contextBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    marginHorizontal: Spacing.xl, marginVertical: Spacing.sm,
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.sm + 2, borderRadius: Radius.sm,
  },
  contextText: { fontSize: 12, color: Colors.textSecondary, flex: 1 },
  messagesList: { padding: Spacing.xl, paddingBottom: Spacing.md, gap: Spacing.md },
  msgRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-end' },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowAI: { justifyContent: 'flex-start' },
  avatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    marginBottom: 2,
  },
  bubble: { maxWidth: '78%', padding: Spacing.md, borderRadius: Radius.lg },
  bubbleAI: { backgroundColor: Colors.backgroundSecondary, borderBottomLeftRadius: 4 },
  bubbleUser: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  bubbleAIText: { fontSize: 14, color: Colors.text, lineHeight: 20 },
  bubbleUserText: { fontSize: 14, color: Colors.white, lineHeight: 20 },
  quickList: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm,
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing.sm,
  },
  quickChip: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: Radius.pill, borderWidth: 0.5,
    borderColor: Colors.primary,
  },
  quickChipText: { fontSize: 13, color: Colors.primary },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    borderTopWidth: 0.5, borderTopColor: Colors.border,
  },
  textInput: {
    flex: 1, height: 40, paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill, borderWidth: 0.5,
    borderColor: Colors.border, fontSize: 14,
    color: Colors.text, backgroundColor: Colors.background,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.textTertiary },
});
