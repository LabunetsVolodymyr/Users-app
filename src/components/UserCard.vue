<script setup lang="ts">
import { ref } from 'vue'
import type { User } from '../types/user'

const props = defineProps<{
  user: User
}>()

const isAboutOpen = ref(true)

const toggleAbout = () => {
  isAboutOpen.value = !isAboutOpen.value
}

const formatDate = (isoString: string) => {
  try {
    const d = new Date(isoString)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}.${month}.${year}`
  } catch {
    return isoString
  }
}

const getAgeClass = (age: number) => {
  return {
    'age-minor': age < 18,
    'age-young': age >= 18 && age <= 30,
    'age-adult': age >= 31 && age <= 50,
    'age-senior': age > 50,
  }
}
</script>

<template>
  <div class="card" :class="getAgeClass(user.dob.age)">
    <div class="card__accent-bar"></div>

    <div class="card__container">
      <aside class="card__sidebar">
        <img
          :src="user.picture"
          :alt="`${user.name.first} ${user.name.last}`"
          class="card__avatar"
        />

        <h2 class="card__name">
          {{ user.name.title }} {{ user.name.first }} {{ user.name.last }}
        </h2>

        <div class="card__quick-badges">
          <span class="badge">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="5" />
              <path d="M12 13v8M9 18h6" />
            </svg>
            {{ user.gender === 'female' ? 'Female' : 'Male' }}
          </span>

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

      <main class="card__content">
        <section class="accordion">
          <button class="accordion__trigger" @click="toggleAbout">
            <div class="accordion__title">
              <svg class="icon icon--primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>About me</span>
            </div>
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
          
          <div v-show="isAboutOpen" class="accordion__body">
            <p>{{ user.details }}</p>
          </div>
        </section>

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
            <span class="value">{{ formatDate(user.dob.date) }} (age {{ user.dob.age }})</span>

            <span class="label">Email</span>
            <span class="value">{{ user.email }}</span>

            <span class="label">Phone</span>
            <span class="value">{{ user.phone }}</span>

            <span class="label">Cell</span>
            <span class="value">{{ user.cell }}</span>
          </div>
        </section>

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

        <section class="section">
          <div class="section__header">
            <svg class="icon icon--primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <h3>Hobbies</h3>
          </div>

          <div class="tags-list">
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

<style scoped>
.card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #eef2f6;
  position: relative;
  overflow: hidden;
  margin-bottom: 32px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.card__accent-bar {
  height: 5px;
  width: 100%;
}

.card.age-minor .card__accent-bar {
  background: linear-gradient(90deg, #f87171, #fb923c);
}
.card.age-young .card__accent-bar {
  background: linear-gradient(90deg, #34d399, #10b981);
}
.card.age-adult .card__accent-bar {
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
}
.card.age-senior .card__accent-bar {
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
}

.card__container {
  display: grid;
  grid-template-columns: 320px 1fr;
  padding: 32px;
  gap: 40px;
}

@media (max-width: 860px) {
  .card__container {
    grid-template-columns: 1fr;
    padding: 20px;
    gap: 24px;
  }
}

/* ЛІВА ЧАСТИНА */
.card__sidebar {
  display: flex;
  flex-direction: column;
}

.card__avatar {
  width: 100%;
  max-width: 280px;
  height: 280px;
  border-radius: 18px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
}

.card__name {
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
}

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

.icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  stroke: #64748b;
}

.icon--primary {
  stroke: #1e293b;
}

/* ПРАВА ЧАСТИНА */
.card__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* АКОРДЕОН ABOUT ME */
.accordion {
  border-radius: 12px;
  background-color: #f8fafc;
  overflow: hidden;
  border: 1px solid #f1f5f9;
}

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

.accordion__arrow {
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
  stroke: #64748b;
}

.accordion__arrow--open {
  transform: rotate(180deg);
}

.accordion__body {
  padding: 0 18px 16px 18px;
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
}

/* СЕКЦІЇ ТА ТАБЛИЦІ */
.section {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 20px;
}

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

/* ХОБІ БЕЙДЖІ */
.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hobby-pill {
  padding: 6px 16px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
}

.hobby-pill--0 { background: #e0f2fe; color: #0284c7; }
.hobby-pill--1 { background: #f3e8ff; color: #9333ea; }
.hobby-pill--2 { background: #dcfce7; color: #16a34a; }
.hobby-pill--3 { background: #fef3c7; color: #d97706; }
.hobby-pill--4 { background: #ffe4e6; color: #e11d48; }
.hobby-pill--5 { background: #e0e7ff; color: #4f46e5; }
</style>