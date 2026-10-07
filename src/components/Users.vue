<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from '../types/user'
import rawUsersData from '../assets/users.json'
import UserCard from './UserCard.vue'

const users = ref<User[]>(rawUsersData as User[])

const genderFilter = ref<'all' | 'male' | 'female'>('all')
const ageFilter = ref<'all' | '18+'>('all')
const sortBy = ref<'none' | 'name-asc' | 'name-desc' | 'age-asc' | 'age-desc'>('none')

const resetAll = () => {
  genderFilter.value = 'all'
  ageFilter.value = 'all'
  sortBy.value = 'none'
}

const filteredUsers = computed(() => {
  let result = [...users.value]

  if (genderFilter.value !== 'all') {
    result = result.filter((u) => u.gender === genderFilter.value)
  }

  if (ageFilter.value === '18+') {
    result = result.filter((u) => u.dob.age >= 18)
  }

  if (sortBy.value === 'name-asc') {
    result.sort((a, b) => a.name.first.localeCompare(b.name.first))
  } else if (sortBy.value === 'name-desc') {
    result.sort((a, b) => b.name.first.localeCompare(a.name.first))
  } else if (sortBy.value === 'age-asc') {
    result.sort((a, b) => a.dob.age - b.dob.age)
  } else if (sortBy.value === 'age-desc') {
    result.sort((a, b) => b.dob.age - a.dob.age)
  }

  return result
})
</script>

<template>
  <div class="page-layout">
    <div class="toolbar">
      <div class="filter-section">
        <span class="toolbar-label">Стать:</span>
        <div class="button-group">
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

      <button class="reset-button" @click="resetAll">
        Очистити все
      </button>
    </div>

    <!-- Завдання 5: Перевірка якщо список пустий -->
    <div v-if="filteredUsers.length === 0" class="empty-state">
      Список юзерів пустий
    </div>

    <!-- Список користувачів -->
    <div v-else class="cards-list">
      <UserCard
        v-for="user in filteredUsers"
        :key="user.id"
        :user="user"
      />
    </div>
  </div>
</template>

<style scoped>
.page-layout {
  max-width: 1040px;
  margin: 0 auto;
  padding: 36px 20px;
}

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

.filter-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.button-group {
  display: inline-flex;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 8px;
  gap: 2px;
}

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

.button-group button.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

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

.cards-list {
  display: flex;
  flex-direction: column;
}
</style>