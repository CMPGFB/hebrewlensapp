# HebrewLens - Project Context & Platform Details

## Project Overview
HebrewLens is a web-based Hebrew translation and learning platform that provides deep insights into Hebrew letters, their ancient pictographic meanings, and modern usage. Unlike traditional translation tools, HebrewLens focuses on the educational aspect of Hebrew by breaking down each letter to reveal its historical significance and evolution.

## Core Features

### 1. English to Hebrew Translation
- Real-time translation with letter-by-letter analysis
- Confidence scoring system for translation accuracy
- Support for special Hebrew terms (Elohim, Adonai, etc.)
- Visual feedback with confidence indicators

### 2. Hebrew Alphabet Explorer
- Interactive cards for all 22 Hebrew letters
- Ancient pictographic representations
- Modern meanings and transliterations
- Common word examples for each letter
- Smooth horizontal scrolling interface

### 3. Letter Analysis System
- Detailed breakdown of each Hebrew letter
- Ancient pictograph display (🐂 for Aleph, 🏠 for Bet, etc.)
- Historical meanings and modern interpretations
- Common usage examples

### 4. Social Sharing
- Generate beautiful shareable translation cards
- Download as PNG images
- Gradient backgrounds with professional styling
- Letter-by-letter breakdown display
- Perfect for social media sharing

### 5. Educational Guide
- Built-in help system
- Tips for better translation results
- Usage instructions and best practices

### 6. Support System
- Multiple donation options (Bitcoin Lightning, Cash App, PayPal)
- Bitcoin on-chain and Lightning Network support
- Traditional payment methods

## Technical Stack

### Frontend
- **React 18.3.1** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

### Key Dependencies
- `html-to-image` - Generate shareable images
- `openai` - AI-powered translation (optional enhancement)

### Development Tools
- ESLint - Code linting
- TypeScript ESLint - TypeScript-specific linting
- PostCSS - CSS processing
- Autoprefixer - CSS vendor prefixes

## File Structure
```
hebrewlens/
├── public/
│   └── favicon.svg          # Hebrew Aleph favicon
├── src/
│   ├── components/          # React components
│   ├── lib/
│   │   └── openai.ts       # OpenAI integration
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   ├── index.css           # Global styles
│   └── vite-env.d.ts       # Vite type definitions
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## Hebrew Alphabet Data Structure
Each Hebrew letter contains:
- `hebrew`: The Hebrew character
- `name`: English name (Aleph, Bet, etc.)
- `meaning`: Ancient/modern meaning
- `pictograph`: Emoji representation of ancient pictograph
- `transliteration`: English equivalent
- `commonWords`: Array of common Hebrew words
- `frequency`: Usage frequency (optional)
- `specialTerms`: Religious/special terms (optional)

## Translation Algorithm
1. **Word Splitting**: Split input text into individual words
2. **Special Term Detection**: Check for predefined Hebrew terms
3. **Letter Mapping**: Map English letters to Hebrew equivalents
4. **Multi-character Support**: Handle 'ch', 'sh', 'ts' combinations
5. **Confidence Calculation**: Score based on:
   - Letter match accuracy
   - Common word patterns
   - Context relevance
   - Pattern recognition

## UI/UX Design Principles
- **Apple-level aesthetics**: Clean, sophisticated design
- **Responsive design**: Mobile-first approach
- **Accessibility**: High contrast ratios, readable fonts
- **Micro-interactions**: Smooth animations and transitions
- **Progressive disclosure**: Information revealed contextually

## Color System
- **Primary**: Indigo (600, 700)
- **Secondary**: Purple gradients
- **Accent**: Rose for donations
- **Success**: Green for positive actions
- **Background**: Blue-indigo gradients
- **Text**: Gray scale (600, 900)

## Marketing & Launch Strategy

### Product Hunt Launch
**Tagline**: "Discover the ancient pictographic meaning behind every Hebrew letter"

**Description**: HebrewLens transforms how you understand Hebrew by revealing the ancient pictographic meaning behind each letter. Unlike traditional translators that just convert words, HebrewLens breaks down each letter to show its original pictograph (like an ox 🐂 for Aleph or a house 🏠 for Bet), its deeper meaning, and common modern usage. Perfect for students, scholars, and anyone fascinated by Hebrew's rich history.

### Target Audience
- Hebrew language students
- Biblical scholars and researchers
- Jewish community members
- Language enthusiasts
- Educators and teachers
- Religious studies students

### Unique Value Propositions
1. **Educational Focus**: Beyond translation to understanding
2. **Ancient Wisdom**: Connects modern Hebrew to ancient pictographs
3. **Visual Learning**: Beautiful, intuitive interface
4. **Shareable Content**: Generate social media-ready translations
5. **Free Access**: No paywalls for core functionality

## Monetization Strategy
- **Freemium Model**: Core features free, premium features paid
- **Donations**: Bitcoin Lightning, traditional payments
- **Educational Licensing**: Schools and institutions
- **API Access**: For developers and researchers

## Technical Considerations

### Performance
- Lazy loading for alphabet cards
- Optimized image generation
- Smooth scrolling animations
- Responsive design patterns

### Security
- Client-side translation (privacy-focused)
- Secure donation processing
- No user data collection

### Scalability
- Static site deployment ready
- CDN-friendly assets
- Minimal server requirements

## Future Enhancements
1. **Audio Pronunciation**: Hebrew letter sounds
2. **Advanced Grammar**: Verb conjugations, noun declensions
3. **Biblical Integration**: Verse analysis and breakdown
4. **Community Features**: User-generated content
5. **Mobile App**: Native iOS/Android versions
6. **Offline Mode**: Download for offline use

## Brand Identity
- **Mission**: Make Hebrew accessible and understandable
- **Vision**: Bridge ancient wisdom with modern learning
- **Values**: Education, accessibility, cultural preservation
- **Tone**: Scholarly yet approachable, respectful of tradition

## Contact & Support
- **Company**: CMPGFB LLC
- **Website**: hebrewlens.com
- **Support**: Multiple donation channels
- **Community**: Open to contributions and feedback

## License & Legal
- Copyright © 2026 CMPGFB LLC
- Open source components properly attributed
- Respectful use of Hebrew cultural elements
- Educational fair use principles

---

*This document serves as the comprehensive guide for HebrewLens development, marketing, and strategic planning.*