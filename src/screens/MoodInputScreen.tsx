// src/screens/MoodInputScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { getMoodMatch } from '../services/claude';

const MOOD_CHIPS = ['устал от города', 'хочу тишины', 'нужен уют', 'приключения', 'романтика', 'работаю удалённо', 'с детьми', 'бюджетно'];
const ATMOSPHERE_CHIPS = ['природа', 'горы', 'море', 'город', 'лес', 'озеро', 'пустыня', 'острова'];

export default function MoodInputScreen({ navigation, route }: any) {
  const prefillMood: string = route?.params?.prefillMood || '';
  const [moodText, setMoodText] = useState(prefillMood);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (prefillMood) {
      handleFind(prefillMood, []);
    }
  }, []);

  const toggleChip = (chip: string) => {
    Haptics.selectionAsync();
    setSelectedChips(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  };

  const handleFind = async (text?: string, chips?: string[]) => {
    const finalText = text ?? moodText;
    const finalChips = chips ?? selectedChips;
    if (!finalText.trim() && finalChips.length === 0) {
      setError('Опиши своё настроение или выбери теги выше');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await getMoodMatch(finalText, finalChips);
      navigation.navigate('Results', {
        result,
        mood: finalText || finalChips.join(', '),
      });
    } catch (err: any) {
      setError(err.message || 'Что-то пошло не так. Проверь API ключ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mood Match</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.prompt}>Как ты себя чувствуешь{'\n'}прямо сейчас?</Text>

          {/* Mood chips */}
          <View style={styles.chipGroup}>
            <Text style={styles.chipLabel}>НАСТРОЕНИЕ</Text>
            <View style={styles.chips}>
              {MOOD_CHIPS.map(chip => (
                <TouchableOpacity
                  key={chip}
                  style={[styles.chip, selectedChips.includes(chip) && styles.chipSelected]}
                  onPress={() => toggleChip(chip)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.chipText, selectedChips.includes(chip) && styles.chipTextSelected]}>
                    {chip}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Atmosphere chips */}
          <View style={styles.chipGroup}>
            <Text style={styles.chipLabel}>АТМОСФЕРА</Text>
            <View style={styles.chips}>
              {ATMOSPHERE_CHIPS.map(chip => (
                <TouchableOpacity
                  key={chip}
                  style={[styles.chip, selectedChips.includes(chip) && styles.chipSelected]}
                  onPress={() => toggleChip(chip)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.chipText, selectedChips.includes(chip) && styles.chipTextSelected]}>
                    {chip}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Free text */}
          <View style={styles.chipGroup}>
            <Text style={styles.chipLabel}>ОПИШИ СВОИМИ СЛОВАМИ (НЕОБЯЗАТЕЛЬНО)</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              placeholder="Хочу куда-то тихое, где можно пить кофе утром на террасе и слышать только птиц..."
              placeholderTextColor={Colors.textTertiary}
              value={moodText}
              onChangeText={setMoodText}
              textAlignVertical="top"
            />
            <Text style={styles.hint}>✦ AI понимает любой язык и стиль</Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={[styles.findBtn, loading && styles.findBtnDisabled]}
            onPress={() => handleFind()}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <>
                <Ionicons name="sparkles" size={18} color={Colors.white} />
                <Text style={styles.findBtnText}>Найти мой отель</Text>
              </>
            )}
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
  headerTitle: { fontSize: 15, fontWeight: '600', color: Colors.text },
  content: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  prompt: { ...Typography.h2, color: Colors.text, marginBottom: Spacing.xxl },
  chipGroup: { marginBottom: Spacing.xl },
  chipLabel: { ...Typography.caption, color: Colors.textTertiary, marginBottom: Spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    paddingVertical: 7, paddingHorizontal: 14,
    borderRadius: Radius.pill, borderWidth: 0.5,
    borderColor: Colors.border, backgroundColor: Colors.background,
  },
  chipSelected: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary },
  chipTextSelected: { color: Colors.primaryDark, fontWeight: '500' },
  textInput: {
    borderWidth: 0.5, borderColor: Colors.border,
    borderRadius: Radius.lg, padding: Spacing.md,
    fontSize: 15, color: Colors.text, minHeight: 100,
    backgroundColor: Colors.background,
  },
  hint: { fontSize: 12, color: Colors.textTertiary, marginTop: Spacing.sm },
  error: {
    fontSize: 13, color: Colors.error,
    backgroundColor: Colors.errorLight,
    padding: Spacing.md, borderRadius: Radius.sm, marginTop: Spacing.sm,
  },
  bottom: { padding: Spacing.xl, paddingTop: Spacing.sm },
  findBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.lg,
    padding: Spacing.lg, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
  },
  findBtnDisabled: { backgroundColor: Colors.primaryMid },
  findBtnText: { fontSize: 16, fontWeight: '600', color: Colors.white },
});
