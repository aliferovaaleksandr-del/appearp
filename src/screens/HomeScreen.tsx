// src/screens/HomeScreen.tsx
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '../theme';

const QUICK_MOODS = [
  { emoji: '🌅', label: 'Тишина у моря', mood: 'Тихое место у моря, без людей, с закатом и хорошим вином' },
  { emoji: '🏔️', label: 'Горы + работа', mood: 'Уютный горный отель для удалённой работы с хорошим интернетом и кофе' },
  { emoji: '💑', label: 'Романтика', mood: 'Романтическое место для двоих с видом на воду и spa' },
  { emoji: '🧗', label: 'Приключения', mood: 'Активный отдых, треккинг, природа, адреналин' },
  { emoji: '😮‍💨', label: 'Перезагрузка', mood: 'Устал от города, нужен полный отдых и тишина, никаких людей' },
  { emoji: '🌿', label: 'Эко и природа', mood: 'Экологичное место в окружении природы, без туристов' },
];

export default function HomeScreen({ navigation }: any) {
  const handleQuickMood = (mood: string) => {
    navigation.navigate('Input', { prefillMood: mood });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>appe<Text style={styles.logoAccent}>arp</Text></Text>
          <TouchableOpacity style={styles.profileBtn}>
            <Ionicons name="person-circle-outline" size={28} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Найди отель под{'\n'}своё настроение</Text>
          <Text style={styles.heroSubtitle}>
            Не фильтры. Просто опиши как ты себя чувствуешь — AI подберёт идеальное место
          </Text>
        </View>

        {/* Mood Match CTA */}
        <TouchableOpacity
          style={styles.moodBtn}
          onPress={() => navigation.navigate('Input', {})}
          activeOpacity={0.85}
        >
          <View style={styles.moodBtnIcon}>
            <Ionicons name="sparkles" size={20} color={Colors.white} />
          </View>
          <View style={styles.moodBtnText}>
            <Text style={styles.moodBtnTitle}>Mood Match</Text>
            <Text style={styles.moodBtnSub}>Опиши настроение — получи 3 идеальных отеля</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>

        {/* Quick Moods */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>БЫСТРЫЙ СТАРТ</Text>
          <View style={styles.quickGrid}>
            {QUICK_MOODS.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.quickCard}
                onPress={() => handleQuickMood(item.mood)}
                activeOpacity={0.75}
              >
                <Text style={styles.quickEmoji}>{item.emoji}</Text>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* How it works */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>КАК ЭТО РАБОТАЕТ</Text>
          {[
            { step: '1', title: 'Опиши настроение', desc: '"Хочу тишину, утренний кофе на веранде и никаких людей"' },
            { step: '2', title: 'AI анализирует', desc: 'Claude понимает контекст и эмоции, не просто ключевые слова' },
            { step: '3', title: 'Получаешь 3 варианта', desc: 'С объяснением — почему именно тебе подойдёт каждый отель' },
          ].map((item) => (
            <View key={item.step} style={styles.stepCard}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{item.step}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{item.title}</Text>
                <Text style={styles.stepDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 40 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  logo: { fontSize: 20, fontWeight: '600', color: Colors.text, letterSpacing: -0.5 },
  logoAccent: { color: Colors.primary },
  profileBtn: { padding: 4 },
  hero: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.xl },
  heroTitle: { ...Typography.h1, color: Colors.text, marginBottom: Spacing.sm },
  heroSubtitle: { ...Typography.body, color: Colors.textSecondary, lineHeight: 22 },
  moodBtn: {
    marginHorizontal: Spacing.xl, backgroundColor: Colors.primary,
    borderRadius: Radius.lg, padding: Spacing.lg,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
  },
  moodBtnIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  moodBtnText: { flex: 1 },
  moodBtnTitle: { fontSize: 16, fontWeight: '600', color: Colors.white, marginBottom: 2 },
  moodBtnSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  section: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xxl },
  sectionLabel: { ...Typography.caption, color: Colors.textTertiary, marginBottom: Spacing.md },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  quickCard: {
    width: '31%', backgroundColor: Colors.backgroundSecondary,
    borderRadius: Radius.md, padding: Spacing.md,
    alignItems: 'center', gap: Spacing.xs,
  },
  quickEmoji: { fontSize: 24 },
  quickLabel: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center', fontWeight: '500' },
  stepCard: {
    flexDirection: 'row', gap: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: Radius.md, padding: Spacing.lg, marginBottom: Spacing.sm,
  },
  stepNum: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  stepNumText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 3 },
  stepDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, fontStyle: 'italic' },
});
