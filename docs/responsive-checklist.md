# Responsive Design Checklist

This checklist ensures SmartNote AI works well across all device sizes.

## Breakpoints

The app uses Tailwind's default breakpoints:

- **Mobile**: < 640px (default)
- **Tablet**: 640px - 1024px (`sm:`, `md:`)
- **Desktop**: > 1024px (`lg:`)

## Page-by-Page Checklist

### Landing Page (`/`)

- [x] Hero section stacks on mobile
- [x] Features grid: 1 column mobile, 3 columns desktop
- [x] CTA buttons full-width on mobile
- [x] Navigation menu collapses on mobile
- [x] Images scale appropriately

### Login/Signup Pages

- [x] Form centered and full-width on mobile
- [x] Input fields stack vertically
- [x] Buttons full-width on mobile
- [x] Logo and branding visible on all sizes

### Subject Setup (`/subject-setup`)

- [x] Subject badges wrap on mobile
- [x] Input and button stack on mobile
- [x] Card padding adjusts for small screens

### Dashboard (`/dashboard`)

- [x] Stats cards: 1 column mobile, 3 columns desktop
- [x] Subject grid: 1 column mobile, 2-3 columns desktop
- [x] Recent notes list stacks vertically
- [x] "Start Recording" button accessible on all sizes

### Record Page (`/record`)

- [x] Recording controls centered and visible
- [x] Two-column layout stacks on mobile
- [x] Transcript and notes side-by-side on desktop
- [x] Summary and subject detection stack on mobile
- [x] Save button accessible

### Note Detail (`/notes/:id`)

- [x] Back button visible
- [x] Action buttons wrap on mobile
- [x] Content readable on all sizes
- [x] Export buttons accessible

### Subjects Page (`/subjects`)

- [x] Subject grid: 1 column mobile, 2-3 columns desktop
- [x] Add subject form stacks on mobile
- [x] Remove buttons visible on hover (desktop)

### Settings Page (`/settings`)

- [x] Settings sections stack vertically
- [x] Form inputs full-width on mobile
- [x] Save buttons accessible

## Navigation

- [x] DashboardLayout navigation scrolls horizontally on mobile
- [x] Icon-only navigation on small screens
- [x] Full labels on larger screens
- [x] Active state visible on all sizes

## Touch Targets

- [x] Buttons minimum 44x44px (iOS guideline)
- [x] Input fields easily tappable
- [x] Links have adequate spacing
- [x] Cards have sufficient padding

## Typography

- [x] Font sizes readable on mobile (minimum 16px)
- [x] Line heights comfortable
- [x] Headings scale appropriately
- [x] Text doesn't overflow containers

## Images

- [x] Hero image scales with container
- [x] Recording visual responsive
- [x] No horizontal scrolling
- [x] Images use appropriate formats (WebP when possible)

## Forms

- [x] Input fields full-width on mobile
- [x] Labels above inputs on mobile
- [x] Error messages visible
- [x] Submit buttons accessible

## Testing Checklist

### Devices to Test

- [ ] iPhone SE (375px)
- [ ] iPhone 12/13/14 (390px)
- [ ] iPhone 14 Pro Max (428px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1920px+)

### Browsers to Test

- [ ] Chrome (mobile & desktop)
- [ ] Safari (iOS & macOS)
- [ ] Firefox
- [ ] Edge

### Test Scenarios

- [ ] Portrait and landscape orientations
- [ ] Touch interactions (tap, swipe, scroll)
- [ ] Keyboard input (mobile virtual keyboard)
- [ ] Form submissions
- [ ] Navigation between pages
- [ ] Recording functionality
- [ ] Note viewing and editing

## Common Issues to Watch For

1. **Horizontal Scrolling**: Ensure no element causes horizontal scroll
2. **Text Overflow**: Long text should wrap or truncate
3. **Button Overlap**: Buttons shouldn't overlap on small screens
4. **Image Loading**: Images should load quickly on mobile networks
5. **Touch Targets**: Ensure interactive elements are easily tappable

## Tools for Testing

- Chrome DevTools Device Mode
- Firefox Responsive Design Mode
- BrowserStack (for real device testing)
- Lighthouse mobile audit

## Performance on Mobile

- [ ] Initial load < 3 seconds on 3G
- [ ] Images optimized and lazy-loaded
- [ ] Code splitting for faster loads
- [ ] Minimal JavaScript bundle size

