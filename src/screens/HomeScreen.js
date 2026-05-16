// src/screens/HomeScreen.js
import React, { useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, shadow } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const FEATURED = [
  { name: 'Soneva Fushi', location: 'Мальдивы', price: 890, color: '#3D5A7A' },
  { name: 'Ritz-Carlton Kyoto', location: 'Япония', price: 650, color: '#6B4E3D' },
  { name: 'Nayara Springs', location: 'Коста-Рика', price: 420, color: '#2E6B4F' },
  { name: 'Sublime Comporta', location: 'Португалия', price: 310, color: '#5A4A6B' },
];

const MOODS = ['устал от города', 'хочу тишины', 'нужен уют', 'романтика'];

export default function HomeScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>appearp<Text style={styles.logoDot}>.</Text></Text>
          <TouchableOpacity style={styles.avatar}>
            <Ionicons name="person-outline" size={18} color={colors.gold} />
          </TouchableOpacity>
        </View>

        {/* Mood Match Card — главная фишка */}
        <Animated.View style={[styles.moodCardWrap, { transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity
            activeOpacity={1}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={() => navigation.navigate('MoodInput')}
            style={styles.moodCard}
          >
            <View style={styles.moodCardLabel}>
              <Ionicons name="sparkles" size={11} color="rgba(255,255,255,0.6)" />
              <Text style={styles.moodCardLabelText}>  НОВАЯ ФИШКА</Text>
            </View>
            <Text style={styles.moodCardTitle}>
              Скажи как ты себя{'\n'}чувствуешь —
            </Text>
            <Text style={styles.moodCardTitleItalic}>
              AI найдёт идеальный отель
            </Text>

            <View style={styles.moodPills}>
              {MOODS.map((m, i) => (
                <View key={i} style={[styles.moodPill, i < 2 && styles.moodPillActive]}>
                  <Text style={[styles.moodPillText, i < 2 && styles.moodPillTextActive]}>{m}</Text>
                </View>
              ))}
            </View>

            <View style={styles.moodBtn}>
              <Ionicons name="sparkles" size={16} color={colors.ink} />
              <Text style={styles.moodBtnText}>  Запустить Mood Match</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Popular section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Популярное сейчас</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>все →</Text>
          </TouchableOpacity>
        </View>

        {FEATURED.map((h, i) => (
          <TouchableOpacity
            key={i}
            style={styles.hotelRow}
            onPress={() => navigation.navigate('HotelDetail', { hotel: h })}
            activeOpacity={0.75}
          >
            <View style={[styles.hotelThumb, { backgroundColor: h.color }]} />
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>{h.name}</Text>
              <Text style={styles.hotelLoc}>{h.location}</Text>
            </View>
            <Text style={styles.hotelPrice}>${h.price}</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm,
  },
  logo: { fontSize: 26, fontWeight: '700', color: colors.ink, letterSpacing: -0.5 },
  logoDot: { color: colors.gold },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.goldPale,
    justifyContent: 'center', alignItems: 'center',
  },

  // Mood Match card
  moodCardWrap: { marginHorizontal: spacing.md, marginBottom: spacing.lg },
  moodCard: {
    backgroundColor: colors.ink, borderRadius: radius.xl, padding: spacing.lg,
    ...shadow.md,
  },
  moodCardLabel: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  moodCardLabelText: {
    fontSize: 10, fontWeight: '600', letterSpacing: 1.4,
    color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase',
  },
  moodCardTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', lineHeight: 28 },
  moodCardTitleItalic: {
    fontSize: 22, fontWeight: '300', fontStyle: 'italic',
    color: colors.goldLight, marginBottom: spacing.md, lineHeight: 28,
  },
  moodPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: spacing.md },
  moodPill: {
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  moodPillActive: { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.4)' },
  moodPillText: { fontSize: 11, fontWeight: '500', color: 'rgba(255,255,255,0.5)' },
  moodPillTextActive: { color: '#FFFFFF' },
  moodBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.goldLight, borderRadius: radius.md, paddingVertical: 13,
  },
  moodBtnText: { fontSize: 14, fontWeight: '600', color: colors.ink },

  // Section
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.md, marginBottom: spacing.sm,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.ink },
  sectionLink: { fontSize: 12, color: colors.gold },

  // Hotel rows
  hotelRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: spacing.md, marginBottom: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: 12, ...shadow.sm,
  },
  hotelThumb: { width: 44, height: 44, borderRadius: 10, marginRight: 12 },
  hotelInfo: { flex: 1 },
  hotelName: { fontSize: 14, fontWeight: '600', color: colors.ink },
  hotelLoc: { fontSize: 12, color: colors.muted, marginTop: 2 },
  hotelPrice: { fontSize: 16, fontWeight: '700', color: colors.ink },
});
