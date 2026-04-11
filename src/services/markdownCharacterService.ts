// Markdown Character Service - Generates and manages character markdown files
// Creates persistent, readable character files that update as generation progresses

import type { Character } from '../types/character'
import { formatDate } from '../utils/dateHelpers'

export class MarkdownCharacterService {
  private static instance: MarkdownCharacterService
  
  public static getInstance(): MarkdownCharacterService {
    if (!MarkdownCharacterService.instance) {
      MarkdownCharacterService.instance = new MarkdownCharacterService()
    }
    return MarkdownCharacterService.instance
  }

  /**
   * Generate complete markdown representation of character
   */
  public generateCharacterMarkdown(character: Character): string {
    const sections = [
      this.generateHeader(character),
      this.generateAbilityScores(character),
      this.generateHeritage(character),
      this.generateYouthEvents(character),
      this.generateOccupations(character),
      this.generateAdulthood(character),
      this.generatePersonality(character),
      this.generateSkills(character),
      this.generateRelationships(character),
      this.generateSpecialItems(character),
      this.generateFooter(character)
    ]

    return sections.filter(section => section.trim()).join('\n\n')
  }

  /**
   * Generate character header with basic info
   */
  private generateHeader(character: Character): string {
    const lastModified = character.lastModified ? formatDate(character.lastModified) : 'In Progress'
    const completedAt = character.completedAt ? formatDate(character.completedAt) : null
    
    return `# ${character.name || 'Unnamed Character'}
    
**Character ID:** ${character.id}  
**Age:** ${character.age} years  
**Level:** ${character.level || 1}  
**Status:** ${character.isFinalized ? 'Complete' : 'In Progress'}  
**Last Modified:** ${lastModified}  
${completedAt ? `**Completed:** ${completedAt}  ` : ''}

---`
  }

  /**
   * Generate ability scores section
   */
  private generateAbilityScores(character: Character): string {
    if (!character.strength && !character.dexterity && !character.constitution && 
        !character.intelligence && !character.wisdom && !character.charisma) {
      return `## 📊 Ability Scores

*Ability scores not yet rolled*`
    }

    const formatAbility = (name: string, value: number | undefined, racialMod: number = 0) => {
      if (!value) return `**${name}:** Not rolled`
      const total = value + racialMod
      const modifier = Math.floor((total - 10) / 2)
      const modText = `${modifier >= 0 ? '+' : ''}${modifier}`
      
      if (racialMod !== 0) {
        const racialText = `${racialMod >= 0 ? '+' : ''}${racialMod}`
        return `**${name}:** ${total} (${modText}) [${value}${racialText} racial]`
      }
      return `**${name}:** ${total} (${modText})`
    }

    const getRacialMod = (ability: string) => {
      if (!character.race?.modifiers) return 0
      const modMap: Record<string, string> = {
        'Strength': 'str', 'Dexterity': 'dex', 'Constitution': 'con',
        'Intelligence': 'int', 'Wisdom': 'wis', 'Charisma': 'cha'
      }
      return (character.race.modifiers[modMap[ability]] as number) || 0
    }

    return `## 📊 Ability Scores

${formatAbility('Strength', character.strength, getRacialMod('Strength'))}  
${formatAbility('Dexterity', character.dexterity, getRacialMod('Dexterity'))}  
${formatAbility('Constitution', character.constitution, getRacialMod('Constitution'))}  
${formatAbility('Intelligence', character.intelligence, getRacialMod('Intelligence'))}  
${formatAbility('Wisdom', character.wisdom, getRacialMod('Wisdom'))}  
${formatAbility('Charisma', character.charisma, getRacialMod('Charisma'))}`
  }

  /**
   * Generate heritage section
   */
  private generateHeritage(character: Character): string {
    const race = character.race?.name || '*Not determined*'
    const culture = character.culture?.name || '*Not determined*'
    const socialStatus = character.socialStatus?.level || '*Not determined*'
    const birthCircumstances = character.birthCircumstances?.legitimacy || '*Not determined*'

    let section = `## 🏰 Heritage & Birth

**Race:** ${race}  
**Culture:** ${culture}  
**Social Status:** ${socialStatus}  
**Birth Circumstances:** ${birthCircumstances}`

    // Add racial abilities if available
    if (character.race?.abilities?.length) {
      section += `\n\n**Racial Abilities:**  \n${character.race.abilities.map(ability => `- ${ability}`).join('\n')}`
    }

    return section
  }

  /**
   * Generate youth events section
   */
  private generateYouthEvents(character: Character): string {
    if (!character.youthEvents?.length) {
      return `## 🌱 Youth Development

*Youth events not yet generated*`
    }

    const childhood = character.youthEvents.filter(e => e.period === 'Childhood')
    const adolescence = character.youthEvents.filter(e => e.period === 'Adolescence')

    let section = `## 🌱 Youth Development`

    if (childhood.length) {
      section += `\n\n### Childhood (Ages 1-12)\n${childhood.map(event => `- **${event.name}**: ${event.description || event.result}`).join('\n')}`
    }

    if (adolescence.length) {
      section += `\n\n### Adolescence (Ages 13-18)\n${adolescence.map(event => `- **${event.name}**: ${event.description || event.result}`).join('\n')}`
    }

    return section
  }

  /**
   * Generate occupations section
   */
  private generateOccupations(character: Character): string {
    if (!character.occupations?.length && !character.apprenticeships?.length) {
      return `## ⚔️ Professional Training

*Professional training not yet determined*`
    }

    let section = `## ⚔️ Professional Training`

    if (character.apprenticeships?.length) {
      section += `\n\n**Apprenticeships:**  \n${character.apprenticeships.map(app => `- ${app.name}: ${app.description}`).join('\n')}`
    }

    if (character.occupations?.length) {
      section += `\n\n**Occupations:**  \n${character.occupations.map(occ => `- ${occ.result || occ.name}`).join('\n')}`
    }

    return section
  }

  /**
   * Generate adulthood section
   */
  private generateAdulthood(character: Character): string {
    if (!character.adulthoodEvents?.length) {
      return `## 🎭 Adult Life Events

*Adult life events not yet generated*`
    }

    return `## 🎭 Adult Life Events

${character.adulthoodEvents.map(event => `- **${event.name}**: ${event.description || event.result}`).join('\n')}`
  }

  /**
   * Generate personality section
   */
  private generatePersonality(character: Character): string {
    let section = `## 💭 Personality & Values`

    // Core Values
    if (character.values?.mostValuedPerson || character.values?.mostValuedThing) {
      section += `\n\n**Core Values:**  `
      if (character.values.mostValuedPerson) section += `\n- Most valued person: ${character.values.mostValuedPerson}`
      if (character.values.mostValuedThing) section += `\n- Most valued thing: ${character.values.mostValuedThing}`
      if (character.values.mostValuedAbstraction) section += `\n- Most valued ideal: ${character.values.mostValuedAbstraction}`
    }

    // Personality Traits
    const traits = character.personalityTraits
    if (traits?.lightside?.length || traits?.neutral?.length || traits?.darkside?.length || traits?.exotic?.length) {
      section += `\n\n**Personality Traits:**`
      
      if (traits.lightside?.length) {
        section += `\n- *Lightside:* ${traits.lightside.map(t => t.name).join(', ')}`
      }
      if (traits.neutral?.length) {
        section += `\n- *Neutral:* ${traits.neutral.map(t => t.name).join(', ')}`
      }
      if (traits.darkside?.length) {
        section += `\n- *Darkside:* ${traits.darkside.map(t => t.name).join(', ')}`
      }
      if (traits.exotic?.length) {
        section += `\n- *Exotic:* ${traits.exotic.map(t => t.name).join(', ')}`
      }
    }

    // Alignment
    if (character.alignment?.primary) {
      section += `\n\n**Alignment:** ${character.alignment.primary}`
    }

    if (section === `## 💭 Personality & Values`) {
      section += `\n\n*Personality development not yet complete*`
    }

    return section
  }

  /**
   * Generate skills section
   */
  private generateSkills(character: Character): string {
    if (!character.skills || Object.keys(character.skills).length === 0) {
      return `## 🎯 Skills

*No skills acquired yet*`
    }

    const skillEntries = Object.entries(character.skills)
      .filter(([_, skillData]) => skillData.rank > 0)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([skillName, skillData]) => {
        const specialty = skillData.specialty ? ` (${skillData.specialty})` : ''
        return `- **${skillName}${specialty}:** ${skillData.rank} ranks`
      })

    if (skillEntries.length === 0) {
      return `## 🎯 Skills

*No skills acquired yet*`
    }

    return `## 🎯 Skills

${skillEntries.join('\n')}`
  }

  /**
   * Generate relationships section
   */
  private generateRelationships(character: Character): string {
    const hasRelationships = character.npcs?.length || character.companions?.length || 
                           character.rivals?.length || character.relationships?.length

    if (!hasRelationships) {
      return `## 👥 Relationships

*No relationships established yet*`
    }

    let section = `## 👥 Relationships`

    if (character.npcs?.length) {
      section += `\n\n**NPCs:**  \n${character.npcs.map(npc => `- ${npc.name}: ${npc.relationship}`).join('\n')}`
    }

    if (character.companions?.length) {
      section += `\n\n**Companions:**  \n${character.companions.map(comp => `- ${comp.name} (Loyalty: ${comp.loyalty})`).join('\n')}`
    }

    if (character.rivals?.length) {
      section += `\n\n**Rivals:**  \n${character.rivals.map(rival => `- ${rival.name}: ${rival.reason}`).join('\n')}`
    }

    return section
  }

  /**
   * Generate special items section
   */
  private generateSpecialItems(character: Character): string {
    const hasItems = character.gifts?.length || character.legacies?.length || character.specialItems?.length

    if (!hasItems) {
      return `## 💎 Special Items

*No special items acquired*`
    }

    let section = `## 💎 Special Items`

    if (character.gifts?.length) {
      section += `\n\n**Gifts:**  \n${character.gifts.map(gift => `- ${gift.name}: ${gift.description}`).join('\n')}`
    }

    if (character.legacies?.length) {
      section += `\n\n**Legacies:**  \n${character.legacies.map(legacy => `- ${legacy.name}: ${legacy.description}`).join('\n')}`
    }

    if (character.specialItems?.length) {
      section += `\n\n**Special Items:**  \n${character.specialItems.map(item => `- ${item.name}: ${item.description}`).join('\n')}`
    }

    return section
  }

  /**
   * Generate footer with metadata
   */
  private generateFooter(character: Character): string {
    return `---

*Generated by PanCasting D&D Character Generator*  
*Character ID: ${character.id}*  
*${character.isFinalized ? 'Final' : 'Draft'} version created ${character.lastModified ? formatDate(character.lastModified) : 'recently'}*`
  }

  /**
   * Save character markdown to file (browser download)
   */
  public downloadCharacterMarkdown(character: Character): void {
    const markdown = this.generateCharacterMarkdown(character)
    const filename = `${character.name || 'character'}.md`.replace(/[^a-z0-9.-]/gi, '_')
    
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    
    URL.revokeObjectURL(url)
  }

  /**
   * Get character markdown as string for display
   */
  public getCharacterMarkdown(character: Character): string {
    return this.generateCharacterMarkdown(character)
  }
}

// Export singleton instance
export const markdownCharacterService = MarkdownCharacterService.getInstance()