// src/screens/ResultsScreen.tsx
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '../theme';
import type { Hotel, MoodMatchResult } from '../services/claude';

const GRADIENTS = [
  ['#9FE1CB', '#1D9E75'] as const,
  ['#B5D4F4', '#185FA5'] as const,
  ['#FAC775', '#BA7517'] as const,
];
const EMOJIS = ['🌿', '🏔️', '🌅'];

export default function ResultsScreen({ navigation, route }: any) {
  const result: MoodMatchResult = route.params?.result;
  const mood: string = route.params?.mood || '';

  if (!result) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Нет данных. Попробуй снова.</Text>
      </SafeAreaView>
    );
  }

  const openBooking = (hotel: Hotel) => {
    const url = hotel.booking_url || `https://booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name + ' ' + hotel.location)}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Твои совпадения</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backBtn}>
          <Ionicons name="home-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        {result.summary ? (
          <View style={styles.summaryCard}>
            <Ionicons name="sparkles" size={16} color={Colors.primary} />
            <Text style={styles.summaryText}>{result.summary}</Text>
          </View>
        ) : null}

        {/* Hotel cards */}
        {result.hotels.map((hotel, i) => (
          <View key={i} style={styles.hotelCard}>
            {/* Image area */}
            <LinearGradient colors={GRADIENTS[i % GRADIENTS.length]} style={styles.hotelImg}>
              <Text style={styles.hotelEmoji}>{EMOJIS[i % EMOJIS.length]}</Text>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{i + 1}</Text>
              </View>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>{hotel.match_score}%</Text>
              </View>
            </LinearGradient>

            {/* Body */}
            <View style={styles.hotelBody}>
              <Text style={styles.hotelName}>{hotel.name}</Text>

              <View style={styles.hotelMeta}>
                <Ionicons name="location-outline" size={12} color={Colors.textTertiary} />
                <Text style={styles.hotelMetaText}>
                  {hotel.location} · {hotel.country} · {hotel.type}
                </Text>
              </View>

              {/* Why */}
              <View style={styles.whyBox}>
                <Text style={styles.whyText}>"{hotel.why}"</Text>
              </View>

              {/* Highlights */}
              <View style={styles.highlights}>
                {hotel.highlights.map((tag, j) => (
                  <View key={j} style={styles.highlight}>
                    <Text style={styles.highlightText}>{tag}</Text>
                  </View>
                ))}
              </View>

              {/* Footer */}
              <View style={styles.hotelFooter}>
                <View>
                  <Text style={styles.priceAmount}>${hotel.price_per_night}</Text>
                  <Text style={styles.priceLabel}>за ночь</Text>
                </View>
                <View style={styles.footerBtns}>
                  <TouchableOpacity
                    style={styles.conciergeBtn}
                    onPress={() => navigation.navigate('Concierge', { hotel, mood })}
                  >
                    <Ionicons name="chatbubble-outline" size={14} color={Colors.primary} />
                    <Text style={styles.conciergeBtnText}>Консьерж</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => openBooking(hotel)}
                  >
                    <Text style={styles.bookBtnText}>Забронировать</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Try again */}
        <TouchableOpacity style={styles.tryAgainBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="refresh" size={16} color={Colors.primary} />
          <Text style={styles.tryAgainText}>Попробовать другое настроение</Text>
        </TouchableOpacity>
      </ScrollView>
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
  headerTitle: { fontSize: 15, fontWeight: '600', color: Colors.text },
  content: { padding: Spacing.xl, paddingBottom: 40 },
  summaryCard: {
    flexDirection: 'row', gap: Spacing.sm,
    backgroundColor: Colors.primaryLight, borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.lg, alignItems: 'flex-start',
  },
  summaryText: { flex: 1, fontSize: 13, color: Colors.primaryDark, lineHeight: 19 },
  hotelCard: {
    backgroundColor: Colors.background, borderRadius: Radius.lg,
    borderWidth: 0.5, borderColor: Colors.border,
    overflow: 'hidden', marginBottom: Spacing.lg,
  },
  hotelImg: { height: 150, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  hotelEmoji: { fontSize: 52, opacity: 0.4 },
  rankBadge: {
    position: 'absolute', top: 10, left: 10,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  rankText: { fontSize: 12, fontWeight: '700', color: Colors.primaryDark },
  scoreBadge: {
    position: 'absolute', top: 10, right: 10,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill,
  },
  scoreText: { fontSize: 12, fontWeight: '600', color: Colors.white },
  hotelBody: { padding: Spacing.lg },
  hotelName: { fontSize: 17, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  hotelMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: Spacing.md },
  hotelMetaText: { fontSize: 12, color: Colors.textTertiary },
  whyBox: {
    backgroundColor: Colors.backgroundSecondary, borderRadius: Radius.sm,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  whyText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, fontStyle: 'italic' },
  highlights: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: Spacing.md },
  highlight: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill,
  },
  highlightText: { fontSize: 11, color: Colors.textSecondary },
  hotelFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceAmount: { fontSize: 20, fontWeight: '700', color: Colors.text },
  priceLabel: { fontSize: 11, color: Colors.textTertiary },
  footerBtns: { flexDirection: 'row', gap: Spacing.sm },
  conciergeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: Radius.sm, borderWidth: 0.5, borderColor: Colors.primary,
  },
  conciergeBtnText: { fontSize: 13, color: Colors.primary, fontWeight: '500' },
  bookBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.sm,
  },
  bookBtnText: { fontSize: 13, color: Colors.white, fontWeight: '500' },
  tryAgainBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, paddingVertical: Spacing.lg,
  },
  tryAgainText: { fontSize: 14, color: Colors.primary, fontWeight: '500' },
  errorText: { textAlign: 'center', marginTop: 40, color: Colors.textSecondary },
});
