// src/screens/MoodInputScreen.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, shadow } from '../theme';
import * as Haptics from 'expo-haptics';

const MOOD_TAGS = [
  'устал от города', 'хочу тишины', 'нужен уют', 'приключения',
  'романтика', 'работаю удалённо', 'не хочу людей', 'хорошая еда',
  'культура и история', 'активный отдых', 'дайвинг и море', 'горы',
];

const VIBES = [
  { label: 'Природа', icon: 'leaf-outline' },
  { label: 'Пляж', icon: 'water-outline' },
  { label: 'Горы', icon: 'triangle-outline' },
  { label: 'Город', icon: 'business-outline' },
];

export default function MoodInputScreen({ navigation }) {
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [selectedVibe, setSelectedVibe] = useState(null);
  const [freeText, setFreeText] = useState('');

  const toggleMood = (mood) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMoods(prev =>
      prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
    );
  };

  const handleFind = () => {
    if (selectedMoods.length === 0 && !freeText.trim()) {
      Alert.alert('Расскажи о себе', 'Выбери хотя бы одно настроение или напиши несколько слов');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('MoodLoading', {
      moods: selectedMoods,
      vibe: selectedVibe,
      freeText: freeText.trim(),
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Back */}
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.muted} />
          <Text style={styles.backText}>Назад</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Как ты себя{'\n'}чувствуешь?</Text>
          <Text style={styles.subtitle}>
            AI подберёт отель под твоё настроение.{'\n'}
            Нет нужных слов — выбери теги или опиши своими.
          </Text>

          {/* Mood tags */}
          <Text style={styles.sectionLabel}>НАСТРОЕНИЕ</Text>
          <View style={styles.tagsWrap}>
            {MOOD_TAGS.map((mood) => (
              <TouchableOpacity
                key={mood}
                onPress={() => toggleMood(mood)}
                style={[styles.tag, selectedMoods.includes(mood) && styles.tagSelected]}
                activeOpacity={0.75}
              >
                <Text style={[styles.tagText, selectedMoods.includes(mood) && styles.tagTextSelected]}>
                  {mood}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Vibe grid */}
          <Text style={styles.sectionLabel}>АТМОСФЕРА</Text>
          <View style={styles.vibeGrid}>
            {VIBES.map((v) => (
              <TouchableOpacity
                key={v.label}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedVibe(v.label === selectedVibe ? null : v.label);
                }}
                style={[styles.vibeItem, selectedVibe === v.label && styles.vibeItemSelected]}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={v.icon} size={22}
                  color={selectedVibe === v.label ? colors.gold : colors.muted}
                />
                <Text style={[styles.vibeLabel, selectedVibe === v.label && styles.vibeLabelSelected]}>
                  {v.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Free text */}
          <Text style={styles.sectionLabel}>ОПИШИ СВОИМИ СЛОВАМИ</Text>
          <TextInput
            style={styles.textarea}
            multiline
            numberOfLines={4}
            placeholder="Хочу куда-то тихое, без лишних людей, где можно пить кофе утром на террасе и слышать только птиц..."
            placeholderTextColor={colors.muted}
            value={freeText}
            onChangeText={setFreeText}
            textAlignVertical="top"
          />
          <Text style={styles.hint}>AI понимает любой язык и любой стиль</Text>

          {/* CTA */}
          <TouchableOpacity style={styles.findBtn} onPress={handleFind} activeOpacity={0.85}>
            <Ionicons name="sparkles" size={18} color={colors.ink} />
            <Text style={styles.findBtnText}>  Найти мой отель</Text>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  back: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: 6 },
  backText: { fontSize: 13, color: colors.muted },

  content: { paddingHorizontal: spacing.md },
  title: { fontSize: 28, fontWeight: '700', color: colors.ink, lineHeight: 34, marginBottom: 8 },
  subtitle: { fontSize: 13, color: colors.muted, lineHeight: 20, marginBottom: spacing.lg },

  sectionLabel: {
    fontSize: 10, fontWeight: '600', letterSpacing: 1.2,
    color: colors.muted, textTransform: 'uppercase', marginBottom: 10, marginTop: 4,
  },

  // Tags
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: spacing.lg },
  tag: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
  },
  tagSelected: { backgroundColor: colors.ink, borderColor: colors.ink },
  tagText: { fontSize: 12, fontWeight: '500', color: colors.muted },
  tagTextSelected: { color: '#FFFFFF' },

  // Vibes
  vibeGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.lg,
  },
  vibeItem: {
    flex: 1, minWidth: '45%', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
    gap: 6,
  },
  vibeItemSelected: { borderColor: colors.gold, backgroundColor: colors.goldPale },
  vibeLabel: { fontSize: 12, fontWeight: '500', color: colors.muted },
  vibeLabelSelected: { color: colors.gold },

  // Textarea
  textarea: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    padding: 14, fontSize: 13, color: colors.ink, lineHeight: 20,
    minHeight: 100, marginBottom: 6,
  },
  hint: { fontSize: 10, color: colors.muted, textAlign: 'right', marginBottom: spacing.lg },

  // CTA
  findBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.ink, borderRadius: radius.md, paddingVertical: 15,
    ...shadow.md,
  },
  findBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
