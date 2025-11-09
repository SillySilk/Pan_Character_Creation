# PanCasting D&D Character Generator

A comprehensive character generation system for D&D based on the PanCasting method, featuring intelligent ability score generation and D&D 3.5 character sheet export.

## Features

- 🎲 Intelligent ability score generation based on character background
- 📜 Complete D&D 3.5 character sheet template
- 📤 Export to multiple formats (JSON, HTML, Text, Print)
- 🎭 Comprehensive character creation wizard
- 🔄 Character history tracking
- ⚔️ Skills, occupations, and personality traits system

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/SillySilk/Pan_Character_Creation.git
cd Pan_Character_Creation

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Deployment to Netlify

### Method 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Log in to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub and select your repository
5. Netlify will auto-detect the build settings from `netlify.toml`
6. Click "Deploy site"

That's it! Netlify will automatically deploy on every push to your main branch.

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Build Configuration

The project includes a `netlify.toml` file with optimized settings:
- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect rules for client-side routing
- Asset optimization and caching headers

## Project Structure

```
src/
├── components/       # React components
│   └── character/   # Character-related components
├── services/        # Business logic and utilities
│   ├── abilityScoreGenerator.ts  # Intelligent stat generation
│   ├── dndIntegrationService.ts  # D&D conversion
│   └── exportService.ts          # Export functionality
├── stores/          # Zustand state management
├── types/           # TypeScript type definitions
└── utils/           # Helper utilities
```

## Key Features

### Intelligent Ability Score Generation

The system analyzes character background to generate appropriate ability scores:
- **Skills Analysis**: Combat skills boost STR/CON, Academic boosts INT, etc.
- **Occupation Analysis**: Military backgrounds increase physical stats
- **Event Analysis**: Life events influence character development
- **Multiple Methods**: Point-buy, 4d6 drop lowest, standard array, or intelligent

### D&D 3.5 Character Sheet

Complete, printable character sheet with:
- Ability scores with modifiers
- Combat statistics (AC, HP, Initiative)
- Saving throws (Fort, Ref, Will)
- Skills with ranks
- Equipment and possessions
- Feats and special abilities
- Background and personality

### Export Formats

- **JSON**: Raw character data for backup/sharing
- **HTML**: Full D&D 3.5 character sheet for web viewing
- **Text**: Human-readable character summary
- **Print**: Printer-friendly character sheet

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license here]

## Acknowledgments

Based on the PanCasting character generation system for creating detailed, story-rich D&D characters.
