// src/services/claude.ts — YandexGPT
//
// Как получить ключи (5 минут):
// 1. Открой https://console.yandex.cloud → создай проект
// 2. Маркетплейс → включи "Yandex Foundation Models"
// 3. IAM → Сервисные аккаунты → новый аккаунт с ролью ai.languageModels.user
// 4. Создай API-ключ → скопируй значение ниже
// 5. FOLDER_ID: главная консоли → скопируй ID проекта

const YANDEX_API_KEY = 'YOUR_YANDEX_API_KEY';   // AQVN...
const YANDEX_FOLDER_ID = 'YOUR_FOLDER_ID';       // b1g...
const MODEL_URI = `gpt://${YANDEX_FOLDER_ID}/yandexgpt/latest`;
const API_URL = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion';

export interface Hotel {
  name: string;
  location: string;
  country: string;
  type: string;
  price_per_night: number;
  currency: string;
  match_score: number;
  why: string;
  highlights: string[];
  atmosphere: string;
  booking_url?: string;
}

export interface MoodMatchResult {
  summary: string;
  hotels: Hotel[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─── Базовый запрос к YandexGPT ──────────────────────────────────────────────
async function yandexRequest(
  systemText: string,
  history: Array<{ role: string; text: string }>,
  userText: string
): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Api-Key ${YANDEX_API_KEY}`,
      'x-folder-id': YANDEX_FOLDER_ID,
    },
    body: JSON.stringify({
      modelUri: MODEL_URI,
      completionOptions: { stream: false, temperature: 0.6, maxTokens: 1500 },
      messages: [
        { role: 'system', text: systemText },
        ...history,
        { role: 'user', text: userText },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `HTTP ${res.status} — проверь API ключ и Folder ID`
    );
  }

  const data = await res.json();
  return data?.result?.alternatives?.[0]?.message?.text || '';
}

// ─── Mood Match ───────────────────────────────────────────────────────────────
export async function getMoodMatch(
  moodText: string,
  chips: string[]
): Promise<MoodMatchResult> {
  let prompt = '';
  if (chips.length > 0) prompt += `Теги настроения: ${chips.join(', ')}. `;
  if (moodText) prompt += `Описание: ${moodText}`;
  if (!prompt) prompt = 'Хочу хороший отдых, что-то интересное';

  const raw = await yandexRequest(MOOD_MATCH_SYSTEM, [], prompt);

  // Вырезаем JSON даже если YandexGPT добавил лишний текст
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('AI вернул некорректный ответ. Попробуй ещё раз.');

  try {
    return JSON.parse(raw.slice(start, end + 1)) as MoodMatchResult;
  } catch {
    throw new Error('Не удалось разобрать ответ. Попробуй ещё раз.');
  }
}

// ─── Консьерж-чат ────────────────────────────────────────────────────────────
export async function getConciergeReply(
  messages: ChatMessage[],
  hotel: Hotel,
  originalMood: string
): Promise<string> {
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role,
    text: m.content,
  }));
  const lastMsg = messages[messages.length - 1].content;

  return yandexRequest(buildConciergeSystem(hotel, originalMood), history, lastMsg);
}

// ─── Промпты ─────────────────────────────────────────────────────────────────
const MOOD_MATCH_SYSTEM = `Ты — AI-сомелье отелей приложения appearp.
Пользователь описывает настроение, ты подбираешь 3 идеальных отеля.

СТРОГО: Отвечай ТОЛЬКО валидным JSON. Никакого текста до или после JSON.

{
  "summary": "1-2 предложения — что понял из настроения",
  "hotels": [
    {
      "name": "Название отеля",
      "location": "Город, регион",
      "country": "Страна",
      "type": "бутик-отель / шале / вилла / курорт / гостевой дом / etc",
      "price_per_night": 120,
      "currency": "USD",
      "match_score": 96,
      "why": "Почему именно этот отель идеально подходит (2-3 предложения, эмоционально)",
      "highlights": ["особенность 1", "особенность 2", "особенность 3"],
      "atmosphere": "тихий / активный / романтичный / рабочий",
      "booking_url": "https://booking.com/searchresults.html?ss=НАЗВАНИЕ+ГОРОД"
    }
  ]
}

Правила: 3 отеля из разных стран, реалистичные названия и цены, match_score 85-99.`;

function buildConciergeSystem(hotel: Hotel, mood: string): string {
  return `Ты — персональный AI-консьерж приложения appearp.
Сейчас помогаешь с отелем "${hotel.name}" в ${hotel.location}, ${hotel.country}.

Детали отеля:
- Тип: ${hotel.type}
- Цена: $${hotel.price_per_night}/ночь  
- Атмосфера: ${hotel.atmosphere}
- Особенности: ${hotel.highlights.join(', ')}

Запрос пользователя: "${mood}"

Отвечай коротко (2-4 предложения), дружелюбно, на русском языке.
Если спрашивают о бронировании — кнопка "Забронировать" откроет Booking.com.`;
}
