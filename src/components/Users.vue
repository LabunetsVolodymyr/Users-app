<!-- Секція логіки компонента. Атрибут setup вмикає Composition API, а lang="ts" — підтримку TypeScript -->
<script setup lang="ts">
// Імпортуємо функції реактивності ref (для стану) та computed (для обчислюваних значень) з ядра Vue
import { ref, computed } from 'vue'
// Імпортуємо інтерфейс User для суворої типізації (import type видаляється при компіляції у звичайний JS)
import type { User } from '../types/user'
// Імпортуємо масив користувачів із локального JSON-файлу
import rawUsersData from '../assets/users.json'
// Імпортуємо дочірній компонент картки (у <script setup> він автоматично стає доступним у шаблоні)
import UserCard from './UserCard.vue'

// Створюємо реактивний масив користувачів. Приводимо тип JSON-даних до масиву User[]
const users = ref<User[]>(rawUsersData as User[])

// Реактивні змінні для збереження поточного вибору фільтрів та сортування.
// Використовуємо Literal Union Types, щоб уникнути одруків у назвах режимів.
const genderFilter = ref<'all' | 'male' | 'female'>('all') // Дефолтний стан: 'all' (всі статі)
const ageFilter = ref<'all' | '18+'>('all')               // Дефолтний стан: 'all' (будь-який вік)
const sortBy = ref<'none' | 'name-asc' | 'name-desc' | 'age-asc' | 'age-desc'>('none') // Без сортування

// Завдання 5: Функція для кнопки "Очистити все"
// Повертає всі реактивні змінні стану до їхніх початкових значень (у скрипті звертаємось через .value)
const resetAll = () => {
  genderFilter.value = 'all'
  ageFilter.value = 'all'
  sortBy.value = 'none'
}

// Завдання 5: Обчислювана властивість (computed) для одночасної фільтрації та сортування.
// Vue кешує її результат і автоматично перераховує список лише тоді, коли змінюються
// залежні змінні (users, genderFilter, ageFilter або sortBy).
const filteredUsers = computed(() => {
  // КРОК 1: Робимо поверхневу копію масиву через спред-оператор [...].
  // Це критично важливо, бо метод .sort() мутує (змінює) масив на місці.
  // Завдяки копії оригінальний масив users.value залишається незмінним.
  let result = [...users.value]

  // КРОК 2: Фільтрація за статтю.
  // Якщо обрано 'male' або 'female', залишаємо лише користувачів із відповідним полем gender
  if (genderFilter.value !== 'all') {
    result = result.filter((u) => u.gender === genderFilter.value)
  }

  // КРОК 3: Фільтрація за віком (18+).
  // Якщо увімкнено фільтр '18+', залишаємо лише тих, у кого dob.age >= 18
  if (ageFilter.value === '18+') {
    result = result.filter((u) => u.dob.age >= 18)
  }

  // КРОК 4: Сортування вже відфільтрованого масиву (тому сортування не ламає фільтрацію).
  if (sortBy.value === 'name-asc') {
    // Сортування за ім'ям (А -> Я) за допомогою вбудованого методу рядків localeCompare
    result.sort((a, b) => a.name.first.localeCompare(b.name.first))
  } else if (sortBy.value === 'name-desc') {
    // Сортування за ім'ям у зворотному порядку (Я -> А) — міняємо місцями b та a
    result.sort((a, b) => b.name.first.localeCompare(a.name.first))
  } else if (sortBy.value === 'age-asc') {
    // Сортування за віком за зростанням (від молодших до старших)
    result.sort((a, b) => a.dob.age - b.dob.age)
  } else if (sortBy.value === 'age-desc') {
    // Сортування за віком за спаданням (від старших до молодших)
    result.sort((a, b) => b.dob.age - a.dob.age)
  }

  // Повертаємо фінальний відфільтрований і відсортований масив для рендерингу в <template>
  return result
})
</script>

<!-- Секція HTML-шаблону компонента -->
<template>
  <div class="page-layout">
    <!-- Завдання 5: Панель інструментів (toolbar) над списком користувачів -->
    <div class="toolbar">

      <!-- Блок фільтрації за статтю -->
      <div class="filter-section">
        <span class="toolbar-label">Стать:</span>
        <div class="button-group">
          <!-- :class="{ active: ... }" динамічно додає клас 'active', якщо умова істинна -->
          <!-- @click="..." (скорочення від v-on:click) змінює значення реактивної змінної при кліку -->
          <!-- У шаблоні Vue автоматично розпаковує ref, тому .value писати не потрібно -->
          <button
            :class="{ active: genderFilter === 'all' }"
            @click="genderFilter = 'all'"
          >
            Всі
          </button>
          <button
            :class="{ active: genderFilter === 'male' }"
            @click="genderFilter = 'male'"
          >
            Чоловіки
          </button>
          <button
            :class="{ active: genderFilter === 'female' }"
            @click="genderFilter = 'female'"
          >
            Жінки
          </button>
        </div>
      </div>

      <!-- Блок фільтрації за віком (Всі / 18+) -->
      <div class="filter-section">
        <span class="toolbar-label">Вік:</span>
        <div class="button-group">
          <button
            :class="{ active: ageFilter === 'all' }"
            @click="ageFilter = 'all'"
          >
            Всі
          </button>
          <button
            :class="{ active: ageFilter === '18+' }"
            @click="ageFilter = '18+'"
          >
            18+
          </button>
        </div>
      </div>

      <!-- Блок кнопок сортування (за ім'ям та за віком) -->
      <div class="filter-section">
        <span class="toolbar-label">Сортування:</span>
        <div class="button-group">
          <button
            :class="{ active: sortBy === 'name-asc' }"
            @click="sortBy = 'name-asc'"
          >
            Ім'я ↑
          </button>
          <button
            :class="{ active: sortBy === 'name-desc' }"
            @click="sortBy = 'name-desc'"
          >
            Ім'я ↓
          </button>
          <button
            :class="{ active: sortBy === 'age-asc' }"
            @click="sortBy = 'age-asc'"
          >
            Вік ↑
          </button>
          <button
            :class="{ active: sortBy === 'age-desc' }"
            @click="sortBy = 'age-desc'"
          >
            Вік ↓
          </button>
        </div>
      </div>

      <!-- Кнопка скидання всіх фільтрів та сортування до початкового стану -->
      <button class="reset-button" @click="resetAll">
        Очистити все
      </button>
    </div>

    <!-- Завдання 5: Перевірка на порожній список за допомогою директиви v-if -->
    <!-- Якщо після фільтрації в масиві filteredUsers немає жодного елемента, показуємо повідомлення -->
    <div v-if="filteredUsers.length === 0" class="empty-state">
      Список юзерів пустий
    </div>

    <!-- Директива v-else: виконується, якщо в масиві filteredUsers є хоча б один користувач -->
    <div v-else class="cards-list">
      <!-- Директива v-for перебирає масив filteredUsers і рендерить компонент UserCard для кожного юзера -->
      <!-- Атрибут :key="user.id" обов'язковий для ідентифікації елементів Віртуальним DOM при сортуванні/фільтрації -->
      <!-- Атрибут :user="user" (v-bind:user) передає об'єкт конкретного користувача всередину UserCard як prop -->
      <UserCard
        v-for="user in filteredUsers"
        :key="user.id"
        :user="user"
      />
    </div>
  </div>
</template>

<!-- Секція стилів. Атрибут scoped гарантує, що ці стилі застосуються ТІЛЬКИ до цього компонента -->
<style scoped>
/* Основний контейнер сторінки з центруванням і обмеженням максимальної ширини */
.page-layout {
  max-width: 1040px;
  margin: 0 auto;
  padding: 36px 20px;
}

/* Стилізація панелі фільтрів (Flexbox з переносом елементів на новий рядок при зменшенні екрана) */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  background: #ffffff;
  padding: 16px 24px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #edf2f7;
  margin-bottom: 32px;
}

/* Група "Назва фільтра + кнопки" */
.filter-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Підпис перед кнопками ("Стать:", "Вік:", "Сортування:") */
.toolbar-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

/* Сіра підкладка під групу кнопок (стиль segmented control) */
.button-group {
  display: inline-flex;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 8px;
  gap: 2px;
}

/* Базовий вигляд неактивної кнопки фільтра */
.button-group button {
  background: transparent;
  border: none;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.button-group button:hover {
  color: #0f172a;
}

/* Вигляд активної (вибраної) кнопки фільтра — додається динамічно через :class="{ active: ... }" */
.button-group button.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

/* Кнопка "Очистити все" (притиснута праворуч завдяки margin-left: auto) */
.reset-button {
  margin-left: auto;
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #ef4444;
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.reset-button:hover {
  background: #fecaca;
}

/* Стилізація блоку "Список юзерів пустий" */
.empty-state {
  text-align: center;
  padding: 48px;
  background: #ffffff;
  border-radius: 16px;
  border: 2px dashed #cbd5e1;
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
}

/* Контейнер для списку карток (розташовує картки вертикально одна під одною) */
.cards-list {
  display: flex;
  flex-direction: column;
}
</style>
