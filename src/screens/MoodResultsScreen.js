// src/screens/MoodResultsScreen.js
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, shadow } from '../theme';
import * as Haptics from 'expo-haptics';

export default function MoodResultsScreen({ navigation, route }) {
  const { result } = route.params;
  const { mood_summary, hotels } = result;

  const handleBook = (hotel) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('HotelDetail', { hotel });
  };

  const handleShare = async () => {
    const top = hotels[0];
    await Share.share({
      message: `Нашёл идеальный отель через appearp 🏨\n${top.name}, ${top.location} — ${top.match_percent}% совпадение с моим настроением!\nСкачай appearp и найди свой: appearp.app`,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('MoodInput')} style={styles.back}>
            <Ionicons name="arrow-back" size={20} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
            <Ionicons name="share-outline" size={20} color={colors.ink} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Твой идеальный отель</Text>
          <View style={styles.moodSummaryBox}>
            <Ionicons name="sparkles" size={14} color={colors.gold} />
            <Text style={styles.moodSummary}>  {mood_summary}</Text>
          </View>

          {/* Hotel cards */}
          {hotels.map((hotel) => (
            <TouchableOpacity
              key={hotel.rank}
              style={styles.card}
              onPress={() => handleBook(hotel)}
              activeOpacity={0.88}
            >
              {/* Color banner */}
              <View style={[styles.cardBanner, { backgroundColor: hotel.color_hex }]}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{hotel.rank}</Text>
                </View>
                <View style={styles.matchBadge}>
                  <Ionicons name="sparkles" size={12} color={colors.goldLight} />
                  <Text style={styles.matchText}> {hotel.match_percent}% совпадение</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardLoc}>{hotel.location.toUpperCase()}</Text>
                <Text style={styles.cardName}>{hotel.name}</Text>

                {/* Why you */}
                <View style={styles.whyBox}>
                  <Text style={styles.whyLabel}>Почему именно ты:</Text>
                  <Text style={styles.whyText}>{hotel.why_you}</Text>
                </View>

                {/* Highlight */}
                <View style={styles.highlightRow}>
                  <Ionicons name="star" size={13} color={colors.gold} />
                  <Text style={styles.highlightText}> {hotel.highlight}</Text>
                </View>

                {/* Vibe tags */}
                <View style={styles.vibeTags}>
                  {hotel.vibe_tags?.map((tag, i) => (
                    <View key={i} style={styles.vibeTag}>
                      <Text style={styles.vibeTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                {/* Footer */}
                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.priceLabel}>от</Text>
                    <Text style={styles.price}>
                      ${hotel.price_per_night}
                      <Text style={styles.priceUnit}> / ночь</Text>
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => handleBook(hotel)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.bookBtnText}>Забронировать</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* Try again */}
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => navigation.navigate('MoodInput')}
          >
            <Ionicons name="refresh" size={16} color={colors.gold} />
            <Text style={styles.retryText}>  Изменить настроение</Text>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 12,
  },
  back: { padding: 4 },
  shareBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
  },

  content: { paddingHorizontal: spacing.md },
  title: { fontSize: 24, fontWeight: '700', color: colors.ink, marginBottom: 10 },
  moodSummaryBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.goldPale, borderRadius: radius.md,
    padding: 12, marginBottom: spacing.lg,
  },
  moodSummary: { fontSize: 12, color: '#7A5C1E', lineHeight: 18, flex: 1 },

  // Match card
  card: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    marginBottom: spacing.md, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border, ...shadow.sm,
  },
  cardBanner: { height: 110, justifyContent: 'space-between', padding: 12, flexDirection: 'row', alignItems: 'flex-start' },
  rankBadge: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center', alignItems: 'center',
  },
  rankText: { fontSize: 12, fontWeight: '700', color: colors.ink },
  matchBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: radius.full, alignSelf: 'flex-end',
  },
  matchText: { fontSize: 11, fontWeight: '500', color: '#FFFFFF' },

  cardBody: { padding: 16 },
  cardLoc: { fontSize: 10, color: colors.muted, letterSpacing: 0.8, marginBottom: 2 },
  cardName: { fontSize: 20, fontWeight: '700', color: colors.ink, marginBottom: 10 },

  whyBox: {
    backgroundColor: colors.bg, borderRadius: radius.md,
    padding: 12, marginBottom: 10,
  },
  whyLabel: { fontSize: 11, fontWeight: '600', color: colors.ink, marginBottom: 4 },
  whyText: { fontSize: 12, color: colors.muted, lineHeight: 18 },

  highlightRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  highlightText: { fontSize: 12, fontWeight: '500', color: colors.gold },

  vibeTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  vibeTag: {
    backgroundColor: colors.bg, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: radius.full,
  },
  vibeTagText: { fontSize: 11, color: colors.muted },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: 10, color: colors.muted },
  price: { fontSize: 20, fontWeight: '700', color: colors.ink },
  priceUnit: { fontSize: 11, fontWeight: '400', color: colors.muted },
  bookBtn: {
    backgroundColor: colors.ink, borderRadius: radius.md,
    paddingHorizontal: 20, paddingVertical: 10,
  },
  bookBtnText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },

  // Retry
  retryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: spacing.md, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
    marginTop: 4,
  },
  retryText: { fontSize: 14, color: colors.gold, fontWeight: '500' },
});
