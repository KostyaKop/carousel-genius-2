import { Language } from '@/types'

export const translations = {
  en: {
    // Landing
    hero: {
      title: 'Create Stunning Carousels',
      subtitle: 'AI-powered carousel generator for social media',
      cta: 'Start Creating',
    },
    nav: {
      signUp: 'Sign Up',
      signIn: 'Sign In',
      dashboard: 'Dashboard',
      signOut: 'Sign Out',
    },
    // Editor
    editor: {
      title: 'Carousel Editor',
      addSlide: 'Add Slide',
      removeSlide: 'Remove',
      moveUp: 'Move Up',
      moveDown: 'Move Down',
      export: 'Export',
      save: 'Save',
      undo: 'Undo',
      redo: 'Redo',
    },
    // Settings
    settings: {
      aspectRatio: 'Aspect Ratio',
      background: 'Background',
      fontTheme: 'Font',
      colors: 'Colors',
      overlay: 'Overlay Opacity',
    },
    // Free tier
    freeTier: {
      limit: 'Free tier allows 3 carousels',
      upgrade: 'Upgrade to Pro',
      remaining: 'remaining',
    },
    // Common
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
  },
  uk: {
    // Landing
    hero: {
      title: 'Створюйте приголомшливі карусел',
      subtitle: 'AI генератор каруселей для соцмереж',
      cta: 'Почати створення',
    },
    nav: {
      signUp: 'Реєстрація',
      signIn: 'Увійти',
      dashboard: 'Панель',
      signOut: 'Вийти',
    },
    // Editor
    editor: {
      title: 'Редактор каруселі',
      addSlide: 'Додати слайд',
      removeSlide: 'Видалити',
      moveUp: 'Вгору',
      moveDown: 'Вниз',
      export: 'Експорт',
      save: 'Зберегти',
      undo: 'Відмінити',
      redo: 'Повторити',
    },
    // Settings
    settings: {
      aspectRatio: 'Формат',
      background: 'Фон',
      fontTheme: 'Шрифт',
      colors: 'Кольори',
      overlay: 'Прозорість фону',
    },
    // Free tier
    freeTier: {
      limit: 'Безкоштовний план - 3 карусел',
      upgrade: 'Оновити до Pro',
      remaining: 'залишилось',
    },
    // Common
    cancel: 'Скасувати',
    confirm: 'Підтвердити',
    delete: 'Видалити',
    edit: 'Редагувати',
    create: 'Створити',
  },
  ru: {
    // Landing
    hero: {
      title: 'Создавайте потрясающие карусели',
      subtitle: 'AI генератор каруселей для соцсетей',
      cta: 'Начать создание',
    },
    nav: {
      signUp: 'Регистрация',
      signIn: 'Войти',
      dashboard: 'Панель',
      signOut: 'Выйти',
    },
    // Editor
    editor: {
      title: 'Редактор карусели',
      addSlide: 'Добавить слайд',
      removeSlide: 'Удалить',
      moveUp: 'Вверх',
      moveDown: 'Вниз',
      export: 'Экспорт',
      save: 'Сохранить',
      undo: 'Отменить',
      redo: 'Повторить',
    },
    // Settings
    settings: {
      aspectRatio: 'Формат',
      background: 'Фон',
      fontTheme: 'Шрифт',
      colors: 'Цвета',
      overlay: 'Прозрачность фона',
    },
    // Free tier
    freeTier: {
      limit: 'Бесплатный план - 3 карусели',
      upgrade: 'Обновить до Pro',
      remaining: 'осталось',
    },
    // Common
    cancel: 'Отменить',
    confirm: 'Подтвердить',
    delete: 'Удалить',
    edit: 'Редактировать',
    create: 'Создать',
  },
}

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.')
  let value: any = translations[lang]
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  return value || key
}

// Shorthand function for translations
export function t(key: string, lang: Language): string {
  // First try to find in flat structure (like 'undo', 'redo', 'cancel')
  const flatValue = (translations[lang] as any)[key]
  if (flatValue && typeof flatValue === 'string') {
    return flatValue
  }
  
  // Then try nested structure (like 'editor.undo')
  return getTranslation(lang, key)
}
