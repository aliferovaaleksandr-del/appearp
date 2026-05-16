// src/services/yandex.js
// ─────────────────────────────────────────────────────────────
//  appearp · AI Mood Match Engine (YandexGPT API)
//  Получи ключи на: https://console.yandex.cloud/
//  1. Создай сервисный аккаунт → выдай роль ai.languageModels.user
//  2. Создай API-ключ для аккаунта
//  3. Найди FOLDER_ID в настройках облака
// ─────────────────────────────────────────────────────────────

const YANDEX_API_KEY  = 'YOUR_YANDEX_API_KEY';   // ← вставь API-ключ
const YANDEX_FOLDER_ID = 'YOUR_FOLDER_ID';         // ← вставь folder id
const API_URL = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion';

const MODEL_URI = `gpt://${YANDEX_FOLDER_ID}/yandexgpt/latest`;

async function yandexRequest(systemText, userText, maxTokens = 1500) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Api-Key ${YANDEX_API_KEY}`,
      'x-folder-id': YANDEX_FOLDER_ID,
    },
    body: JSON.stringify({
      modelUri: MODEL_URI,
      completionOptions: {
        stream: false,
        temperature: 0.7,
        maxTokens,
      },
      messages: [
        { role: 'system', text: systemText },
        { role: 'user',   text: userText   },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`YandexGPT error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.result.alternatives[0].message.text;
}

// ── Mood Match ────────────────────────────────────────────────
const MOOD_MATCH_SYSTEM = `Ты — AI-сомелье отелей для приложения appearp.
Задача: по описанию настроения пользователя подобрать 3 идеальных отеля по всему миру.

ПРАВИЛА:
1. Анализируй эмоциональный контекст, не только слова
2. Выбирай реально существующие отели
3. Для каждого объясняй ПОЧЕМУ именно он подходит этому человеку — лично и конкретно
4. Учитывай настроение, желаемую атмосферу и выбранные теги
5. Общайся как хороший друг, знающий все отели мира

ФОРМАТ ОТВЕТА — строго валидный JSON без markdown-обёрток:
{
  "mood_summary": "краткое описание настроения (1 предложение)",
  "hotels": [
    {
      "rank": 1,
      "match_percent": 97,
      "name": "Название отеля",
      "location": "Страна · Регион",
      "price_per_night": 420,
      "currency": "USD",
      "stars": 5,
      "color_hex": "#2E4A3A",
      "why_you": "Персональное объяснение (2-3 предложения, на 'ты')",
      "vibe_tags": ["тишина", "природа", "уют"],
      "highlight": "Главная деталь которая зацепит"
    }
  ]
}`;

export async function getMoodMatch({ moods, vibe, freeText }) {
  const userText = `
Настроение (теги): ${moods.join(', ') || 'не указаны'}
Атмосфера: ${vibe || 'не указана'}
Своими словами: ${freeText || 'не заполнено'}

Подбери мне 3 идеальных отеля.
`.trim();

  try {
    const text = await yandexRequest(MOOD_MATCH_SYSTEM, userText, 1500);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSON не найден в ответе');
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('getMoodMatch error:', err);
    return MOCK_RESULT;   // fallback если ключи не настроены
  }
}

// ── Concierge Chat ────────────────────────────────────────────
export async function getConciergeReply({ hotelName, userMessage, history }) {
  const systemText = `Ты — персональный консьерж отеля ${hotelName} в приложении appearp.
Ты знаешь всё об этом отеле, регионе, ресторанах, активностях и трансферах.
Общайся тепло, на "ты", как личный помощник. Отвечай кратко и по делу (2-4 предложения).
Предлагай конкретные варианты с ценами если уместно.`;

  // YandexGPT принимает только одно user-сообщение, поэтому
  // сворачиваем историю в текст
  const historyText = history.length > 1
    ? history.slice(0, -1).map(m => `${m.role === 'user' ? 'Гость' : 'Консьерж'}: ${m.content}`).join('\n') + '\n\n'
    : '';

  const userText = historyText + userMessage;

  try {
    return await yandexRequest(systemText, userText, 400);
  } catch (err) {
    console.error('getConciergeReply error:', err);
    return 'Секунду, уточняю информацию... Попробуй ещё раз чуть позже.';
  }
}

// ── Mock fallback (работает без ключей) ─────────────────────
const MOCK_RESULT = {
  mood_summary: "Ты хочешь тишины, природы и уюта вдали от городской суеты",
  hotels: [
    {
      rank: 1, match_percent: 97,
      name: "Nayara Springs",
      location: "Коста-Рика · Вулкан Ареналь",
      price_per_night: 420, currency: "USD", stars: 5,
      color_hex: "#2E4A3A",
      why_you: "Вилла в джунглях с личным бассейном — ни одного соседа в поле зрения. Утром кофе под пение птиц с видом на вулкан. Именно то, о чём ты говоришь.",
      vibe_tags: ["джунгли", "тишина", "приватность"],
      highlight: "Личный бассейн прямо в джунглях"
    },
    {
      rank: 2, match_percent: 91,
      name: "Sublime Comporta",
      location: "Португалия · Алентежу",
      price_per_night: 310, currency: "USD", stars: 5,
      color_hex: "#3D5270",
      why_you: "Бунгало в сосновом лесу, до пляжа 5 минут пешком. Завтрак на деревянной террасе с пением птиц — тихое место для тех, кто устал от города.",
      vibe_tags: ["сосновый лес", "пляж рядом", "медленная жизнь"],
      highlight: "Завтрак в лесу, пляж за соснами"
    },
    {
      rank: 3, match_percent: 87,
      name: "Gora Kadan",
      location: "Япония · Хаконе",
      price_per_night: 380, currency: "USD", stars: 5,
      color_hex: "#5A3D4A",
      why_you: "Традиционный рёкан с онсеном в горах. Всего 12 номеров, полная тишина и горячие источники — лучшая детоксикация от города.",
      vibe_tags: ["онсен", "горы", "японский стиль"],
      highlight: "Персональный горячий источник"
    }
  ]
};
