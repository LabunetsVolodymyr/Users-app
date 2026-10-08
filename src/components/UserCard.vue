<!-- Секція логіки компонента. Використовуємо Composition API (<script setup>) та TypeScript (lang="ts") -->
<script setup lang="ts">
// Імпортуємо ref для створення локального реактивного стану компонента
import { ref } from 'vue'
// Імпортуємо інтерфейс User для суворої типізації вхідного об'єкта користувача
import type { User } from '../types/user'

// Оголошуємо вхідні параметри (props), які передаються від батьківського компонента Users.vue
// Макрос defineProps з generic-типізацією <{ user: User }>() гарантує, що об'єкт має всі потрібні поля
const props = defineProps<{
  user: User
}>()

// Локальна реактивна булева змінна для керування станом акордеона "About me" (відкритий за замовчуванням)
// Використовується разом із директивою v-show у шаблоні
const isAboutOpen = ref(true)

// Функція-перемикач: змінює значення isAboutOpen на протилежне (true <-> false) при кліку на заголовок
const toggleAbout = () => {
  isAboutOpen.value = !isAboutOpen.value
}

// Допоміжна функція для форматування ISO-рядка дати народження (наприклад, "2001-03-08T...")
// у зручний формат ДД.ММ.РРРР (наприклад, "08.03.2001")
const formatDate = (isoString: string) => {
  try {
    const d = new Date(isoString)
    // padStart(2, '0') додає провідний нуль, якщо число менше 10 (наприклад, 3 -> "03")
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0') // Місяці в JS починаються з 0, тому +1
    const year = d.getFullYear()
    return `${day}.${month}.${year}`
  } catch {
    // Якщо рядок дати некоректний, повертаємо його як є, щоб уникнути падіння програми
    return isoString
  }
}

// Завдання 4: Функція для умовного фарбування картки в залежності від віку користувача.
// Повертає об'єкт для директиви :class (об'єктний синтаксис прив'язки класів).
// Ключі об'єкта — це назви CSS-класів, а значення — булеві умови (true/false).
// До DOM-елемента додасться лише той клас, умова якого поверне true.
const getAgeClass = (age: number) => {
  return {
    'age-minor': age < 18,               // До 18 років — категорія minor
    'age-young': age >= 18 && age <= 30, // Від 18 до 30 років — категорія young
    'age-adult': age >= 31 && age <= 50, // Від 31 до 50 років — категорія adult
    'age-senior': age > 50,              // Понад 50 років — категорія senior
  }
}
</script>

<!-- Секція HTML-шаблону картки користувача -->
<template>
  <!-- Завдання 4: Прив'язка класу через об'єктний синтаксис :class="getAgeClass(user.dob.age)" -->
  <!-- Статичний клас "card" об'єднується з динамічним класом вікової категорії (наприклад, "card age-young") -->
  <div class="card" :class="getAgeClass(user.dob.age)">
    <!-- Верхня кольорова смужка, градієнт якої змінюється через CSS залежно від вікового класу на .card -->
    <div class="card__accent-bar"></div>

    <div class="card__container">
      <!-- Ліва колонка картки: фото, ім'я, швидкі бейджі та короткі контакти -->
      <aside class="card__sidebar">
        <!-- Завдання 5: Виведення фотографії за допомогою директиви v-bind (скорочений запис :src та :alt) -->
        <!-- Атрибут :alt формується динамічно через шаблонний рядок на основі імені та прізвища -->
        <img
          :src="user.picture"
          :alt="`${user.name.first} ${user.name.last}`"
          class="card__avatar"
        />

        <!-- Виведення повного імені користувача через текстову інтерполяцію {{ }} -->
        <h2 class="card__name">
          {{ user.name.title }} {{ user.name.first }} {{ user.name.last }}
        </h2>

        <!-- Швидкі бейджі під ім'ям (стать та вік) -->
        <div class="card__quick-badges">
          <span class="badge">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="5" />
              <path d="M12 13v8M9 18h6" />
            </svg>
            <!-- Тернарний оператор у шаблоні для відображення статі з великої літери -->
            {{ user.gender === 'female' ? 'Female' : 'Male' }}
          </span>

          <!-- Завдання 4: Використання директиви v-if, щоб показувати вік ТІЛЬКИ якщо він більше 18 років -->
          <!-- Якщо user.dob.age <= 18, цей тег <span> повністю видаляється з DOM-дерева -->
          <span v-if="user.dob.age > 18" class="badge">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {{ user.dob.age }} years
          </span>
        </div>

        <!-- Короткий блок контактів із SVG-іконками під бейджами -->
        <div class="card__contacts-short">
          <div class="contact-item">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{{ user.location.city }}, {{ user.location.state }}, {{ user.location.country }}</span>
          </div>

          <div class="contact-item">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>{{ user.email }}</span>
          </div>

          <div class="contact-item">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{{ user.phone }}</span>
          </div>

          <div class="contact-item">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
            <span>{{ user.cell }}</span>
          </div>
        </div>
      </aside>

      <!-- Права основна частина картки з детальною інформацією -->
      <main class="card__content">

        <!-- Секція акордеона "About me" (поле details) -->
        <section class="accordion">
          <!-- Обробник події @click викликає функцію toggleAbout, яка змінює isAboutOpen -->
          <button class="accordion__trigger" @click="toggleAbout">
            <div class="accordion__title">
              <svg class="icon icon--primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>About me</span>
            </div>
            <!-- Прив'язка класу :class повертає стрілочку на 180 градусів, коли isAboutOpen === true -->
            <svg
              class="accordion__arrow"
              :class="{ 'accordion__arrow--open': isAboutOpen }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <!-- Завдання 4: Використання директиви v-show для показу/приховування додаткової інформації details -->
          <!-- На відміну від v-if, v-show залишає елемент у DOM, лише перемикаючи CSS-властивість display: none -->
          <div v-show="isAboutOpen" class="accordion__body">
            <p>{{ user.details }}</p>
          </div>
        </section>

        <!-- Секція "Personal Information" (таблиця на CSS Grid) -->
        <section class="section">
          <div class="section__header">
            <svg class="icon icon--primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <h3>Personal Information</h3>
          </div>

          <div class="grid-table">
            <span class="label">Full name</span>
            <span class="value">{{ user.name.title }} {{ user.name.first }} {{ user.name.last }}</span>

            <span class="label">Gender</span>
            <span class="value">{{ user.gender === 'female' ? 'Female' : 'Male' }}</span>

            <span class="label">Date of birth</span>
            <!-- Виклик нашої функції formatDate безпосередньо в інтерполяції шаблону -->
            <span class="value">{{ formatDate(user.dob.date) }} (age {{ user.dob.age }})</span>

            <span class="label">Email</span>
            <span class="value">{{ user.email }}</span>

            <span class="label">Phone</span>
            <span class="value">{{ user.phone }}</span>

            <span class="label">Cell</span>
            <span class="value">{{ user.cell }}</span>
          </div>
        </section>

        <!-- Секція "Location" (адреса, місто, країна, індекс, часовий пояс) -->
        <section class="section">
          <div class="section__header">
            <svg class="icon icon--primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <h3>Location</h3>
          </div>

          <div class="grid-table">
            <span class="label">Street</span>
            <span class="value">{{ user.location.street.number }} {{ user.location.street.name }}</span>

            <span class="label">City</span>
            <span class="value">{{ user.location.city }}</span>

            <span class="label">State</span>
            <span class="value">{{ user.location.state }}</span>

            <span class="label">Country</span>
            <span class="value">{{ user.location.country }}</span>

            <span class="label">Postcode</span>
            <span class="value">{{ user.location.postcode }}</span>

            <span class="label">Timezone</span>
            <span class="value">{{ user.location.timezone.offset }} ({{ user.location.timezone.description }})</span>
          </div>
        </section>

        <!-- Завдання 4: Секція "Hobbies" — виведення масиву хобі за допомогою директиви v-for -->
        <section class="section">
          <div class="section__header">
            <svg class="icon icon--primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <h3>Hobbies</h3>
          </div>

          <div class="tags-list">
            <!-- Директива v-for перебирає масив user.hobbies, отримуючи сам елемент (hobby) та його індекс (idx) -->
            <!-- :key="idx" забезпечує унікальний ключ для кожного тегу хобі -->
            <!-- :class="`hobby-pill--${idx % 6}`" динамічно призначає один із 6 кольорових стилів по колу (залишок від ділення на 6) -->
            <span
              v-for="(hobby, idx) in user.hobbies"
              :key="idx"
              class="hobby-pill"
              :class="`hobby-pill--${idx % 6}`"
            >
              {{ hobby }}
            </span>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<!-- Ізольовані стилі компонента картки (scoped означає, що стилі діють лише всередині UserCard.vue) -->
<style scoped>
/* Базовий контейнер картки користувача */
.card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #eef2f6;
  position: relative;
  overflow: hidden; /* Обрізає верхню кольорову смужку по заокруглених кутах картки */
  margin-bottom: 32px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Ефект легкої тіні при наведенні курсору на картку */
.card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

/* Верхня декоративна смужка-індикатор вікової категорії */
.card__accent-bar {
  height: 5px;
  width: 100%;
}

/* Завдання 4: Кольори смужки залежно від вікового класу, який повернула функція getAgeClass() */
/* До 18 років (minor) — червоно-помаранчевий градієнт */
.card.age-minor .card__accent-bar {
  background: linear-gradient(90deg, #f87171, #fb923c);
}
/* 18–30 років (young) — зелений смарагдовий градієнт */
.card.age-young .card__accent-bar {
  background: linear-gradient(90deg, #34d399, #10b981);
}
/* 31–50 років (adult) — синій градієнт */
.card.age-adult .card__accent-bar {
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
}
/* Понад 50 років (senior) — золотисто-бурштиновий градієнт */
.card.age-senior .card__accent-bar {
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
}

/* Сітка картки: ліва колонка фіксована (320px), права займає весь вільний простір (1fr) */
.card__container {
  display: grid;
  grid-template-columns: 320px 1fr;
  padding: 32px;
  gap: 40px;
}

/* Адаптивність для планшетів та мобільних (екрани до 860px): перебудовуємо у 1 колонку */
@media (max-width: 860px) {
  .card__container {
    grid-template-columns: 1fr;
    padding: 20px;
    gap: 24px;
  }
}

/* ЛІВА ЧАСТИНА КАРТКИ (Sidebar) */
.card__sidebar {
  display: flex;
  flex-direction: column;
}

/* Стилізація фотографії користувача (квадратна з м'яким заокругленням кутів) */
.card__avatar {
  width: 100%;
  max-width: 280px;
  height: 280px;
  border-radius: 18px;
  object-fit: cover; /* Гарантує, що фото не сплющиться при будь-яких пропорціях */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
}

/* Заголовок з ім'ям користувача */
.card__name {
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
}

/* Контейнер для швидких бейджів (стать та вік) */
.card__quick-badges {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #475569;
  font-weight: 500;
}

/* Короткий список контактів у лівій колонці, відділений зверху тонкою лінією */
.card__contacts-short {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid #f1f5f9;
  padding-top: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #475569;
}

/* Загальні розміри та колір для SVG-іконок */
.icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  stroke: #64748b;
}

.icon--primary {
  stroke: #1e293b;
}

/* ПРАВА ЧАСТИНА КАРТКИ (Основний контент) */
.card__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* СТИЛІ АКОРДЕОНА "ABOUT ME" (де працює v-show) */
.accordion {
  border-radius: 12px;
  background-color: #f8fafc;
  overflow: hidden;
  border: 1px solid #f1f5f9;
}

/* Кнопка-заголовок акордеона на всю ширину */
.accordion__trigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: none;
  border: none;
  cursor: pointer;
}

.accordion__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

/* Плавна анімація повороту стрілочки акордеона */
.accordion__arrow {
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
  stroke: #64748b;
}

/* Клас додається динамічно, коли isAboutOpen === true */
.accordion__arrow--open {
  transform: rotate(180deg);
}

/* Тіло акордеона з текстом details */
.accordion__body {
  padding: 0 18px 16px 18px;
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
}

/* ІНШІ СЕКЦІЇ ТА ДВОКОЛОНКОВІ ТАБЛИЦІ ДАНИХ */
.section {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 20px;
}

/* Прибираємо нижню лінію та відступ у останньої секції (Hobbies) */
.section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.section__header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.section__header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

/* Двоколонкова таблиця "Назва поля — Значення" за допомогою CSS Grid */
.grid-table {
  display: grid;
  grid-template-columns: 140px 1fr;
  row-gap: 10px;
  column-gap: 20px;
  font-size: 14px;
}

.label {
  color: #64748b;
}

.value {
  color: #1e293b;
  font-weight: 500;
  word-break: break-word;
}

/* СТИЛІ БЕЙДЖІВ ХОБІ (для списку v-for) */
.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hobby-pill {
  padding: 6px 16px;
  border-radius: 9999px; /* Максимальне заокруглення для форми "пігулки" */
  font-size: 13px;
  font-weight: 600;
}

/* 6 кольорових тем для тегів хобі, які чергуються через оператор залишку від ділення (idx % 6) */
.hobby-pill--0 { background: #e0f2fe; color: #0284c7; } /* Блакитний */
.hobby-pill--1 { background: #f3e8ff; color: #9333ea; } /* Фіолетовий */
.hobby-pill--2 { background: #dcfce7; color: #16a34a; } /* Зелений */
.hobby-pill--3 { background: #fef3c7; color: #d97706; } /* Бурштиновий */
.hobby-pill--4 { background: #ffe4e6; color: #e11d48; } /* Рожево-червоний */
.hobby-pill--5 { background: #e0e7ff; color: #4f46e5; } /* Індиго */
</style>
