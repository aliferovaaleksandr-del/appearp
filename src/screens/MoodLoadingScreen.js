// src/screens/MoodLoadingScreen.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';
import { getMoodMatch } from '../services/claude';

const STEPS = [
  { icon: 'checkmark-circle', text: 'Настроение распознано' },
  { icon: 'search', text: 'Анализирую атмосферу отелей...' },
  { icon: 'star', text: 'Читаю отзывы гостей...' },
  { icon: 'trophy', text: 'Составляю топ-3 для тебя...' },
];

export default function MoodLoadingScreen({ navigation, route }) {
  const { moods, vibe, freeText } = route.params;
  const [doneSteps, setDoneSteps] = useState([0]);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();

    // Step reveal timing
    const timers = [];
    timers.push(setTimeout(() => setDoneSteps([0, 1]), 800));
    timers.push(setTimeout(() => setDoneSteps([0, 1, 2]), 1800));
    timers.push(setTimeout(() => setDoneSteps([0, 1, 2, 3]), 2800));

    // Call Claude API
    callAPI();

    return () => timers.forEach(clearTimeout);
  }, []);

  const callAPI = async () => {
    try {
      const result = await getMoodMatch({ moods, vibe, freeText });
      // Wait min 3.5s for UX animation
      setTimeout(() => {
        navigation.replace('MoodResults', { result });
      }, 3500);
    } catch (err) {
      console.error(err);
      // Fallback with mock data if API fails
      setTimeout(() => {
        navigation.replace('MoodResults', { result: MOCK_RESULT });
      }, 3500);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Animated.View style={[styles.ring, { transform: [{ scale: pulseAnim }] }]}>
          <Ionicons name="brain" size={36} color={colors.gold} />
        </Animated.View>

        <Text style={styles.title}>Анализирую твоё настроение</Text>
        <Text style={styles.sub}>AI изучает 50,000 отелей,{'\n'}чтобы найти именно твой</Text>

        <View style={styles.steps}>
          {STEPS.map((step, i) => (
            <View key={i} style={[styles.step, doneSteps.includes(i) && styles.stepDone]}>
              <Ionicons
                name={doneSteps.includes(i) ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={doneSteps.includes(i) ? colors.gold : colors.muted}
              />
              <Text style={[styles.stepText, doneSteps.includes(i) && styles.stepTextDone]}>
                {step.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

// Fallback mock если API не настроен
const MOCK_RESULT = {
  mood_summary: "Ты хочешь тишины, природы и уюта вдали от городской суеты",
  hotels: [
    {
      rank: 1,
      match_percent: 97,
      name: "Nayara Springs",
      location: "Коста-Рика · Вулкан Ареналь",
      price_per_night: 420,
      currency: "USD",
      stars: 5,
      color_hex: "#2E4A3A",
      why_you: "Вилла в джунглях с личным бассейном — ни одного соседа в поле зрения. Утром кофе под пение птиц на деревянной террасе с видом на вулкан. Именно то, о чём ты говоришь.",
      vibe_tags: ["джунгли", "тишина", "приватность"],
      highlight: "Личный бассейн прямо в джунглях"
    },
    {
      rank: 2,
      match_percent: 91,
      name: "Sublime Comporta",
      location: "Португалия · Алентежу",
      price_per_night: 310,
      currency: "USD",
      stars: 5,
      color_hex: "#3D5270",
      why_you: "Бунгало в сосновом лесу, до пляжа 5 минут пешком. Завтрак на деревянной террасе с пением птиц — другие гости буквально невидимы. Тихое место для тех, кто устал.",
      vibe_tags: ["сосновый лес", "пляж рядом", "медленная жизнь"],
      highlight: "Завтрак в лесу, пляж за соснами"
    },
    {
      rank: 3,
      match_percent: 87,
      name: "Gora Kadan",
      location: "Япония · Хаконе",
      price_per_night: 380,
      currency: "USD",
      stars: 5,
      color_hex: "#5A3D4A",
      why_you: "Традиционный рёкан с онсеном в горах Хаконе. Всего 12 номеров, телефон оставляют в номере. Полная тишина, горячие источники и рис на завтрак — лучшая детоксикация от города.",
      vibe_tags: ["онсен", "горы", "японский стиль"],
      highlight: "Персональный горячий источник"
    }
  ]
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },

  ring: {
    width: 88, height: 88, borderRadius: 44,
    borderWidth: 2, borderColor: colors.ink,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: spacing.lg,
  },

  title: { fontSize: 22, fontWeight: '700', color: colors.ink, textAlign: 'center', marginBottom: 8 },
  sub: { fontSize: 13, color: colors.muted, textAlign: 'center', lineHeight: 20, marginBottom: spacing.xl },

  steps: { width: '100%', gap: 10 },
  step: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 12, borderRadius: 10, backgroundColor: 'transparent',
  },
  stepDone: { backgroundColor: colors.surface },
  stepText: { fontSize: 13, color: colors.muted },
  stepTextDone: { color: colors.ink, fontWeight: '500' },
});
