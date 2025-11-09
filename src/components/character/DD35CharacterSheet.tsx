// D&D 3.5 Character Sheet Component
// Provides a printable, traditional D&D 3.5 character sheet layout

import type { DDCharacterSheet } from '@/types/dnd'

interface DD35CharacterSheetProps {
  characterSheet: DDCharacterSheet
  className?: string
}

export function DD35CharacterSheet({ characterSheet, className = '' }: DD35CharacterSheetProps) {
  const getModifierDisplay = (modifier: number): string => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`
  }

  return (
    <div className={`dnd35-sheet bg-white ${className}`}>
      <style>{`
        .dnd35-sheet {
          width: 8.5in;
          min-height: 11in;
          margin: 0 auto;
          padding: 0.5in;
          font-family: 'Times New Roman', serif;
          font-size: 10pt;
          color: #000;
          background: white;
        }

        .dnd35-sheet * {
          box-sizing: border-box;
        }

        .sheet-header {
          border: 2px solid #000;
          padding: 8px;
          margin-bottom: 12px;
        }

        .header-row {
          display: flex;
          gap: 12px;
          margin-bottom: 6px;
        }

        .header-field {
          flex: 1;
          display: flex;
          align-items: baseline;
          border-bottom: 1px solid #000;
          padding: 2px 4px;
        }

        .header-label {
          font-size: 7pt;
          text-transform: uppercase;
          margin-right: 4px;
          font-weight: bold;
        }

        .header-value {
          flex: 1;
          font-size: 11pt;
          font-weight: bold;
        }

        .ability-scores {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }

        .ability-box {
          border: 2px solid #000;
          text-align: center;
          padding: 4px;
        }

        .ability-name {
          font-size: 8pt;
          font-weight: bold;
          text-transform: uppercase;
          border-bottom: 1px solid #000;
          padding-bottom: 2px;
          margin-bottom: 4px;
        }

        .ability-score {
          font-size: 18pt;
          font-weight: bold;
          margin: 4px 0;
        }

        .ability-modifier {
          font-size: 14pt;
          font-weight: bold;
          background: #f0f0f0;
          padding: 4px;
          margin-top: 4px;
        }

        .combat-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }

        .stat-box {
          border: 2px solid #000;
          padding: 6px;
          text-align: center;
        }

        .stat-label {
          font-size: 7pt;
          text-transform: uppercase;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 16pt;
          font-weight: bold;
        }

        .saves-section {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }

        .save-box {
          border: 2px solid #000;
          padding: 8px;
        }

        .save-name {
          font-size: 9pt;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .save-total {
          font-size: 20pt;
          font-weight: bold;
          text-align: center;
          background: #f0f0f0;
          padding: 4px;
          margin-bottom: 4px;
        }

        .save-breakdown {
          font-size: 7pt;
          display: flex;
          justify-content: space-between;
        }

        .skills-section {
          border: 2px solid #000;
          margin-bottom: 12px;
        }

        .skills-header {
          background: #000;
          color: #fff;
          padding: 4px 8px;
          font-size: 9pt;
          font-weight: bold;
          text-transform: uppercase;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }

        .skill-row {
          display: flex;
          align-items: center;
          padding: 3px 6px;
          border-bottom: 1px solid #ccc;
          font-size: 8pt;
        }

        .skill-row:nth-child(even) {
          background: #f9f9f9;
        }

        .skill-check {
          width: 12px;
          height: 12px;
          border: 1px solid #000;
          margin-right: 6px;
          flex-shrink: 0;
        }

        .skill-check.class-skill {
          background: #000;
        }

        .skill-name {
          flex: 1;
        }

        .skill-total {
          width: 30px;
          text-align: center;
          font-weight: bold;
          border: 1px solid #000;
          padding: 2px;
          margin-right: 4px;
        }

        .skill-ranks {
          width: 24px;
          text-align: center;
          border-bottom: 1px solid #000;
          margin-right: 4px;
        }

        .equipment-section {
          border: 2px solid #000;
          margin-bottom: 12px;
        }

        .equipment-header {
          background: #000;
          color: #fff;
          padding: 4px 8px;
          font-size: 9pt;
          font-weight: bold;
          text-transform: uppercase;
        }

        .equipment-list {
          padding: 8px;
          min-height: 100px;
        }

        .equipment-item {
          padding: 2px 0;
          font-size: 9pt;
          border-bottom: 1px solid #eee;
        }

        .features-section {
          border: 2px solid #000;
          margin-bottom: 12px;
        }

        .features-content {
          padding: 8px;
          font-size: 9pt;
          line-height: 1.4;
        }

        .feature-item {
          margin-bottom: 6px;
          padding-bottom: 6px;
          border-bottom: 1px solid #eee;
        }

        .feature-name {
          font-weight: bold;
          margin-bottom: 2px;
        }

        @media print {
          .dnd35-sheet {
            width: 100%;
            padding: 0.25in;
            page-break-after: always;
          }

          body {
            background: white;
          }
        }
      `}</style>

      {/* Header Section */}
      <div className="sheet-header">
        <div className="header-row">
          <div className="header-field" style={{ flex: 3 }}>
            <span className="header-label">Character Name:</span>
            <span className="header-value">{characterSheet.characterName}</span>
          </div>
          <div className="header-field" style={{ flex: 1 }}>
            <span className="header-label">Player:</span>
            <span className="header-value">{characterSheet.playerName || ''}</span>
          </div>
        </div>
        <div className="header-row">
          <div className="header-field">
            <span className="header-label">Class:</span>
            <span className="header-value">
              {characterSheet.classes.map(c => `${c.name} ${c.level}`).join(' / ')}
            </span>
          </div>
          <div className="header-field">
            <span className="header-label">Race:</span>
            <span className="header-value">{characterSheet.race}</span>
          </div>
          <div className="header-field">
            <span className="header-label">Alignment:</span>
            <span className="header-value">{characterSheet.alignment}</span>
          </div>
          <div className="header-field">
            <span className="header-label">Level:</span>
            <span className="header-value">{characterSheet.level}</span>
          </div>
        </div>
        <div className="header-row">
          <div className="header-field">
            <span className="header-label">Deity:</span>
            <span className="header-value">{characterSheet.deity || 'None'}</span>
          </div>
          <div className="header-field">
            <span className="header-label">Size:</span>
            <span className="header-value">{characterSheet.size || 'Medium'}</span>
          </div>
          <div className="header-field">
            <span className="header-label">Age:</span>
            <span className="header-value">{characterSheet.age}</span>
          </div>
          <div className="header-field">
            <span className="header-label">Gender:</span>
            <span className="header-value">{characterSheet.gender || ''}</span>
          </div>
        </div>
      </div>

      {/* Ability Scores */}
      <div className="ability-scores">
        {Object.entries(characterSheet.abilities).map(([ability, data]) => (
          <div key={ability} className="ability-box">
            <div className="ability-name">{ability.slice(0, 3)}</div>
            <div className="ability-score">{data.score}</div>
            <div className="ability-modifier">{getModifierDisplay(data.modifier)}</div>
          </div>
        ))}
      </div>

      {/* Combat Stats */}
      <div className="combat-stats">
        <div className="stat-box">
          <div className="stat-label">HP</div>
          <div className="stat-value">{characterSheet.hitPoints}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">AC</div>
          <div className="stat-value">{characterSheet.armorClass}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Touch</div>
          <div className="stat-value">{characterSheet.touch}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Flat-Footed</div>
          <div className="stat-value">{characterSheet.flatFooted}</div>
        </div>
      </div>

      <div className="combat-stats">
        <div className="stat-box">
          <div className="stat-label">Initiative</div>
          <div className="stat-value">{getModifierDisplay(characterSheet.initiative)}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Speed</div>
          <div className="stat-value">{characterSheet.speed} ft</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">BAB</div>
          <div className="stat-value">
            {getModifierDisplay(characterSheet.classes[0]?.baseAttackBonus[0] || 0)}
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Grapple</div>
          <div className="stat-value">
            {getModifierDisplay((characterSheet.classes[0]?.baseAttackBonus[0] || 0) +
              characterSheet.abilities.strength.modifier)}
          </div>
        </div>
      </div>

      {/* Saving Throws */}
      <div className="saves-section">
        {Object.entries(characterSheet.saves).map(([save, data]) => (
          <div key={save} className="save-box">
            <div className="save-name">{save}</div>
            <div className="save-total">{getModifierDisplay(data.total)}</div>
            <div className="save-breakdown">
              <span>Base: {getModifierDisplay(data.base)}</span>
              <span>Ability: {getModifierDisplay(data.abilityModifier)}</span>
              <span>Misc: {getModifierDisplay(data.miscModifier)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="skills-section">
        <div className="skills-header">Skills</div>
        <div className="skills-grid">
          {characterSheet.skills.map((skill, index) => (
            <div key={index} className="skill-row">
              <div className={`skill-check ${skill.classSkill ? 'class-skill' : ''}`}></div>
              <div className="skill-name">{skill.name}</div>
              <div className="skill-total">{getModifierDisplay(skill.total)}</div>
              <div className="skill-ranks">{skill.ranks}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feats & Special Abilities */}
      <div className="features-section">
        <div className="equipment-header">Feats & Special Abilities</div>
        <div className="features-content">
          {characterSheet.feats.length > 0 && (
            <div className="feature-item">
              <div className="feature-name">Feats:</div>
              <div>{characterSheet.feats.join(', ')}</div>
            </div>
          )}
          {characterSheet.classFeatures.length > 0 && (
            <div className="feature-item">
              <div className="feature-name">Class Features:</div>
              <div>{characterSheet.classFeatures.join(', ')}</div>
            </div>
          )}
          {characterSheet.racialTraits.length > 0 && (
            <div className="feature-item">
              <div className="feature-name">Racial Traits:</div>
              <div>{characterSheet.racialTraits.join(', ')}</div>
            </div>
          )}
        </div>
      </div>

      {/* Equipment */}
      <div className="equipment-section">
        <div className="equipment-header">
          Equipment & Possessions
          <span style={{ float: 'right', fontWeight: 'normal' }}>
            {characterSheet.money.platinum}pp {characterSheet.money.gold}gp{' '}
            {characterSheet.money.silver}sp {characterSheet.money.copper}cp
          </span>
        </div>
        <div className="equipment-list">
          {characterSheet.equipment.length > 0 ? (
            characterSheet.equipment.map((item, index) => (
              <div key={index} className="equipment-item">
                {item.name}
                {item.magical && ' (magical)'}
                {item.enhancement && ` +${item.enhancement}`}
              </div>
            ))
          ) : (
            <div className="equipment-item">No equipment listed</div>
          )}
        </div>
      </div>

      {/* Background & Personality */}
      <div className="features-section">
        <div className="equipment-header">Background & Personality</div>
        <div className="features-content">
          {characterSheet.background && (
            <div className="feature-item">
              <div className="feature-name">Background:</div>
              <div>{characterSheet.background}</div>
            </div>
          )}
          {characterSheet.personality && (
            <div className="feature-item">
              <div className="feature-name">Personality:</div>
              <div>{characterSheet.personality}</div>
            </div>
          )}
          {characterSheet.goals && (
            <div className="feature-item">
              <div className="feature-name">Goals:</div>
              <div>{characterSheet.goals}</div>
            </div>
          )}
        </div>
      </div>

      {/* Backstory */}
      {characterSheet.backstory && (
        <div className="features-section">
          <div className="equipment-header">Character History</div>
          <div className="features-content">
            {characterSheet.backstory}
          </div>
        </div>
      )}
    </div>
  )
}
