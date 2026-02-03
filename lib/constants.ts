import { BackgroundPreset, ColorPreset, GlobalSettings, Slide } from '../types'

export const INITIAL_SLIDES: Slide[] = [
  {
    id: '1',
    title: 'Stop Wasting Time on *Design*',
    body: 'Here is how you can create *stunning* carousels in less than 5 minutes without opening Photoshop.',
    isCta: false,
  },
  {
    id: '2',
    title: 'The "Hook" Strategy',
    body: 'Your first slide must *stop the scroll*. Use bold typography and a controversial statement.',
    isCta: false,
  },
  {
    id: '3',
    title: 'Save This Post',
    body: 'Found this helpful? *Bookmark it* for later so you don\'t lose these tips.',
    isCta: true,
  },
]

export const INITIAL_SETTINGS: GlobalSettings = {
  aspectRatio: 'portrait',
  backgroundImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  isCustomBg: false,
  fontTheme: 'Inter',
  overlayOpacity: 40,
  accentColor: '#facc15',
  textColor: '#ffffff',
  handle: '@creatormode',
  swipeStyle: 'arrow',
  titleScale: 1.0,
  bodyScale: 1.0,
}

export const BG_PRESETS: BackgroundPreset[] = [
  {
    id: 'bg-1',
    name: 'Abstract Blue',
    value: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=100&auto=format&fit=crop',
  },
  {
    id: 'bg-2',
    name: 'Dark Gradient',
    value: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=100&auto=format&fit=crop',
  },
  {
    id: 'bg-3',
    name: 'Mesh Gradient',
    value: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=100&auto=format&fit=crop',
  },
  {
    id: 'bg-4',
    name: 'Clean Concrete',
    value: 'https://images.unsplash.com/photo-1507090960745-b32f65d3113a?q=80&w=1000&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1507090960745-b32f65d3113a?q=80&w=100&auto=format&fit=crop',
  },
  {
    id: 'bg-5',
    name: 'Neon Vibes',
    value: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1000&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=100&auto=format&fit=crop',
  },
]

export const COLOR_PRESETS: ColorPreset[] = [
  { id: 'cp-1', name: 'Yellow/White', accent: '#facc15', text: '#ffffff' },
  { id: 'cp-2', name: 'Cyan/White', accent: '#22d3ee', text: '#ffffff' },
  { id: 'cp-3', name: 'Lime/Black', accent: '#bef264', text: '#000000' },
  { id: 'cp-4', name: 'Pink/White', accent: '#f472b6', text: '#ffffff' },
  { id: 'cp-5', name: 'Orange/Dark', accent: '#fb923c', text: '#1f2937' },
  { id: 'cp-6', name: 'Lavender/White', accent: '#c084fc', text: '#ffffff' },
]
