# On Mission Hub - Application Architecture & Overview

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture](#architecture)
3. [Core Concepts](#core-concepts)
4. [Component Structure](#component-structure)
5. [Data Flow](#data-flow)
6. [API Routes](#api-routes)
7. [Hooks & State Management](#hooks--state-management)
8. [Styling & Theming](#styling--theming)
9. [Authentication](#authentication)
10. [Development Guide](#development-guide)

---

## Quick Start

### What is On Mission Hub?

On Mission Hub is a spiritual companion web application that helps users organize their prayer life using a concentric rings visualization inspired by the concept of relational orbits. It integrates daily Scripture readings, monthly missional action prompts, and AI-powered prayer guidance to support intentional spiritual living.

### Key Features

✨ **Concentric Rings Visualization**

- Visual representation of relationships (self, friends, acquaintances, strangers, places)
- Interactive item management
- Animated transitions and responsive design

📖 **Daily Scripture Readings**

- Manage daily Bible reading schedule
- Integration with YouVersion API for content delivery
- Admin dashboard for scheduling readings

🙏 **Prayer Session Generator**

- AI-powered prayer prompts using OpenAI
- Guided prayer breathing exercises
- Contextual prompts based on relationship category

📅 **Monthly Missional Actions**

- Scheduled action prompts for spiritual growth
- Rich text content editor
- Automatic release date management

---

## Architecture

### Technology Stack

**Frontend**

- Next.js 16 (App Router) - React framework with built-in optimizations
- React 19.2.3 - UI library
- TypeScript - Type-safe development
- Tailwind CSS v4 - Utility-first CSS
- Framer Motion - Smooth animations
- React Query - Server state management

**Backend**

- Next.js API Routes - Serverless backend
- Firebase Firestore - Real-time database
- Firebase Authentication - User management
- OpenAI API - Prayer prompt generation
- YouVersion API - Scripture content

**Development**

- ESLint - Code quality
- TypeScript Compiler - Type checking
- Tailwind PostCSS v4 - CSS processing

### Application Layers

```
┌─────────────────────────────────────────────┐
│         User Interface Layer                │
│  (Components, Modals, Visualizations)       │
├─────────────────────────────────────────────┤
│       State Management Layer                │
│  (React Query, Custom Hooks, Context)       │
├─────────────────────────────────────────────┤
│       API/Service Layer                     │
│  (Firebase, OpenAI, YouVersion, Routes)     │
├─────────────────────────────────────────────┤
│       External Services                     │
│  (Firestore, OpenAI, YouVersion)            │
└─────────────────────────────────────────────┘
```

---

## Core Concepts

### 1. Concentric Rings Model

The app visualizes relationships in concentric rings:

```
                    Places
                (Strangers)
              (Acquaintances)
                 (Friends)
               (Self/Center)
```

**Ring Data Structure** (`app/data/RingData.ts`):

```typescript
export type RingType = {
  id: string; // "center", "friends", "acquaintances", "strangers", "places"
  name: string; // Display name
  radius: number; // SVG radius for visualization
  itemColor: string; // Tailwind class for items
  bgColor: string; // Tailwind class for ring background
  borderColor: string; // Tailwind class for border
  startAngle: number; // Starting angle for item layout
};
```

### 2. Orbit Items

User data points placed in rings:

```typescript
export type OrbitItemType = {
  id: string; // Firestore doc ID
  ring: string; // Ring ID reference
  name: string; // Person/place name
  prayer?: string; // Prayer request text
};
```

Stored in Firestore at:

```
/users/{userId}/orbitItems/{itemId}
```

### 3. Scripture Readings

Daily Bible reading assignments:

```typescript
export interface Reading {
  id: string; // YYYY-MM-DD format
  reference: string; // e.g., "John 3:16"
  createdAt: Date;
  updatedAt: Date;
}
```

Stored in Firestore at:

```
/readings/{dateKey}
```

### 4. Monthly Actions

Recurring spiritual action prompts:

```typescript
export interface MonthlyAction {
  id: string; // YYYY-MM format
  title: string;
  content: string; // Rich HTML content
  month: number;
  year: number;
  releaseDate: Date; // When action becomes active
  createdAt: Date;
  updatedAt: Date;
}
```

Stored in Firestore at:

```
/monthlyActions/{yearMonth}
```

---

## Component Structure

### Page Architecture

```
app/
├── page.tsx (Home Page)
│   ├── ConcentricRings
│   │   ├── Ring (×5) - One per orbital level
│   │   ├── OrbitItem (×N) - User's items
│   │   └── RingSelection - Bottom controls
│   ├── Header
│   │   ├── MonthlyActionButton
│   │   ├── ReadingButton
│   │   └── PrayerButton
│   ├── EditModal - Create/edit items
│   ├── ReadingModal - Display scripture
│   ├── MonthlyActionModal - Display action
│   ├── PrayerSession - Main prayer flow
│   └── PrayerModal - Prayer presentation
│
└── admin/page.tsx (Admin Dashboard)
    ├── CalendarView - Select dates for readings
    ├── ContentQueue - Upcoming content
    ├── RichTextEditor - Create actions
    └── Forms - Reading/action forms
```

### Component Descriptions

#### `ConcentricRings.tsx`

- Main layout container for the visualization
- Computes positions for items using polar coordinates
- Handles ring selection state
- Manages item-to-ring mapping

**Key Props**:

- `items`: Array of OrbitItemType
- `onItemClick`: Callback when item is clicked

**Key Logic**:

```typescript
// Polar coordinate calculation
const angle = indexInRing * angleStep - Math.PI / 2 + startOffset;
const x = Math.cos(angle) * radius;
const y = Math.sin(angle) * radius;
```

#### `Ring.tsx`

- Renders individual concentric circle
- Animated scaling based on selection
- Background and border colors

**Props**:

- `bgColor`, `borderColor`: Tailwind classes
- `index`: Ring level (0-4)
- `selectedRing`: Currently selected ring
- `z`: Z-index for layering

#### `OrbitItem.tsx`

- Individual user item (person/place)
- Animated position and scale
- Expands when ring is selected

**Props**:

- `color`: Tailwind class
- `item`: OrbitItemType
- `selectedRing`: Which ring is selected
- `x`, `y`: Computed position

#### `EditModal.tsx`

- Create/edit orbit items form
- Form validation with error messages
- Delete functionality

**Features**:

- Name validation (required, max 100 chars)
- Ring selection dropdown
- Prayer request text area
- Confirmation dialogs for deletion

#### `ReadingModal.tsx`

- Display daily Scripture reading
- Fetches content from YouVersion API
- XSS protection with DOMPurify sanitization

**Flow**:

1. Determine today's date
2. Look up reading for date
3. Fetch content from `/api/reading`
4. Sanitize HTML
5. Display with loading states

#### `PrayerSession.tsx`

- Multi-page prayer flow
- Generates prompts via AI
- Displays contextual prayers

**Pages**:

1. Intro - Explain prayer
2. Breath Prayer - Guided breathing
3. Item Pages - Individual prayer prompts (×N)
4. Completion - Success screen

#### Admin Components

**`CalendarView.tsx`**

- Select dates for creating readings
- Highlight existing readings
- Mini calendar navigation

**`ContentQueue.tsx`**

- Show upcoming 30 days of readings
- Show next 5 monthly actions
- Edit/delete controls

#### UI Components (`ui/card.tsx`)

- Reusable card component composition
- Headings, content, descriptions, footers
- Consistent styling system

---

## Data Flow

### User Item Management Flow

```
User clicks "Add Item"
        ↓
EditModal Opens
        ↓
User fills form
        ↓
Form Validation passes
        ↓
handleSave() called
        ↓
useOrbit.addItem() → Firebase
        ↓
Firestore triggers real-time listener
        ↓
useOrbit state updates
        ↓
ConcentricRings re-renders with new item
```

### Scripture Reading Flow

```
User clicks "Daily Reading"
        ↓
ReadingModal opens
        ↓
Get today's date (NY timezone)
        ↓
Search readings array for date
        ↓
useGetReadingContent hook triggers
        ↓
Request /api/reading with passage
        ↓
API proxies to YouVersion API
        ↓
HTML response sanitized with DOMPurify
        ↓
Display in modal with loading state
```

### Prayer Session Flow

```
User clicks "Start Prayer"
        ↓
Select items to pray for
        ↓
PrayerSession opens
        ↓
useGeneratePrayerPrompts hook called
        ↓
POST /api/ai/prayer with selected items
        ↓
OpenAI generates prompts with context
        ↓
PrayerModal shows flow:
   1. Intro page
   2. Breath prayer
   3. Item prompts (×N)
   4. Completion
        ↓
User completes prayer
```

---

## API Routes

### `/api/reading`

**Endpoint**: `GET /api/reading?bibleId=111&passage=JON.3:16&format=html`

**Purpose**: Proxy to YouVersion API, fetch scripture content

**Query Parameters**:

- `bibleId` (string): Bible version ID (default: "111" = NIV)
- `passage` (string): USFM format passage (default: "JHN.3")
- `format` (string): Response format - "html" or "text" (default: "html")

**Response**:

```json
{
  "data": {
    "reference": "John 3:16",
    "content": "<p>For God so loved...</p>",
    "copyright": "..."
  }
}
```

**Error Handling**:

- 400: Invalid passage parameter
- 500: Missing API key or YouVersion error

**Caching**: 5 minutes (set in route handler)

### `/api/ai/prayer`

**Endpoint**: `POST /api/ai/prayer`

**Purpose**: Generate AI-powered prayer prompts

**Request Body**:

```json
{
  "items": [
    {
      "id": "item-1",
      "name": "John",
      "ring": "friends",
      "prayer": "Wisdom in decision-making"
    }
  ]
}
```

**Response**:

```json
{
  "prompts": [
    {
      "itemId": "item-1",
      "text": "Lord, guide John with wisdom..."
    }
  ]
}
```

**Features**:

- Different prompts for people vs places
- Incorporates user's prayer requests
- Graceful fallbacks if OpenAI fails
- Limit: 50 items max

**Error Handling**:

- 400: Too many items
- 500: Missing API key or OpenAI error

---

## Hooks & State Management

### Custom Hooks

#### `useOrbit()`

**Purpose**: Manage user's orbit items

```typescript
const { items, loading, error, addItem, updateItem, deleteItem } = useOrbit();
```

**Features**:

- Real-time Firestore listener
- CRUD operations
- Error state tracking
- User authentication aware

**Methods**:

- `addItem(item)` - Add new item
- `updateItem(id, data)` - Update item fields
- `deleteItem(id)` - Remove item

#### `useReadings()`

**Purpose**: Fetch and manage daily readings

```typescript
const { data: readings, isLoading } = useReadings();
```

**Features**:

- React Query caching
- Automatic refetching
- Sorted by date

#### `useMonthlyActions()`

**Purpose**: Fetch and manage monthly actions

```typescript
const { data: monthlyActions, isLoading } = useMonthlyActions();
```

**Features**:

- Sorted by release date
- Save and delete mutations included

#### `useGetReadingContent(bibleId, passage, options)`

**Purpose**: Fetch scripture content from YouVersion API

```typescript
const { data, isLoading, isError } = useGetReadingContent("111", "JON.3:16");
```

**Features**:

- 5-minute cache stale time
- Retry on failure
- Configurable query options

#### `useGeneratePrayerPrompts()`

**Purpose**: Generate AI prayer prompts

```typescript
const mutation = useGeneratePrayerPrompts();
const result = await mutation.mutateAsync(items);
```

**Features**:

- Async mutation
- Error handling with fallbacks
- Loading state

### State Management Pattern

```
React Component State
    ↓
    ├─ UI State (modals, forms)
    │   └─ Local useState
    │
    ├─ Server State (data from APIs)
    │   └─ React Query (useQuery, useMutation)
    │
    └─ User Auth State
        └─ AuthContext (useAuth)
```

### AuthProvider (`app/providers/AuthProvider.tsx`)

**Purpose**: Handle Firebase authentication

```typescript
const { user, loading } = useAuth();
```

**Features**:

- Anonymous sign-in by default
- Persists across sessions
- Loading state while initializing

---

## Styling & Theming

### Tailwind Configuration

**File**: `app/globals.css` + `tailwind.config.ts`

**Features**:

- Dark theme (zinc-900 base)
- Gradient accents (indigo/purple)
- Responsive utilities
- Custom fonts:
  - `--font-lora`: Serif (headings)
  - `--font-source-sans-3`: Sans (body)
  - `--font-source-code-pro`: Mono (code)

### Color System

**Primary Colors**:

- `indigo-500` - Primary action
- `purple-600` - Secondary accent
- `sky-500` - Info/reading

**Ring Colors**:

- `yellow-*` - Center (self)
- `blue-*` - Friends
- `teal-*` - Acquaintances
- `purple-*` - Strangers
- `orange-*` - Places

**Neutral**:

- `zinc-900`, `zinc-800`, `zinc-700` - Backgrounds
- `zinc-400`, `zinc-500` - Text muted
- `white` - Text primary

### Component Classes

Items use semantic color classes:

```tsx
<div className={`${color} text-white font-bold ...`}>
```

Where `color` comes from `RingData.itemColor`.

---

## Authentication

### Firebase Setup

**Configuration** (`app/lib/firebase.ts`):

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
};

const auth = getAuth(app);
const db = getFirestore(app);
```

### Anonymous Authentication

**Default Behavior**:

1. On app load, check if user is signed in
2. If not, automatically sign in anonymously
3. User ID persists in localStorage via Firebase
4. Each user gets their own Firestore subcollection

**Security**:

- Firestore rules restrict access to own data
- No sensitive data stored in client
- API keys are public-safe (`NEXT_PUBLIC_` prefix)
- Server-only keys in environment variables

---

## Development Guide

### Project Structure

```
on-mission-hub/
├── app/                           # Next.js app directory
│   ├── api/                      # API routes
│   ├── admin/                    # Admin dashboard
│   ├── components/               # React components
│   │   ├── Admin/               # Admin components
│   │   ├── Prayer/              # Prayer flow
│   │   └── ui/                  # Reusable UI
│   ├── hooks/                    # Custom hooks
│   ├── data/                     # Static config
│   ├── constants/                # Centralized constants
│   ├── lib/                      # Utilities
│   ├── providers/                # Context providers
│   ├── utils/                    # Helper functions
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── providers.tsx             # Provider setup
├── public/                        # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── next.config.ts
└── PRODUCTION_REVIEW.md          # This document!
```

### Common Tasks

#### Adding a New Ring

1. Add to `app/data/RingData.ts`:

```typescript
{
  id: "colleagues",
  name: "Colleagues",
  radius: 300,
  itemColor: "bg-green-600",
  bgColor: "bg-green-600/10",
  borderColor: "border-green-500/50",
  startAngle: 45,
}
```

2. Update color mapping in `app/constants/colors.ts`
3. Components automatically pick it up

#### Adding a New Component

1. Create in `app/components/NewComponent.tsx`
2. Add `"use client"` if using hooks/state
3. Export default
4. Import in parent component

#### Modifying Firestore Structure

1. Update TypeScript interfaces in hooks
2. Update Query logic if needed
3. Test with Firebase emulator or staging
4. Perform data migration if needed

### Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The app runs at http://localhost:3000
```

### Building for Production

```bash
# Check for TypeScript errors
npm run lint

# Build
npm run build

# Test production build locally
npm run start
```

### Environment Variables

Required in `.env.local`:

```
# Firebase (public - safe to commit)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx

# Server-only (keep secret!)
YOUVERSION_API_KEY=xxx
OPENAI_API_KEY=xxx
```

### Performance Tips

1. **React Query**: Already configured for caching
2. **Images**: Optimize with Next.js Image component
3. **Fonts**: Google Fonts already optimized
4. **Bundle**: Tree-shaking enabled by default

### Debugging

**Browser DevTools**:

- React DevTools - Inspect components
- Network tab - Monitor API calls
- Console - Check for errors

**Server Logs**:

```bash
# Check Next.js server output
npm run dev

# Look for API errors in terminal
```

---

## Glossary

| Term           | Definition                                              |
| -------------- | ------------------------------------------------------- |
| **Orbit Item** | A person or place in the user's relational sphere       |
| **Ring**       | A concentric circle representing relationship proximity |
| **USFM**       | Unified Standard Format Markup for Bible passages       |
| **DOMPurify**  | XSS protection library for sanitizing HTML              |
| **Firestore**  | Google's real-time NoSQL database                       |
| **YouVersion** | Bible content API and reading platform                  |
| **OpenAI**     | AI service providing prayer prompt generation           |

---

## Further Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Firebase Docs](https://firebase.google.com/docs)

---

**Last Updated**: February 26, 2026
