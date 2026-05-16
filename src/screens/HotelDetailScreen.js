// src/screens/HotelDetailScreen.js
import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, KeyboardAvoidingView,
  Platform, FlatList, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, shadow } from '../theme';
import { getConciergeReply } from '../services/claude';
import * as Haptics from 'expo-haptics';

const QUICK_REPLIES = [
  'Лучшее время для посещения?',
  'Есть ли трансфер из аэропорта?',
  'Что включено в завтрак?',
  'Посоветуй активности рядом',
];

const AMENITIES = [
  { icon: 'wifi', label: 'Wi-Fi' },
  { icon: 'water', label: 'Бассейн' },
  { icon: 'flower', label: 'Спа' },
  { icon: 'restaurant', label: 'Ресторан' },
  { icon: 'car', label: 'Парковка' },
  { icon: 'fitness', label: 'Фитнес' },
];

export default function HotelDetailScreen({ navigation, route }) {
  const { hotel } = route.params;
  const hotelName = hotel?.name || 'Отель';
  const hotelColor = hotel?.color_hex || '#2E4A3A';
  const hotelPrice = hotel?.price_per_night || hotel?.price || 420;
  const hotelLocation = hotel?.location || hotel?.location || 'Мир';

  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1', role: 'assistant',
      text: `Добрый день! Я ваш персональный консьерж в ${hotelName}. Чем могу помочь? 🌿`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const chatHistory = useRef([]);

  const sendMessage = async (text) => {
    const msgText = text || inputText.trim();
    if (!msgText) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInputText('');

    const userMsg = { id: Date.now().toString(), role: 'user', text: msgText };
    setMessages(prev => [...prev, userMsg]);

    chatHistory.current.push({ role: 'user', content: msgText });
    setIsTyping(true);

    try {
      const reply = await getConciergeReply({
        hotelName,
        userMessage: msgText,
        history: chatHistory.current.slice(-6),
      });

      chatHistory.current.push({ role: 'assistant', content: reply });
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: 'assistant',
        text: 'Секунду, уточняю информацию... Попробуй ещё раз через момент.',
      }]);
    } finally {
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Back */}
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.muted} />
          </TouchableOpacity>

          {/* Hero */}
          <View style={[styles.hero, { backgroundColor: hotelColor }]}>
            <View style={styles.heroContent}>
              <Text style={styles.heroLoc}>{(typeof hotelLocation === 'string' ? hotelLocation : '').toUpperCase()}</Text>
              <Text style={styles.heroName}>{hotelName}</Text>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map(i => (
                  <Ionicons key={i} name="star" size={14} color={colors.goldLight} />
                ))}
                <Text style={styles.reviewCount}>  4.9 · 2,847 отзывов</Text>
              </View>
            </View>
          </View>

          <View style={styles.content}>
            {/* Booking widget */}
            <View style={styles.bookingCard}>
              <View style={styles.priceRow}>
                <Text style={styles.price}>${hotelPrice}</Text>
                <Text style={styles.priceUnit}> / ночь</Text>
              </View>
              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => Alert.alert('Бронирование', `Переход к оплате за ${hotelName}`)}
              >
                <Text style={styles.bookBtnText}>Забронировать</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.conciergeBtn}
                onPress={() => setShowChat(true)}
              >
                <Ionicons name="chatbubble-outline" size={16} color={colors.ink} />
                <Text style={styles.conciergeBtnText}>  Спросить консьержа</Text>
              </TouchableOpacity>
              <Text style={styles.cancelNote}>Бесплатная отмена до заезда</Text>
            </View>

            {/* About */}
            <Text style={styles.sectionTitle}>Об отеле</Text>
            <Text style={styles.desc}>
              {hotel?.why_you ||
                `Один из лучших отелей в регионе. Исключительный сервис, потрясающая природа и атмосфера, которая заставляет забыть обо всём. Идеальное место для тех, кто ценит тишину и качество.`}
            </Text>

            {/* Amenities */}
            <Text style={styles.sectionTitle}>Удобства</Text>
            <View style={styles.amenitiesGrid}>
              {AMENITIES.map((a, i) => (
                <View key={i} style={styles.amenityBlock}>
                  <Ionicons name={`${a.icon}-outline`} size={20} color={colors.gold} />
                  <Text style={styles.amenityLabel}>{a.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>

        {/* Concierge Chat */}
        {showChat && (
          <View style={styles.chatOverlay}>
            <View style={styles.chatCard}>
              {/* Chat header */}
              <View style={styles.chatHeader}>
                <View style={styles.chatAvatar}>
                  <Ionicons name="diamond" size={16} color={colors.gold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.chatName}>Amelia · Консьерж</Text>
                  <View style={styles.onlineRow}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.onlineText}>Онлайн</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setShowChat(false)}>
                  <Ionicons name="close" size={22} color={colors.muted} />
                </TouchableOpacity>
              </View>

              {/* Messages */}
              <FlatList
                ref={scrollRef}
                data={[...messages, ...(isTyping ? [{ id: 'typing', role: 'typing' }] : [])]}
                keyExtractor={item => item.id}
                style={styles.messages}
                contentContainerStyle={{ padding: 12, gap: 10 }}
                renderItem={({ item }) => {
                  if (item.role === 'typing') {
                    return (
                      <View style={styles.msgBot}>
                        <View style={styles.bubbleBot}>
                          <Text style={styles.bubbleText}>...</Text>
                        </View>
                      </View>
                    );
                  }
                  return (
                    <View style={item.role === 'user' ? styles.msgUser : styles.msgBot}>
                      <View style={item.role === 'user' ? styles.bubbleUser : styles.bubbleBot}>
                        <Text style={item.role === 'user' ? styles.bubbleTextUser : styles.bubbleText}>
                          {item.text}
                        </Text>
                      </View>
                    </View>
                  );
                }}
                onContentSizeChange={() => scrollRef.current?.scrollToEnd()}
              />

              {/* Quick replies */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickScroll}>
                {QUICK_REPLIES.map((qr, i) => (
                  <TouchableOpacity key={i} style={styles.quickReply} onPress={() => sendMessage(qr)}>
                    <Text style={styles.quickReplyText}>{qr}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Input */}
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Напиши вопрос..."
                  placeholderTextColor={colors.muted}
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={() => sendMessage()}
                  returnKeyType="send"
                />
                <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage()}>
                  <Ionicons name="send" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  back: { padding: spacing.md, paddingBottom: 0 },

  hero: { height: 220, justifyContent: 'flex-end', padding: spacing.lg },
  heroContent: { },
  heroLoc: { fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, marginBottom: 4 },
  heroName: { fontSize: 30, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  starsRow: { flexDirection: 'row', alignItems: 'center' },
  reviewCount: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },

  content: { padding: spacing.md },

  // Booking card
  bookingCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.lg,
    borderWidth: 1, borderColor: colors.border, ...shadow.sm,
  },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 },
  price: { fontSize: 28, fontWeight: '700', color: colors.ink },
  priceUnit: { fontSize: 13, color: colors.muted },
  bookBtn: {
    backgroundColor: colors.gold, borderRadius: radius.md,
    paddingVertical: 13, alignItems: 'center', marginBottom: 8,
  },
  bookBtnText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  conciergeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, paddingVertical: 11,
    borderWidth: 1, borderColor: colors.border, marginBottom: 8,
  },
  conciergeBtnText: { fontSize: 13, fontWeight: '500', color: colors.ink },
  cancelNote: { fontSize: 11, color: colors.muted, textAlign: 'center' },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.ink, marginBottom: 10, marginTop: 4 },
  desc: { fontSize: 13, color: colors.muted, lineHeight: 22, marginBottom: spacing.lg },

  // Amenities
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  amenityBlock: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: 12, minWidth: '45%', flex: 1,
    borderWidth: 1, borderColor: colors.border,
  },
  amenityLabel: { fontSize: 12, fontWeight: '500', color: colors.ink },

  // Chat overlay
  chatOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    minHeight: 400,
  },
  chatCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  chatHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 16, borderBottomWidth: 1, borderColor: colors.border,
  },
  chatAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.goldPale, justifyContent: 'center', alignItems: 'center',
  },
  chatName: { fontSize: 14, fontWeight: '600', color: colors.ink },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  onlineText: { fontSize: 11, color: colors.success },

  messages: { maxHeight: 220 },

  msgBot: { alignSelf: 'flex-start', maxWidth: '80%' },
  msgUser: { alignSelf: 'flex-end', maxWidth: '80%' },
  bubbleBot: {
    backgroundColor: colors.bg, borderRadius: 14, borderBottomLeftRadius: 4,
    padding: 10,
  },
  bubbleUser: {
    backgroundColor: colors.ink, borderRadius: 14, borderBottomRightRadius: 4,
    padding: 10,
  },
  bubbleText: { fontSize: 13, color: colors.ink, lineHeight: 18 },
  bubbleTextUser: { fontSize: 13, color: '#FFFFFF', lineHeight: 18 },

  quickScroll: { paddingHorizontal: 12, paddingVertical: 8 },
  quickReply: {
    paddingHorizontal: 12, paddingVertical: 7, marginRight: 6,
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  quickReplyText: { fontSize: 11, color: colors.muted },

  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 12, borderTopWidth: 1, borderColor: colors.border,
  },
  input: {
    flex: 1, backgroundColor: colors.bg, borderRadius: 22,
    paddingHorizontal: 14, paddingVertical: 9,
    fontSize: 13, color: colors.ink,
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.gold, justifyContent: 'center', alignItems: 'center',
  },
});
