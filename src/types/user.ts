// Декомпозиція типів: розбиваємо складний об'єкт користувача на менші логічні інтерфейси
export interface UserName {
  title: string // Звертання (Mr, Mrs, Ms)
  first: string
  last: string
}

export interface UserStreet {
  number: number // Номер будинку
  name: string   // Назва вулиці
}

export interface UserTimezone {
  offset: string      // Часовий зсув (наприклад, "+2:00")
  description: string // Опис часового поясу
}

export interface UserLocation {
  street: UserStreet       // Вкладений інтерфейс вулиці
  city: string
  state: string
  country: string
  // Union Type (об'єднання типів): поштовий індекс може бути як числом (98555), так і рядком
  postcode: number | string
  timezone: UserTimezone   // Вкладений інтерфейс часового поясу
}

export interface UserDob {
  date: string // Дата народження у форматі ISO-рядка
  age: number  // Вік числом (використовується для фільтрації та умовного стилізування)
}

// Головний інтерфейс користувача, який об'єднує всі під-інтерфейси
export interface User {
  id: number                 // Унікальний ідентифікатор (потрібен для атрибута :key у v-for)
  // Literal Union Type: суворо обмежуємо значення тільки 'female' або 'male'
  gender: 'female' | 'male'
  name: UserName
  location: UserLocation
  email: string
  dob: UserDob
  phone: string
  cell: string
  picture: string            // Шлях до фотографії у папці public/users
  hobbies: string[]          // Масив рядків зі списком хобі користувача
  details: string            // Коротка додаткова інформація про юзера (для v-show)
}
