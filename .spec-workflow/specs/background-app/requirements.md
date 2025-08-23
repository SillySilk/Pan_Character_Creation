# Requirements Document

## Introduction

The Central Casting D&D 3.5 Background Generator is a React + TypeScript web application that enables users to create detailed character backgrounds using the comprehensive Central Casting table system. This application transforms the traditional pen-and-paper character generation process into an interactive digital experience, providing guided character creation with rich backstory development, personality generation, and seamless integration with D&D 3.5 character sheets.

The system processes complex interconnected tables (100s through 800s series) covering Heritage & Birth, Youth Events, Occupations, Adulthood Events, Personality development, Miscellaneous Events, Contacts & NPCs, and Special Gifts/Curses. Each table contains conditional logic, cross-references, modifier calculations, and personality trait assignments that create unique, detailed character backgrounds.

## Alignment with Product Vision

This feature serves as the core product, providing a comprehensive digital solution for D&D character background generation that replaces manual table rolling with an intelligent, guided experience while maintaining the depth and authenticity of the original Central Casting system.

## Requirements

### Requirement 1: Table System Engine

**User Story:** As a player, I want to navigate through interconnected character generation tables with automatic modifier calculations and cross-references, so that I can create detailed backgrounds without manual table lookups.

#### Acceptance Criteria

1. WHEN a user rolls on any table THEN the system SHALL apply all relevant modifiers (CuMod, SolMod, BiMod, etc.) automatically
2. WHEN a table entry contains a "goto" reference (e.g., "627 Elven Events") THEN the system SHALL navigate to the referenced table automatically
3. WHEN a table entry specifies subtables THEN the system SHALL present the appropriate subtable options
4. IF a table requires conditional logic (culture restrictions, race limitations) THEN the system SHALL filter available entries accordingly
5. WHEN rolling dice THEN the system SHALL support all dice types (d4, d6, d8, d10, d12, d20, d100, 2d10, 2d20, 3d6) with proper range validation

### Requirement 2: Character State Management

**User Story:** As a player, I want my character's background, traits, and modifiers to be tracked throughout the generation process, so that all decisions influence future table rolls and final character attributes.

#### Acceptance Criteria

1. WHEN any table result affects character attributes THEN the system SHALL update the character state immediately
2. WHEN modifiers are gained from events or background elements THEN the system SHALL apply them to subsequent table rolls
3. WHEN personality traits are assigned THEN the system SHALL categorize them as Lightside, Neutral, Darkside, or Exotic
4. IF events create relationships or NPCs THEN the system SHALL store them with full details (name, occupation, relationship type, background)
5. WHEN occupation or skill ranks are gained THEN the system SHALL track them with proper D&D 3.5 skill mappings

### Requirement 3: Heritage and Birth Generation (100s Tables)

**User Story:** As a player, I want to determine my character's race, culture, social status, and birth circumstances, so that I establish the foundation for my character's background and initial modifiers.

#### Acceptance Criteria

1. WHEN rolling on Race Table (101a) THEN the system SHALL assign race with appropriate culture restrictions and special events
2. WHEN determining Cultural Background (102) THEN the system SHALL set CuMod, native environment, survival rates, and literacy modifiers
3. WHEN establishing Social Status (103) THEN the system SHALL set SolMod, survival modifiers, money multipliers, and literacy bonuses
4. IF the character is non-human THEN the system SHALL direct to appropriate racial event tables (627-630)
5. WHEN birth circumstances are determined THEN the system SHALL establish family structure, legitimacy, and BiMod values

### Requirement 4: Youth Events Processing (200s Tables)

**User Story:** As a player, I want to generate childhood and adolescence events that shape my character's early development and personality traits, so that my character has a rich formative background.

#### Acceptance Criteria

1. WHEN processing Youth Events (208) THEN the system SHALL generate separate events for childhood and adolescence periods
2. WHEN rolling for number of events THEN the system SHALL use 1d3 for each life period as specified
3. WHEN events assign personality traits [L], [D], [N], or [R] THEN the system SHALL add them to appropriate trait categories
4. IF an event requires age determination THEN the system SHALL calculate age appropriately (1d12 for childhood, 1d6+12 for adolescence)
5. WHEN tragic events (624) or wonderful events (625) occur THEN the system SHALL process their complex subtable effects

### Requirement 5: Occupations and Skills System (300s Tables)

**User Story:** As a player, I want to determine my character's occupational background including apprenticeships, career progression, and skill development, so that I have mechanical benefits and roleplay context for my character's abilities.

#### Acceptance Criteria

1. WHEN processing apprenticeships (309) THEN the system SHALL track 5-year duration, skill ranks gained, and special events
2. WHEN determining occupations THEN the system SHALL assign culture-appropriate careers with rank progression
3. WHEN calculating skill ranks THEN the system SHALL use proper dice rolls (d20: 12-16=Rank 3, 17-19=Rank 4, 20=Rank 5)
4. IF hobbies are gained THEN the system SHALL track interest levels and income spent percentages
5. WHEN work attitudes or achievements are determined THEN the system SHALL record them for character development context

### Requirement 6: Adulthood Events Processing (400s Tables)

**User Story:** As a player, I want to generate significant adult life events that shape my character's mature development and establish important relationships or achievements, so that my character has meaningful adult experiences.

#### Acceptance Criteria

1. WHEN processing Adulthood Events (419) THEN the system SHALL use 2d20 + SolMod for event determination
2. WHEN determining number of adult events THEN the system SHALL roll once for beginning characters, 1d3 times for older characters
3. WHEN events assign personality traits [L], [D], [N], or [R] THEN the system SHALL add them to appropriate categories
4. IF events create companions (saving someone's life) THEN the system SHALL generate them using table 753
5. WHEN occupation learning occurs THEN the system SHALL assign Rank 2 using culture-appropriate occupation tables (310-313)
6. WHEN Hi/Lo events occur THEN the system SHALL direct to Something Wonderful (625) or Tragedy (624) tables appropriately

### Requirement 7: Personality and Values Generation (500s Tables)

**User Story:** As a player, I want my character's personality traits, values, and moral alignment to be systematically determined through table results, so that I have clear roleplay guidance and character motivation.

#### Acceptance Criteria

1. WHEN generating values THEN the system SHALL determine most valued person, thing, and abstraction with strength ratings
2. WHEN rolling for personality traits THEN the system SHALL assign traits to Lightside, Neutral, or Darkside categories appropriately
3. WHEN exotic traits are gained THEN the system SHALL categorize them by type (Mental Affliction, Phobia, Allergy, Behavior Tag)
4. IF alignment determination is required THEN the system SHALL calculate based on trait distribution and specific table results
5. WHEN trait strength is determined THEN the system SHALL use the scale: Trivial, Weak, Average, Strong, Driving, Obsessive

### Requirement 8: Miscellaneous Events Processing (600s Tables)

**User Story:** As a player, I want to experience unusual, tragic, wonderful, and specialized events that add unique flavor and memorable moments to my character's background, so that my character has distinctive story elements.

#### Acceptance Criteria

1. WHEN Unusual Events (642) occur THEN the system SHALL process cosmic awakenings, mystical encounters, and supernatural experiences
2. WHEN Tragedy (624) strikes THEN the system SHALL handle complex subtable effects and long-term character impacts
3. WHEN Something Wonderful (625) happens THEN the system SHALL generate positive life-changing events with appropriate benefits
4. IF Religious Experience (639) occurs THEN the system SHALL determine faith changes, divine encounters, and spiritual development
5. WHEN Romantic Encounters (640) develop THEN the system SHALL create detailed relationship histories and ongoing connections
6. WHEN Patron relationships (641) form THEN the system SHALL establish service conditions, patron types, and mutual obligations
7. IF Death Situations (643) arise THEN the system SHALL process causes, responsibility, and character connections to deaths
8. WHEN Prison (638), Military (632), Slavery (637), or Underworld (631) experiences occur THEN the system SHALL handle specialized subtable progressions

### Requirement 9: Contacts and Relationships (700s Tables)

**User Story:** As a player, I want to generate NPCs, companions, and rivals with detailed backgrounds and relationships, so that my character has meaningful connections in the game world.

#### Acceptance Criteria

1. WHEN generating NPCs THEN the system SHALL create complete profiles with names, occupations, personalities, and relationship details
2. WHEN companions are created THEN the system SHALL generate them with full stat blocks and background details
3. WHEN rivals are established THEN the system SHALL define the nature of the conflict and relationship history
4. IF family members are detailed THEN the system SHALL track their occupations, relationships, and notable features
5. WHEN professional contacts are made THEN the system SHALL record their relevance to the character's occupation or interests

### Requirement 10: Special Events and Items (800s Tables)

**User Story:** As a player, I want to potentially receive special gifts, legacies, or experience unusual events that add unique elements to my character, so that my background has memorable and distinctive features.

#### Acceptance Criteria

1. WHEN gifts or legacies are received THEN the system SHALL determine item type, magical properties, and significance
2. WHEN unusual objects are found THEN the system SHALL provide detailed descriptions and potential mechanical benefits
3. IF property deeds are inherited THEN the system SHALL specify property type, location, and condition
4. WHEN magical or destined items are gained THEN the system SHALL mark them for special significance in gameplay
5. WHEN anachronistic devices appear THEN the system SHALL maintain their mysterious nature while providing gameplay hooks

### Requirement 11: D&D 3.5 Integration and Export

**User Story:** As a player, I want my generated background to translate into mechanical D&D 3.5 benefits including ability modifiers, skill bonuses, starting equipment, and character sheet integration, so that my background has gameplay impact.

#### Acceptance Criteria

1. WHEN background generation is complete THEN the system SHALL calculate appropriate ability score modifiers based on background events
2. WHEN skills are gained through background THEN the system SHALL convert them to D&D 3.5 skill bonuses with proper ranks
3. WHEN starting equipment is determined THEN the system SHALL list items with D&D 3.5 stats, values, and properties
4. IF bonus languages are learned THEN the system SHALL list them based on culture and education background
5. WHEN exporting character data THEN the system SHALL format it for standard D&D 3.5 character sheet compatibility

### Requirement 12: Generation Wizard and User Experience

**User Story:** As a player, I want a guided step-by-step interface that walks me through character generation with clear progress tracking and the ability to make manual choices or use random generation, so that the process is engaging and accessible.

#### Acceptance Criteria

1. WHEN starting character generation THEN the system SHALL provide a clear step-by-step wizard interface
2. WHEN at any table THEN the system SHALL offer both automatic rolling and manual selection options
3. WHEN generation is in progress THEN the system SHALL display current step, completed steps, and remaining phases
4. IF the user wants to backtrack THEN the system SHALL allow undoing recent decisions with state restoration
5. WHEN generation is complete THEN the system SHALL provide a comprehensive character summary with export options

## Non-Functional Requirements

### Code Architecture and Modularity
- **Single Responsibility Principle**: Each component handles one specific table category or UI concern
- **Modular Design**: Table definitions, character state, UI components, and business logic are cleanly separated
- **Dependency Management**: Clear interfaces between table engine, character state, and UI layers
- **Clear Interfaces**: Well-defined TypeScript interfaces for all data structures and component interactions

### Performance
- Table lookups and dice rolling operations SHALL complete within 100ms
- Character state updates SHALL be reflected in UI within 200ms
- Application SHALL support offline operation once tables are loaded
- Memory usage SHALL remain stable during extended generation sessions

### Security
- No user data SHALL be transmitted to external servers without explicit consent
- Local storage SHALL use appropriate data sanitization
- Export functionality SHALL validate data integrity before file creation

### Reliability
- Application SHALL handle invalid table references gracefully with clear error messages
- Character generation SHALL be resumable after browser refresh via localStorage
- Dice rolling SHALL use cryptographically secure random number generation
- All table cross-references SHALL be validated during application initialization

### Usability
- Interface SHALL be responsive and accessible on desktop and tablet devices
- Table results SHALL be clearly presented with context and implications
- Character sheet preview SHALL update in real-time during generation
- Help system SHALL provide guidance on table mechanics and character options