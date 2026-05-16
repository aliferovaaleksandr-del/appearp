# appearp 🏨
> AI-сомелье отелей — скажи как чувствуешь, получи идеальный отель

## Структура проекта
```
appearp/
├── App.js                          # Навигация
├── src/
│   ├── services/
│   │   └── claude.js               # YandexGPT API (Mood Match + Консьерж)
│   ├── screens/
│   │   ├── HomeScreen.js           # Главная
│   │   ├── MoodInputScreen.js      # Выбор настроения
│   │   ├── MoodLoadingScreen.js    # Анимация AI-анализа
│   │   ├── MoodResultsScreen.js    # Результаты подбора
│   │   └── HotelDetailScreen.js    # Страница отеля + чат
│   └── theme.js                    # Цвета, шрифты, отступы
├── package.json
├── app.json
└── eas.json                        # Конфиг сборки для магазинов
```

---

## ⚡ Быстрый старт (10 минут)

### 1. Установи Expo CLI
```bash
npm install -g expo-cli eas-cli
```

### 2. Клонируй и установи зависимости
```bash
cd appearp
npm install
```

### 3. Получи ключи YandexGPT

1. Зайди на https://console.yandex.cloud/
2. Создай новый проект (или используй существующий)
3. Перейди в **IAM → Сервисные аккаунты** → Создать аккаунт
4. Выдай роль: `ai.languageModels.user`
5. Создай **API-ключ** для этого аккаунта
6. Скопируй **Folder ID** из настроек облака (в URL или в разделе "Обзор")

### 4. Вставь ключи в `src/services/claude.js`
```js
const YANDEX_API_KEY   = 'AQVN...';   // твой API-ключ
const YANDEX_FOLDER_ID = 'b1g...';    // твой folder id
```

### 5. Запусти на телефоне
```bash
npx expo start
```
Сканируй QR-код приложением **Expo Go** (iOS / Android) — работает сразу!

---

## 📱 Публикация в Google Play и App Store

### Шаг 1 — Создай аккаунт EAS
```bash
eas login
eas build:configure
```

### Шаг 2 — Сборка APK для тестирования (бесплатно)
```bash
eas build --platform android --profile preview
```
Получишь ссылку на APK через ~10 минут. Можно сразу установить!

### Шаг 3 — Продакшн-сборка
```bash
# Android (AAB для Google Play)
eas build --platform android --profile production

# iOS (требует Apple Developer $99/год)
eas build --platform ios --profile production
```

### Шаг 4 — Загрузка в магазины
```bash
# Google Play (нужен google-service-account.json)
eas submit --platform android

# App Store
eas submit --platform ios
```

---

## 🤖 Как работает Mood Match

```
Пользователь → выбирает теги + пишет текст
       ↓
MoodLoadingScreen → вызывает YandexGPT API
       ↓
YandexGPT анализирует эмоциональный контекст
       ↓
Возвращает JSON с 3 отелями + % совпадения + персональное объяснение
       ↓
MoodResultsScreen показывает результаты
```

### Модель
- **`yandexgpt/latest`** — основная модель, баланс качества и скорости
- Для лучшего качества используй `yandexgpt-pro/latest` (в 2-3 раза дороже)

### Цены YandexGPT (примерно)
| Операция | Стоимость |
|---|---|
| Mood Match (1 запрос) | ~0.5–1 ₽ |
| Сообщение консьержа | ~0.2–0.3 ₽ |
| 1000 пользователей/день | ~500–1000 ₽ |

---

## 🔧 Добавить реальные отели (опционально)

Подключи бесплатные API для реальных данных:

**Booking.com Affiliate API** (бесплатно):
- https://developers.booking.com/

**RapidAPI Hotels**:
- https://rapidapi.com/apidojo/api/hotels4

После регистрации добавь в `src/services/hotels.js` поиск по названию из результатов Yandex.

---

## 💡 Уникальные фишки appearp

1. **Mood Match** — единственный сервис с AI-подбором по настроению
2. **Персональный консьерж** — живой чат с YandexGPT в контексте конкретного отеля
3. **Объяснение "Почему именно ты"** — не просто список, а личная рекомендация
4. **% совпадения** — геймификация выбора отеля

---

## 📞 Поддержка

Telegram: @appearp_support
Email: hello@appearp.app
