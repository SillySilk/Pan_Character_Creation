// D&D 3.5 SRD Feats — sourced from C:\AI\D&D\03-skills-feats.md
// Do NOT modify ability scores, prerequisites, or benefits without re-checking the SRD.

export type FeatType = 'General' | 'Fighter' | 'ItemCreation' | 'Metamagic' | 'Special'

export interface FeatPrerequisite {
  type: 'ability' | 'feat' | 'bab' | 'casterLevel' | 'classLevel' | 'skill' | 'special'
  name?: string        // ability name, feat name, skill name, etc.
  value?: number       // minimum score/ranks/level/BAB
  description?: string // free-form for special prereqs
}

export interface FeatSkillBonus {
  skill: string
  bonus: number
}

export interface DnDFeat {
  id: string
  name: string
  type: FeatType
  /** Whether this feat can be selected as a Fighter bonus feat */
  isFighterBonus: boolean
  /** Whether this feat can be taken multiple times */
  stackable: boolean
  prerequisites: FeatPrerequisite[]
  benefit: string
  normal?: string
  special?: string
  /** Skill bonuses granted by this feat (e.g. Acrobatic: +2 Jump, +2 Tumble) */
  skillBonuses?: FeatSkillBonus[]
}

export const DND_FEATS: DnDFeat[] = [
  // ── A ──────────────────────────────────────────────────────────────────────
  {
    id: 'acrobatic',
    name: 'Acrobatic',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on all Jump checks and Tumble checks.',
    skillBonuses: [
      { skill: 'Jump', bonus: 2 },
      { skill: 'Tumble', bonus: 2 },
    ],
  },
  {
    id: 'agile',
    name: 'Agile',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on all Balance checks and Escape Artist checks.',
    skillBonuses: [
      { skill: 'Balance', bonus: 2 },
      { skill: 'Escape Artist', bonus: 2 },
    ],
  },
  {
    id: 'alertness',
    name: 'Alertness',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on all Listen checks and Spot checks.',
    skillBonuses: [
      { skill: 'Listen', bonus: 2 },
      { skill: 'Spot', bonus: 2 },
    ],
  },
  {
    id: 'animal_affinity',
    name: 'Animal Affinity',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on all Handle Animal checks and Ride checks.',
    skillBonuses: [
      { skill: 'Handle Animal', bonus: 2 },
      { skill: 'Ride', bonus: 2 },
    ],
  },
  {
    id: 'armor_prof_heavy',
    name: 'Armor Proficiency (Heavy)',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [
      { type: 'feat', name: 'Armor Proficiency (Medium)' },
    ],
    benefit: 'You can wear heavy armor without the normal armor penalties to attack rolls and speed.',
    special: 'Fighters, paladins, and clerics automatically have this feat as a bonus feat.',
  },
  {
    id: 'armor_prof_light',
    name: 'Armor Proficiency (Light)',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You can wear light armor without the normal armor penalties to attack rolls and speed.',
    special: 'All characters except wizards, sorcerers, and monks are automatically proficient.',
  },
  {
    id: 'armor_prof_medium',
    name: 'Armor Proficiency (Medium)',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [
      { type: 'feat', name: 'Armor Proficiency (Light)' },
    ],
    benefit: 'You can wear medium armor without the normal armor penalties to attack rolls and speed.',
    special: 'Fighters, paladins, clerics, druids, barbarians, bards, and rangers are automatically proficient.',
  },
  {
    id: 'athletic',
    name: 'Athletic',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on all Climb checks and Swim checks.',
    skillBonuses: [
      { skill: 'Climb', bonus: 2 },
      { skill: 'Swim', bonus: 2 },
    ],
  },
  {
    id: 'augment_summoning',
    name: 'Augment Summoning',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [
      { type: 'feat', name: 'Spell Focus (Conjuration)' },
    ],
    benefit: 'Each creature you conjure with any summon spell gains a +4 enhancement bonus to Strength and Constitution for the duration of the spell that summoned it.',
  },

  // ── B ──────────────────────────────────────────────────────────────────────
  {
    id: 'blind_fight',
    name: 'Blind-Fight',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [],
    benefit: 'In melee, every time you miss because of concealment, you can reroll your miss chance percentile roll once to see if you actually hit. An invisible attacker gets no advantages related to hitting you in melee. You still lose your Dexterity bonus to AC against the attack. Do not need to make Spot checks to notice invisible creatures within 30 feet. Once a round, you may move at full speed while blinded without making a Balance or Tumble check.',
    normal: 'Regular attack and movement rules apply to concealed and invisible targets.',
  },
  {
    id: 'brew_potion',
    name: 'Brew Potion',
    type: 'ItemCreation',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [
      { type: 'casterLevel', value: 3 },
    ],
    benefit: 'You can create a potion of any 3rd-level or lower spell that you know and that targets one or more creatures. Brewing a potion takes one day. When you create a potion, you set the caster level, which must be sufficient to cast the spell in question and no higher than your own level. The base price of a potion is its spell level × its caster level × 50 gp. To brew a potion, you must spend 1/25 of this base price in XP and use up raw materials costing one-half this base price.',
  },

  // ── C ──────────────────────────────────────────────────────────────────────
  {
    id: 'cleave',
    name: 'Cleave',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Strength', value: 13 },
      { type: 'feat', name: 'Power Attack' },
    ],
    benefit: 'If you deal a creature enough damage to make it drop (typically by dropping it to below 0 hit points or killing it), you get an immediate, extra melee attack against another creature within reach. You cannot take a 5-foot step before making this extra attack. The extra attack is with the same weapon and at the same bonus as the attack that dropped the previous creature. You can use this ability once per round.',
    special: 'A fighter may select Cleave as one of his fighter bonus feats.',
  },
  {
    id: 'combat_casting',
    name: 'Combat Casting',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +4 bonus on Concentration checks made to cast a spell or use a spell-like ability while on the defensive or while you are grappling or pinned.',
  },
  {
    id: 'combat_expertise',
    name: 'Combat Expertise',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Intelligence', value: 13 },
    ],
    benefit: 'When you use the attack action or the full attack action in melee, you can take a penalty of as much as -5 on your attack roll and add the same number (+5 or less) as a dodge bonus to your Armor Class. This number may not exceed your base attack bonus. The changes to attack rolls and Armor Class last until your next action.',
    normal: 'A character without the Combat Expertise feat can fight defensively while using the attack or full attack action to take a -4 penalty on attack rolls and gain a +2 dodge bonus to Armor Class.',
    special: 'A fighter may select Combat Expertise as one of his fighter bonus feats.',
  },
  {
    id: 'combat_reflexes',
    name: 'Combat Reflexes',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [],
    benefit: 'You may make a number of additional attacks of opportunity per round equal to your Dexterity bonus. With this feat, you may also make attacks of opportunity while flat-footed.',
    normal: 'A character without this feat can make only one attack of opportunity per round and cannot make attacks of opportunity while flat-footed.',
    special: 'A fighter may select Combat Reflexes as one of his fighter bonus feats.',
  },
  {
    id: 'craft_magic_arms_armor',
    name: 'Craft Magic Arms and Armor',
    type: 'ItemCreation',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [
      { type: 'casterLevel', value: 5 },
    ],
    benefit: 'You can create magic weapons, armor, or shields. Enhancing a weapon, suit of armor, or shield takes one day for each 1,000 gp in the price of its magical features. To enhance a weapon, you must spend 1/25 of its features\' total price in XP and use up raw materials costing one-half of this total price.',
  },
  {
    id: 'craft_rod',
    name: 'Craft Rod',
    type: 'ItemCreation',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [
      { type: 'casterLevel', value: 9 },
    ],
    benefit: 'You can create magic rods. Crafting a rod takes one day for each 1,000 gp in its base price. To craft a rod, you must spend 1/25 of its base price in XP and use up raw materials costing one-half of its base price.',
  },
  {
    id: 'craft_staff',
    name: 'Craft Staff',
    type: 'ItemCreation',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [
      { type: 'casterLevel', value: 12 },
    ],
    benefit: 'You can create magic staves. Crafting a staff takes one day for each 1,000 gp in its base price. To craft a staff, you must spend 1/25 of its base price in XP and use up raw materials costing one-half of its base price.',
  },
  {
    id: 'craft_wand',
    name: 'Craft Wand',
    type: 'ItemCreation',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [
      { type: 'casterLevel', value: 5 },
    ],
    benefit: 'You can create magic wands. Crafting a wand takes one day for each 1,000 gp in its base price. To craft a wand, you must spend 1/25 of its base price in XP and use up raw materials costing one-half of its base price.',
  },
  {
    id: 'craft_wondrous_item',
    name: 'Craft Wondrous Item',
    type: 'ItemCreation',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [
      { type: 'casterLevel', value: 3 },
    ],
    benefit: 'You can create a wondrous item. Crafting a wondrous item takes one day for each 1,000 gp in its base price. To craft a wondrous item, you must spend 1/25 of its base price in XP and use up raw materials costing one-half of its base price.',
  },

  // ── D ──────────────────────────────────────────────────────────────────────
  {
    id: 'deceitful',
    name: 'Deceitful',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on all Disguise checks and Forgery checks.',
    skillBonuses: [
      { skill: 'Disguise', bonus: 2 },
      { skill: 'Forgery', bonus: 2 },
    ],
  },
  {
    id: 'deflect_arrows',
    name: 'Deflect Arrows',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Dexterity', value: 13 },
      { type: 'feat', name: 'Improved Unarmed Strike' },
    ],
    benefit: 'You must have at least one hand free (holding nothing) to use this feat. Once per round when you would normally be hit with a ranged weapon, you may deflect it so that you take no damage from it. You must be aware of the attack and not flat-footed. Attempting to deflect a ranged weapon doesn\'t count as an action. Exceptional ranged weapons, such as boulders hurled by giants or ranged touch attacks, can\'t be deflected.',
    special: 'A fighter may select Deflect Arrows as one of his fighter bonus feats. A monk may select Deflect Arrows as a bonus feat at 2nd level, even if she does not have the prerequisites.',
  },
  {
    id: 'deft_hands',
    name: 'Deft Hands',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on all Sleight of Hand checks and Use Rope checks.',
    skillBonuses: [
      { skill: 'Sleight of Hand', bonus: 2 },
      { skill: 'Use Rope', bonus: 2 },
    ],
  },
  {
    id: 'diehard',
    name: 'Diehard',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [
      { type: 'feat', name: 'Endurance' },
    ],
    benefit: 'When reduced to between -1 and -9 hit points, you automatically become stable. You don\'t have to roll d% to see if you lose 1 hit point each round. When reduced to negative hit points, you may choose to act as if you were disabled, rather than dying. You must make this decision as soon as you are reduced to negative hit points (even if it isn\'t your turn). If you do not choose to act as if you were disabled, you immediately fall unconscious.',
    special: 'When using this feat, you can take either a single move or standard action each turn, but not both, and you cannot take a full round action. You can take a move action without further injuring yourself, but if you perform any standard action (or any other strenuous action) you take 1 point of damage after completing the act.',
  },
  {
    id: 'diligent',
    name: 'Diligent',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on all Appraise checks and Decipher Script checks.',
    skillBonuses: [
      { skill: 'Appraise', bonus: 2 },
      { skill: 'Decipher Script', bonus: 2 },
    ],
  },
  {
    id: 'dodge',
    name: 'Dodge',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Dexterity', value: 13 },
    ],
    benefit: 'During your action, you designate an opponent and receive a +1 dodge bonus to Armor Class against attacks from that opponent. You can select a new opponent on any action. A condition that makes you lose your Dexterity bonus to Armor Class (if any) also makes you lose dodge bonuses. Also, dodge bonuses stack with each other, unlike most other types of bonuses.',
    special: 'A fighter may select Dodge as one of his fighter bonus feats.',
  },

  // ── E ──────────────────────────────────────────────────────────────────────
  {
    id: 'empower_spell',
    name: 'Empower Spell',
    type: 'Metamagic',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'All variable, numeric effects of an empowered spell are increased by one-half. Saving throws and opposed rolls are not affected, nor are spells without random variables. An empowered spell uses up a spell slot two levels higher than the spell\'s actual level.',
  },
  {
    id: 'endurance',
    name: 'Endurance',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You gain a +4 bonus on the following checks and saves: Swim checks made to resist nonlethal damage, Constitution checks made to continue running, Constitution checks made to avoid nonlethal damage from a forced march, Constitution checks made to hold your breath, Constitution checks made to avoid nonlethal damage from starvation or thirst, Fortitude saves made to avoid nonlethal damage from hot or cold environments, and Fortitude saves made to resist damage from suffocation. Also, you may sleep in light or medium armor without becoming fatigued.',
    normal: 'A character without this feat who sleeps in medium or heavier armor is automatically fatigued the next day.',
  },
  {
    id: 'enlarge_spell',
    name: 'Enlarge Spell',
    type: 'Metamagic',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You can alter a spell with a range of close, medium, or long to increase its range by 100%. An enlarged spell with a range of close now has a range of 50 ft. + 5 ft./level, while medium-range spells have a range of 200 ft. + 20 ft./level and long-range spells have a range of 800 ft. + 80 ft./level. An enlarged spell uses up a spell slot one level higher than the spell\'s actual level. Spells whose ranges are not defined by distance, as well as spells whose ranges are not close, medium, or long, do not benefit from this feat.',
  },
  {
    id: 'eschew_materials',
    name: 'Eschew Materials',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You can cast any spell that has a material component costing 1 gp or less without needing that component. The casting of the spell still provokes attacks of opportunity as normal. If the spell requires a material component that costs more than 1 gp, you must have the material component on hand to cast the spell, as normal.',
  },
  {
    id: 'exotic_weapon_prof',
    name: 'Exotic Weapon Proficiency',
    type: 'General',
    isFighterBonus: true,
    stackable: true,
    prerequisites: [
      { type: 'bab', value: 1 },
    ],
    benefit: 'Choose a type of exotic weapon. You understand how to use that type of exotic weapon in combat, and can use it without the -4 nonproficiency penalty.',
    normal: 'A character who uses a weapon with which he or she is not proficient takes a -4 penalty on attack rolls.',
    special: 'You can gain Exotic Weapon Proficiency multiple times. Each time you take the feat, it applies to a new type of exotic weapon. A fighter may select Exotic Weapon Proficiency as one of his fighter bonus feats.',
  },
  {
    id: 'extend_spell',
    name: 'Extend Spell',
    type: 'Metamagic',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'An extended spell lasts twice as long as normal. A spell with a duration of concentration, instantaneous, or permanent is not affected by this feat. An extended spell uses up a spell slot one level higher than the spell\'s actual level.',
  },
  {
    id: 'extra_turning',
    name: 'Extra Turning',
    type: 'General',
    isFighterBonus: false,
    stackable: true,
    prerequisites: [
      { type: 'special', description: 'Ability to turn or rebuke undead' },
    ],
    benefit: 'Each time you take this feat, you can use your ability to turn or rebuke creatures four more times per day than normal.',
    normal: 'Without this feat, a character can typically turn or rebuke undead (or other creatures) a number of times per day equal to 3 + Charisma modifier.',
    special: 'You can gain Extra Turning multiple times. Its effects stack.',
  },

  // ── F ──────────────────────────────────────────────────────────────────────
  {
    id: 'far_shot',
    name: 'Far Shot',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'feat', name: 'Point Blank Shot' },
    ],
    benefit: 'When you use a projectile weapon, such as a bow, its range increment increases by one-half (multiply by 1-1/2). When you use a thrown weapon, its range increment is doubled.',
    special: 'A fighter may select Far Shot as one of his fighter bonus feats.',
  },
  {
    id: 'forge_ring',
    name: 'Forge Ring',
    type: 'ItemCreation',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [
      { type: 'casterLevel', value: 12 },
    ],
    benefit: 'You can create magic rings. Crafting a ring takes one day for each 1,000 gp in its base price. To forge a ring, you must spend 1/25 of its base price in XP and use up raw materials costing one-half of its base price.',
  },

  // ── G ──────────────────────────────────────────────────────────────────────
  {
    id: 'great_cleave',
    name: 'Great Cleave',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Strength', value: 13 },
      { type: 'feat', name: 'Cleave' },
      { type: 'feat', name: 'Power Attack' },
      { type: 'bab', value: 4 },
    ],
    benefit: 'This feat works like Cleave, except that there is no limit to the number of times you can use it per round.',
    special: 'A fighter may select Great Cleave as one of his fighter bonus feats.',
  },
  {
    id: 'great_fortitude',
    name: 'Great Fortitude',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on all Fortitude saving throws.',
  },
  {
    id: 'greater_spell_focus',
    name: 'Greater Spell Focus',
    type: 'General',
    isFighterBonus: false,
    stackable: true,
    prerequisites: [
      { type: 'feat', name: 'Spell Focus' },
    ],
    benefit: 'Choose a school of magic for which you have already selected Spell Focus. Add +1 to the Difficulty Class for all saving throws against spells from the school of magic you select. This bonus stacks with the bonus from Spell Focus.',
    special: 'You can gain this feat multiple times. Its effects do not stack. Each time you take the feat, it applies to a new school of magic.',
  },
  {
    id: 'greater_spell_penetration',
    name: 'Greater Spell Penetration',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [
      { type: 'feat', name: 'Spell Penetration' },
    ],
    benefit: 'You get a +2 bonus on caster level checks (1d20 + caster level) made to overcome a creature\'s spell resistance. This bonus stacks with the one from Spell Penetration.',
  },
  {
    id: 'greater_two_weapon_fighting',
    name: 'Greater Two-Weapon Fighting',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Dexterity', value: 19 },
      { type: 'feat', name: 'Improved Two-Weapon Fighting' },
      { type: 'feat', name: 'Two-Weapon Fighting' },
      { type: 'bab', value: 11 },
    ],
    benefit: 'You get a third attack with your off-hand weapon, albeit at a -10 penalty.',
    special: 'A 9th-level ranger who has chosen the two-weapon combat style is treated as having Greater Two-Weapon Fighting, even if he does not have the prerequisites for it, but only when he is wearing light or no armor. A fighter may select Greater Two-Weapon Fighting as one of his fighter bonus feats.',
  },
  {
    id: 'greater_weapon_focus',
    name: 'Greater Weapon Focus',
    type: 'General',
    isFighterBonus: true,
    stackable: true,
    prerequisites: [
      { type: 'feat', name: 'Weapon Focus' },
      { type: 'classLevel', name: 'Fighter', value: 8 },
    ],
    benefit: 'Choose one type of weapon for which you have already selected Weapon Focus. You gain a +1 bonus on all attack rolls you make using the selected weapon. This bonus stacks with other bonuses on attack rolls, including the one from Weapon Focus.',
    special: 'You can gain Greater Weapon Focus multiple times. Its effects do not stack. Each time you take the feat, it applies to a new type of weapon. A fighter may select Greater Weapon Focus as one of his fighter bonus feats.',
  },
  {
    id: 'greater_weapon_specialization',
    name: 'Greater Weapon Specialization',
    type: 'General',
    isFighterBonus: true,
    stackable: true,
    prerequisites: [
      { type: 'feat', name: 'Greater Weapon Focus' },
      { type: 'feat', name: 'Weapon Focus' },
      { type: 'feat', name: 'Weapon Specialization' },
      { type: 'classLevel', name: 'Fighter', value: 12 },
    ],
    benefit: 'Choose one type of weapon for which you have already selected Weapon Specialization. You gain a +2 bonus on all damage rolls you make using the selected weapon. This bonus stacks with other bonuses on damage rolls, including the one from Weapon Specialization.',
    special: 'You can gain Greater Weapon Specialization multiple times. Its effects do not stack. Each time you take the feat, it applies to a new type of weapon. A fighter may select Greater Weapon Specialization as one of his fighter bonus feats.',
  },

  // ── H ──────────────────────────────────────────────────────────────────────
  {
    id: 'heighten_spell',
    name: 'Heighten Spell',
    type: 'Metamagic',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'A heightened spell has a higher spell level than normal (up to a maximum of 9th level). Unlike other metamagic feats, Heighten Spell actually increases the effective level of the spell that it modifies. All effects dependent on spell level (such as saving throw DCs and ability to penetrate a lesser globe of invulnerability) are calculated according to the heightened level.',
  },

  // ── I ──────────────────────────────────────────────────────────────────────
  {
    id: 'improved_bull_rush',
    name: 'Improved Bull Rush',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Strength', value: 13 },
      { type: 'feat', name: 'Power Attack' },
    ],
    benefit: 'When you perform a bull rush you do not provoke an attack of opportunity from the defender. You also gain a +4 bonus on the opposed Strength check you make to push back the defender.',
    special: 'A fighter may select Improved Bull Rush as one of his fighter bonus feats.',
  },
  {
    id: 'improved_counterspell',
    name: 'Improved Counterspell',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'When counterspelling, you may use a spell of the same school that is one or more spell levels higher than the target spell.',
    normal: 'Without this feat, you may counter a spell only with the same spell or with a spell specifically designated as countering the target spell.',
  },
  {
    id: 'improved_critical',
    name: 'Improved Critical',
    type: 'General',
    isFighterBonus: true,
    stackable: true,
    prerequisites: [
      { type: 'special', description: 'Proficient with weapon' },
      { type: 'bab', value: 8 },
    ],
    benefit: 'When using the weapon you selected, your threat range is doubled.',
    special: 'You can gain Improved Critical multiple times. The effects do not stack. Each time you take the feat, it applies to a new type of weapon. This effect doesn\'t stack with any other effect that expands the threat range of a weapon. A fighter may select Improved Critical as one of his fighter bonus feats.',
  },
  {
    id: 'improved_disarm',
    name: 'Improved Disarm',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Intelligence', value: 13 },
      { type: 'feat', name: 'Combat Expertise' },
    ],
    benefit: 'You do not provoke an attack of opportunity when you attempt to disarm a foe, nor does the foe have a chance to disarm you. You also gain a +4 bonus on the opposed attack roll you make to disarm your foe.',
    normal: 'See the normal disarm rules.',
    special: 'A fighter may select Improved Disarm as one of his fighter bonus feats.',
  },
  {
    id: 'improved_familiar',
    name: 'Improved Familiar',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [
      { type: 'special', description: 'Ability to acquire a new familiar, compatible alignment, sufficiently high level' },
    ],
    benefit: 'When choosing a familiar, the creatures listed below are also available to you. You may choose a familiar with an alignment up to one step away on each of the alignment axes (lawful through chaotic, good through evil).',
    special: 'Improved familiars otherwise use the rules for regular familiars, with two exceptions: if the creature\'s type is something other than animal, its type does not change; and improved familiars do not gain the ability to speak with animals of their kind.',
  },
  {
    id: 'improved_feint',
    name: 'Improved Feint',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Intelligence', value: 13 },
      { type: 'feat', name: 'Combat Expertise' },
    ],
    benefit: 'You can make a Bluff check to feint in combat as a move action.',
    normal: 'Feinting in combat is a standard action.',
    special: 'A fighter may select Improved Feint as one of his fighter bonus feats.',
  },
  {
    id: 'improved_grapple',
    name: 'Improved Grapple',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Dexterity', value: 13 },
      { type: 'feat', name: 'Improved Unarmed Strike' },
    ],
    benefit: 'You do not provoke an attack of opportunity when you make a touch attack to start a grapple. You also gain a +4 bonus on all grapple checks, regardless of whether you started the grapple.',
    normal: 'Without this feat, you provoke an attack of opportunity when you make a touch attack to start a grapple.',
    special: 'A fighter may select Improved Grapple as one of his fighter bonus feats. A monk may select Improved Grapple as a bonus feat at 1st level, even if she does not have the prerequisites for it.',
  },
  {
    id: 'improved_initiative',
    name: 'Improved Initiative',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +4 bonus on initiative checks.',
    special: 'A fighter may select Improved Initiative as one of his fighter bonus feats.',
  },
  {
    id: 'improved_overrun',
    name: 'Improved Overrun',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Strength', value: 13 },
      { type: 'feat', name: 'Power Attack' },
    ],
    benefit: 'When you attempt to overrun an opponent, the target may not choose to avoid you. You also gain a +4 bonus on your Strength check to knock down your opponent.',
    normal: 'Without this feat, the target of an overrun can choose to avoid you or to block you.',
    special: 'A fighter may select Improved Overrun as one of his fighter bonus feats.',
  },
  {
    id: 'improved_precise_shot',
    name: 'Improved Precise Shot',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Dexterity', value: 19 },
      { type: 'feat', name: 'Point Blank Shot' },
      { type: 'feat', name: 'Precise Shot' },
      { type: 'bab', value: 11 },
    ],
    benefit: 'Your ranged attacks ignore the AC bonus granted to targets by anything less than total cover, and the miss chance granted to targets by anything less than total concealment. Total cover and total concealment provide their normal benefits against your ranged attacks.',
    normal: 'See the normal cover and concealment rules.',
    special: 'A 11th-level ranger who has chosen the archery combat style is treated as having Improved Precise Shot even if he does not have the prerequisites for it, but only when he is wearing light or no armor. A fighter may select Improved Precise Shot as one of his fighter bonus feats.',
  },
  {
    id: 'improved_shield_bash',
    name: 'Improved Shield Bash',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'feat', name: 'Shield Proficiency' },
    ],
    benefit: 'When you perform a shield bash, you may still apply the shield\'s shield bonus to your AC.',
    normal: 'Without this feat, a character who performs a shield bash loses the shield\'s shield bonus to AC until his or her next action.',
    special: 'A fighter may select Improved Shield Bash as one of his fighter bonus feats.',
  },
  {
    id: 'improved_sunder',
    name: 'Improved Sunder',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Strength', value: 13 },
      { type: 'feat', name: 'Power Attack' },
    ],
    benefit: 'When you strike at an object held or carried by an opponent (such as a weapon or shield), you do not provoke an attack of opportunity. You also gain a +4 bonus on any attack roll made to attack an object held or carried by another character.',
    normal: 'Without this feat, you provoke an attack of opportunity when you attempt to sunder a weapon or other object.',
    special: 'A fighter may select Improved Sunder as one of his fighter bonus feats.',
  },
  {
    id: 'improved_trip',
    name: 'Improved Trip',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Intelligence', value: 13 },
      { type: 'feat', name: 'Combat Expertise' },
    ],
    benefit: 'You do not provoke an attack of opportunity when you attempt to trip an opponent while you are unarmed. You also gain a +4 bonus on your Strength check to trip your opponent. If you trip an opponent in melee combat, you immediately get a melee attack against that opponent as if you hadn\'t used your attack for the trip attempt.',
    normal: 'Without this feat, you provoke an attack of opportunity when you attempt to trip an opponent while you are unarmed.',
    special: 'A fighter may select Improved Trip as one of his fighter bonus feats.',
  },
  {
    id: 'improved_turning',
    name: 'Improved Turning',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [
      { type: 'special', description: 'Ability to turn undead' },
    ],
    benefit: 'You turn undead as if you were one level higher than you are in the class that grants you the ability.',
  },
  {
    id: 'improved_two_weapon_fighting',
    name: 'Improved Two-Weapon Fighting',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Dexterity', value: 17 },
      { type: 'feat', name: 'Two-Weapon Fighting' },
      { type: 'bab', value: 6 },
    ],
    benefit: 'In addition to the standard single extra attack you get with an off-hand weapon, you get a second attack with it, albeit at a -5 penalty.',
    normal: 'Without this feat, you can only get a single extra attack with an off-hand weapon.',
    special: 'A 6th-level ranger who has chosen the two-weapon combat style is treated as having Improved Two-Weapon Fighting even if he does not have the prerequisites for it, but only when he is wearing light or no armor. A fighter may select Improved Two-Weapon Fighting as one of his fighter bonus feats.',
  },
  {
    id: 'improved_unarmed_strike',
    name: 'Improved Unarmed Strike',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [],
    benefit: 'You are considered to be armed even when unarmed—that is, you do not provoke attacks of opportunity from armed opponents when you attack them while unarmed. However, you still get an attack of opportunity against any opponent who makes an unarmed attack on you. In addition, your unarmed strikes can deal lethal or nonlethal damage, at your option.',
    normal: 'Without this feat, you are considered unarmed when attacking with an unarmed strike, and you can deal only nonlethal damage with such an attack.',
    special: 'A monk automatically has Improved Unarmed Strike as a bonus feat. She need not select it. A fighter may select Improved Unarmed Strike as one of his fighter bonus feats.',
  },
  {
    id: 'investigator',
    name: 'Investigator',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on all Gather Information checks and Search checks.',
    skillBonuses: [
      { skill: 'Gather Information', bonus: 2 },
      { skill: 'Search', bonus: 2 },
    ],
  },
  {
    id: 'iron_will',
    name: 'Iron Will',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on all Will saving throws.',
  },

  // ── L ──────────────────────────────────────────────────────────────────────
  {
    id: 'leadership',
    name: 'Leadership',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [
      { type: 'special', description: 'Character level 6th' },
    ],
    benefit: 'Having this feat enables the character to attract loyal companions and devoted followers, subordinates who assist her. Having a score from the Leadership table means that the character attracts followers, etc.',
  },
  {
    id: 'lightning_reflexes',
    name: 'Lightning Reflexes',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on all Reflex saving throws.',
  },

  // ── M ──────────────────────────────────────────────────────────────────────
  {
    id: 'magical_aptitude',
    name: 'Magical Aptitude',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on all Spellcraft checks and Use Magic Device checks.',
    skillBonuses: [
      { skill: 'Spellcraft', bonus: 2 },
      { skill: 'Use Magic Device', bonus: 2 },
    ],
  },
  {
    id: 'manyshot',
    name: 'Manyshot',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Dexterity', value: 17 },
      { type: 'feat', name: 'Point Blank Shot' },
      { type: 'feat', name: 'Rapid Shot' },
      { type: 'bab', value: 6 },
    ],
    benefit: 'As a standard action, you may fire two arrows at a single opponent within 30 feet. Both arrows use the same attack roll (with a -4 penalty) to determine success and deal damage normally (but see Special). For every five points of base attack bonus you have above +6, you may add one additional arrow to this attack, to a maximum of four arrows at a base attack bonus of +16. However, each arrow after the second adds a cumulative -2 penalty on the attack roll.',
    special: 'Regardless of the number of arrows you fire, you apply precision-based damage only once. If you score a critical hit, only the first arrow fired deals critical damage; all others deal regular damage. A fighter may select Manyshot as one of his fighter bonus feats.',
  },
  {
    id: 'martial_weapon_prof',
    name: 'Martial Weapon Proficiency',
    type: 'General',
    isFighterBonus: false,
    stackable: true,
    prerequisites: [],
    benefit: 'You make attack rolls with the selected martial weapon normally.',
    normal: 'When using a weapon with which you are not proficient, you take a -4 penalty on attack rolls.',
    special: 'Barbarians, fighters, paladins, and rangers are proficient with all martial weapons. You can gain Martial Weapon Proficiency multiple times.',
  },
  {
    id: 'maximize_spell',
    name: 'Maximize Spell',
    type: 'Metamagic',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'All variable, numeric effects of a spell modified by this feat are maximized. Saving throws and opposed rolls are not affected, nor are spells without random variables. A maximized spell uses up a spell slot three levels higher than the spell\'s actual level.',
  },
  {
    id: 'mobility',
    name: 'Mobility',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Dexterity', value: 13 },
      { type: 'feat', name: 'Dodge' },
    ],
    benefit: 'You get a +4 dodge bonus to Armor Class against attacks of opportunity caused when you move out of or within a threatened area. A condition that makes you lose your Dexterity bonus to Armor Class (if any) also makes you lose dodge bonuses. Dodge bonuses stack with each other, unlike most types of bonuses.',
    special: 'A fighter may select Mobility as one of his fighter bonus feats.',
  },
  {
    id: 'mounted_archery',
    name: 'Mounted Archery',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'skill', name: 'Ride', value: 1 },
      { type: 'feat', name: 'Mounted Combat' },
    ],
    benefit: 'The penalty you take when using a ranged weapon while mounted is halved: -2 instead of -4 if your mount is taking a double move, and -4 instead of -8 if your mount is running.',
    special: 'A fighter may select Mounted Archery as one of his fighter bonus feats.',
  },
  {
    id: 'mounted_combat',
    name: 'Mounted Combat',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'skill', name: 'Ride', value: 1 },
    ],
    benefit: 'Once per round when your mount is hit in combat, you may attempt a Ride check (as a reaction) to negate the hit. The hit is negated if your Ride check result is greater than the opponent\'s attack roll.',
    special: 'A fighter may select Mounted Combat as one of his fighter bonus feats.',
  },

  // ── N ──────────────────────────────────────────────────────────────────────
  {
    id: 'natural_spell',
    name: 'Natural Spell',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Wisdom', value: 13 },
      { type: 'special', description: 'Wild shape ability' },
    ],
    benefit: 'You can complete the verbal and somatic components of spells while in a wild shape. You substitute various noises and gestures for the normal verbal and somatic components of a spell. You can also use any material components or focuses you possess, even if such items are melded within your current form.',
  },
  {
    id: 'negotiator',
    name: 'Negotiator',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on all Diplomacy checks and Sense Motive checks.',
    skillBonuses: [
      { skill: 'Diplomacy', bonus: 2 },
      { skill: 'Sense Motive', bonus: 2 },
    ],
  },
  {
    id: 'nimble_fingers',
    name: 'Nimble Fingers',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on all Disable Device checks and Open Lock checks.',
    skillBonuses: [
      { skill: 'Disable Device', bonus: 2 },
      { skill: 'Open Lock', bonus: 2 },
    ],
  },

  // ── P ──────────────────────────────────────────────────────────────────────
  {
    id: 'persuasive',
    name: 'Persuasive',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on all Bluff checks and Intimidate checks.',
    skillBonuses: [
      { skill: 'Bluff', bonus: 2 },
      { skill: 'Intimidate', bonus: 2 },
    ],
  },
  {
    id: 'point_blank_shot',
    name: 'Point Blank Shot',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +1 bonus on attack and damage rolls with ranged weapons at ranges of up to 30 feet.',
    special: 'A fighter may select Point Blank Shot as one of his fighter bonus feats.',
  },
  {
    id: 'power_attack',
    name: 'Power Attack',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Strength', value: 13 },
    ],
    benefit: 'On your action, before making attack rolls for a round, you may choose to subtract a number from all melee attack rolls and add the same number to all melee damage rolls. This number may not exceed your base attack bonus. The penalty on attacks and bonus on damage apply until your next turn.',
    special: 'If you attack with a two-handed weapon, or with a one-handed weapon wielded in two hands, instead add twice the number subtracted from your attack rolls. A fighter may select Power Attack as one of his fighter bonus feats.',
  },
  {
    id: 'precise_shot',
    name: 'Precise Shot',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'feat', name: 'Point Blank Shot' },
    ],
    benefit: 'You can shoot or throw ranged weapons at an opponent engaged in melee without taking the standard -4 penalty on your attack roll.',
    special: 'A fighter may select Precise Shot as one of his fighter bonus feats.',
  },

  // ── Q ──────────────────────────────────────────────────────────────────────
  {
    id: 'quick_draw',
    name: 'Quick Draw',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'bab', value: 1 },
    ],
    benefit: 'You can draw a weapon as a free action instead of as a move action. You can draw a hidden weapon (see the Sleight of Hand skill) as a move action. A character who has selected this feat may throw weapons at his full normal rate of attacks.',
    normal: 'Without this feat, you may draw a weapon as a move action, or (if your base attack bonus is +1 or higher) as a free action as part of movement.',
    special: 'A fighter may select Quick Draw as one of his fighter bonus feats.',
  },
  {
    id: 'quicken_spell',
    name: 'Quicken Spell',
    type: 'Metamagic',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'Casting a quickened spell is a free action. You can perform another action, even casting another spell, in the same round as you cast a quickened spell. You may cast only one quickened spell per round. A spell whose casting time is more than 1 full round action cannot be quickened. A quickened spell uses up a spell slot four levels higher than the spell\'s actual level. Casting a quickened spell doesn\'t provoke an attack of opportunity.',
    special: 'This feat can\'t be applied to any spell cast spontaneously.',
  },

  // ── R ──────────────────────────────────────────────────────────────────────
  {
    id: 'rapid_reload',
    name: 'Rapid Reload',
    type: 'General',
    isFighterBonus: true,
    stackable: true,
    prerequisites: [
      { type: 'special', description: 'Weapon Proficiency (chosen crossbow type)' },
    ],
    benefit: 'The time required for you to reload your chosen type of crossbow is reduced to a free action (for a hand or light crossbow) or a move action (for a heavy crossbow). If you have selected this feat for hand crossbow or light crossbow, you may fire that weapon as many times in a full attack action as you could attack if you were using a bow.',
    special: 'You can gain Rapid Reload multiple times. Each time you take the feat, it applies to a new type of crossbow. A fighter may select Rapid Reload as one of his fighter bonus feats.',
  },
  {
    id: 'rapid_shot',
    name: 'Rapid Shot',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Dexterity', value: 13 },
      { type: 'feat', name: 'Point Blank Shot' },
    ],
    benefit: 'You can get one extra attack per round with a ranged weapon. The attack is at your highest base attack bonus, but each attack you make in that round (the extra one and the normal ones) takes a -2 penalty. You must use the full attack action to use this feat.',
    special: 'A fighter may select Rapid Shot as one of his fighter bonus feats.',
  },
  {
    id: 'ride_by_attack',
    name: 'Ride-By Attack',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'skill', name: 'Ride', value: 1 },
      { type: 'feat', name: 'Mounted Combat' },
    ],
    benefit: 'When you are mounted and use the charge action, you may move and attack as if with a standard charge and then move again (continuing the straight line of the charge). Your total movement for the round can\'t exceed double your mounted speed. You and your mount do not provoke an attack of opportunity from the opponent that you attack.',
    special: 'A fighter may select Ride-By Attack as one of his fighter bonus feats.',
  },
  {
    id: 'run',
    name: 'Run',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'When running, you move five times your normal speed (if wearing medium, light, or no armor and carrying no more than a medium load) or four times your speed (if wearing heavy armor or carrying a heavy load). If you make a jump after a running start, you gain a +4 bonus on your Jump check. While running, you retain your Dexterity bonus to AC.',
    normal: 'You move four times your speed while running or three times your speed in heavy armor, and you lose your Dexterity bonus to AC.',
  },

  // ── S ──────────────────────────────────────────────────────────────────────
  {
    id: 'scribe_scroll',
    name: 'Scribe Scroll',
    type: 'ItemCreation',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [
      { type: 'casterLevel', value: 1 },
    ],
    benefit: 'You can create a scroll of any spell that you know. Scribing a scroll takes one day for each 1,000 gp in its base price. The base price of a scroll is its spell level x its caster level x 25 gp.',
  },
  {
    id: 'self_sufficient',
    name: 'Self-Sufficient',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on all Heal checks and Survival checks.',
    skillBonuses: [
      { skill: 'Heal', bonus: 2 },
      { skill: 'Survival', bonus: 2 },
    ],
  },
  {
    id: 'shield_prof',
    name: 'Shield Proficiency',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You can use a shield and take only the standard penalties.',
    normal: 'When you are using a shield with which you are not proficient, you take the shield\'s armor check penalty on attack rolls and on all skill checks that involve moving, including Ride checks.',
    special: 'Barbarians, bards, clerics, druids, fighters, paladins, and rangers automatically have Shield Proficiency as a bonus feat.',
  },
  {
    id: 'shot_on_the_run',
    name: 'Shot on the Run',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Dexterity', value: 13 },
      { type: 'feat', name: 'Dodge' },
      { type: 'feat', name: 'Mobility' },
      { type: 'feat', name: 'Point Blank Shot' },
      { type: 'bab', value: 4 },
    ],
    benefit: 'When using the attack action with a ranged weapon, you can move both before and after the attack, provided that your total distance moved is not greater than your speed.',
    special: 'A fighter may select Shot on the Run as one of his fighter bonus feats.',
  },
  {
    id: 'silent_spell',
    name: 'Silent Spell',
    type: 'Metamagic',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'A silent spell can be cast with no verbal components. Spells without verbal components are not affected. A silent spell uses up a spell slot one level higher than the spell\'s actual level.',
    special: 'Bard spells cannot be enhanced by this metamagic feat.',
  },
  {
    id: 'simple_weapon_prof',
    name: 'Simple Weapon Proficiency',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You make attack rolls with simple weapons normally.',
    special: 'All characters except for druids, monks, and wizards are automatically proficient with all simple weapons.',
  },
  {
    id: 'skill_focus',
    name: 'Skill Focus',
    type: 'General',
    isFighterBonus: false,
    stackable: true,
    prerequisites: [],
    benefit: 'You get a +3 bonus on all checks involving a chosen skill.',
    special: 'You can gain this feat multiple times. Its effects do not stack. Each time you take the feat, it applies to a new skill.',
  },
  {
    id: 'snatch_arrows',
    name: 'Snatch Arrows',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Dexterity', value: 15 },
      { type: 'feat', name: 'Deflect Arrows' },
      { type: 'feat', name: 'Improved Unarmed Strike' },
    ],
    benefit: 'When using the Deflect Arrows feat you may catch the weapon instead of just deflecting it. Thrown weapons can immediately be thrown back at the original attacker (even though it isn\'t your turn) or kept for later use. You must have at least one hand free (holding nothing) to use this feat.',
    special: 'A fighter may select Snatch Arrows as one of his fighter bonus feats.',
  },
  {
    id: 'spell_focus',
    name: 'Spell Focus',
    type: 'General',
    isFighterBonus: false,
    stackable: true,
    prerequisites: [],
    benefit: 'Add +1 to the Difficulty Class for all saving throws against spells from the school of magic you select.',
    special: 'You can gain this feat multiple times. Its effects do not stack. Each time you take the feat, it applies to a new school of magic.',
  },
  {
    id: 'spell_mastery',
    name: 'Spell Mastery',
    type: 'Special',
    isFighterBonus: false,
    stackable: true,
    prerequisites: [
      { type: 'classLevel', name: 'Wizard', value: 1 },
    ],
    benefit: 'Each time you take this feat, choose a number of spells equal to your Intelligence modifier that you already know. From that point on, you can prepare these spells without referring to a spellbook.',
    normal: 'Without this feat, you must use a spellbook to prepare all your spells, except read magic.',
  },
  {
    id: 'spell_penetration',
    name: 'Spell Penetration',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on caster level checks (1d20 + caster level) made to overcome a creature\'s spell resistance.',
  },
  {
    id: 'spirited_charge',
    name: 'Spirited Charge',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'skill', name: 'Ride', value: 1 },
      { type: 'feat', name: 'Mounted Combat' },
      { type: 'feat', name: 'Ride-By Attack' },
    ],
    benefit: 'When mounted and using the charge action, you deal double damage with a melee weapon (or triple damage with a lance).',
    special: 'A fighter may select Spirited Charge as one of his fighter bonus feats.',
  },
  {
    id: 'spring_attack',
    name: 'Spring Attack',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Dexterity', value: 13 },
      { type: 'feat', name: 'Dodge' },
      { type: 'feat', name: 'Mobility' },
      { type: 'bab', value: 4 },
    ],
    benefit: 'When using the attack action with a melee weapon, you can move both before and after the attack, provided that your total distance moved is not greater than your speed. You can\'t use this feat if you are wearing heavy armor. You must move at least 5 feet both before and after you make your attack.',
    special: 'A fighter may select Spring Attack as one of his fighter bonus feats.',
  },
  {
    id: 'stealthy',
    name: 'Stealthy',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You get a +2 bonus on all Hide checks and Move Silently checks.',
    skillBonuses: [
      { skill: 'Hide', bonus: 2 },
      { skill: 'Move Silently', bonus: 2 },
    ],
  },
  {
    id: 'still_spell',
    name: 'Still Spell',
    type: 'Metamagic',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'A stilled spell can be cast with no somatic components. Spells without somatic components are not affected. A stilled spell uses up a spell slot one level higher than the spell\'s actual level.',
  },
  {
    id: 'stunning_fist',
    name: 'Stunning Fist',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Dexterity', value: 13 },
      { type: 'ability', name: 'Wisdom', value: 13 },
      { type: 'feat', name: 'Improved Unarmed Strike' },
      { type: 'bab', value: 8 },
    ],
    benefit: 'You must declare that you are using this feat before you make your attack roll. Stunning Fist forces a foe damaged by your unarmed attack to make a Fortitude saving throw (DC 10 + 1/2 your character level + your Wis modifier), in addition to dealing damage normally. A defender who fails this saving throw is stunned for 1 round. You may attempt a stunning attack once per day for every four levels you have attained, and no more than once per round.',
    special: 'A monk may select Stunning Fist as a bonus feat at 1st level, even if she does not have the prerequisites. A fighter may select Stunning Fist as one of his fighter bonus feats.',
  },

  // ── T ──────────────────────────────────────────────────────────────────────
  {
    id: 'toughness',
    name: 'Toughness',
    type: 'General',
    isFighterBonus: false,
    stackable: true,
    prerequisites: [],
    benefit: 'You gain +3 hit points.',
    special: 'A character may gain this feat multiple times. Its effects stack.',
  },
  {
    id: 'tower_shield_prof',
    name: 'Tower Shield Proficiency',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [
      { type: 'feat', name: 'Shield Proficiency' },
    ],
    benefit: 'You can use a tower shield and suffer only the standard penalties.',
    special: 'Fighters automatically have Tower Shield Proficiency as a bonus feat.',
  },
  {
    id: 'track',
    name: 'Track',
    type: 'General',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'To find tracks or to follow them for 1 mile requires a successful Survival check. You must make another Survival check every time the tracks become difficult to follow. You move at half your normal speed while tracking, or at normal speed with a -5 penalty on the check.',
    normal: 'Without this feat, you can use the Survival skill to find tracks, but you can follow them only if the DC for the task is 10 or lower.',
    special: 'A ranger automatically has Track as a bonus feat.',
  },
  {
    id: 'trample',
    name: 'Trample',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'skill', name: 'Ride', value: 1 },
      { type: 'feat', name: 'Mounted Combat' },
    ],
    benefit: 'When you attempt to overrun an opponent while mounted, your target may not choose to avoid you. Your mount may make one hoof attack against any target you knock down, gaining the standard +4 bonus on attack rolls against prone targets.',
    special: 'A fighter may select Trample as one of his fighter bonus feats.',
  },
  {
    id: 'two_weapon_defense',
    name: 'Two-Weapon Defense',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Dexterity', value: 15 },
      { type: 'feat', name: 'Two-Weapon Fighting' },
    ],
    benefit: 'When wielding a double weapon or two weapons (not including natural weapons or unarmed strikes), you gain a +1 shield bonus to your AC. When you are fighting defensively or using the total defense action, this shield bonus increases to +2.',
    special: 'A fighter may select Two-Weapon Defense as one of his fighter bonus feats.',
  },
  {
    id: 'two_weapon_fighting',
    name: 'Two-Weapon Fighting',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Dexterity', value: 15 },
    ],
    benefit: 'Your penalties on attack rolls for fighting with two weapons are reduced. The penalty for your primary hand lessens by 2 and the one for your off hand lessens by 6.',
    normal: 'If you wield a second weapon in your off hand, you can get one extra attack per round with that weapon. When fighting in this way you suffer a -6 penalty with your regular attack or attacks with your primary hand and a -10 penalty to the attack with your off hand.',
    special: 'A fighter may select Two-Weapon Fighting as one of his fighter bonus feats.',
  },

  // ── W ──────────────────────────────────────────────────────────────────────
  {
    id: 'weapon_finesse',
    name: 'Weapon Finesse',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'bab', value: 1 },
    ],
    benefit: 'With a light weapon, rapier, whip, or spiked chain made for a creature of your size category, you may use your Dexterity modifier instead of your Strength modifier on attack rolls. If you carry a shield, its armor check penalty applies to your attack rolls.',
    special: 'Natural weapons are always considered light weapons. A fighter may select Weapon Finesse as one of his fighter bonus feats.',
  },
  {
    id: 'weapon_focus',
    name: 'Weapon Focus',
    type: 'General',
    isFighterBonus: true,
    stackable: true,
    prerequisites: [
      { type: 'special', description: 'Proficiency with selected weapon' },
      { type: 'bab', value: 1 },
    ],
    benefit: 'You gain a +1 bonus on all attack rolls you make using the selected weapon.',
    special: 'You can gain this feat multiple times. Its effects do not stack. Each time you take the feat, it applies to a new type of weapon. A fighter may select Weapon Focus as one of his fighter bonus feats.',
  },
  {
    id: 'weapon_specialization',
    name: 'Weapon Specialization',
    type: 'General',
    isFighterBonus: true,
    stackable: true,
    prerequisites: [
      { type: 'feat', name: 'Weapon Focus' },
      { type: 'classLevel', name: 'Fighter', value: 4 },
    ],
    benefit: 'You gain a +2 bonus on all damage rolls you make using the selected weapon.',
    special: 'You can gain this feat multiple times. Its effects do not stack. Each time you take the feat, it applies to a new type of weapon. A fighter may select Weapon Specialization as one of his fighter bonus feats.',
  },
  {
    id: 'whirlwind_attack',
    name: 'Whirlwind Attack',
    type: 'General',
    isFighterBonus: true,
    stackable: false,
    prerequisites: [
      { type: 'ability', name: 'Dexterity', value: 13 },
      { type: 'ability', name: 'Intelligence', value: 13 },
      { type: 'feat', name: 'Combat Expertise' },
      { type: 'feat', name: 'Dodge' },
      { type: 'feat', name: 'Mobility' },
      { type: 'feat', name: 'Spring Attack' },
      { type: 'bab', value: 4 },
    ],
    benefit: 'When you use the full attack action, you can give up your regular attacks and instead make one melee attack at your full base attack bonus against each opponent within reach. When you use the Whirlwind Attack feat, you also forfeit any bonus or extra attacks granted by other feats, spells, or abilities.',
    special: 'A fighter may select Whirlwind Attack as one of his fighter bonus feats.',
  },
  {
    id: 'widen_spell',
    name: 'Widen Spell',
    type: 'Metamagic',
    isFighterBonus: false,
    stackable: false,
    prerequisites: [],
    benefit: 'You can alter a burst, emanation, line, or spread shaped spell to increase its area. Any numeric measurements of the spell\'s area increase by 100%. A widened spell uses up a spell slot three levels higher than the spell\'s actual level. Spells that do not have an area of one of these four sorts are not affected by this feat.',
  },
]

/** Look up a feat by its ID */
export function getFeatById(id: string): DnDFeat | undefined {
  return DND_FEATS.find(f => f.id === id)
}

/** Look up a feat by its exact name */
export function getFeatByName(name: string): DnDFeat | undefined {
  return DND_FEATS.find(f => f.name === name)
}

/** Get all feats eligible as Fighter bonus feats */
export function getFighterBonusFeats(): DnDFeat[] {
  return DND_FEATS.filter(f => f.isFighterBonus)
}

/** Get feats of a specific type */
export function getFeatsByType(type: FeatType): DnDFeat[] {
  return DND_FEATS.filter(f => f.type === type)
}

/**
 * Check if a character meets the prerequisites for a feat.
 * Pass in the character's current stats for evaluation.
 */
export function meetsFeatPrerequisites(
  feat: DnDFeat,
  stats: {
    str?: number; dex?: number; con?: number; int?: number; wis?: number; cha?: number
    bab?: number
    feats?: string[]  // feat IDs already known
    classLevels?: Record<string, number>
    skillRanks?: Record<string, number>
    casterLevel?: number
  }
): boolean {
  for (const prereq of feat.prerequisites) {
    switch (prereq.type) {
      case 'ability': {
        const abilityMap: Record<string, number | undefined> = {
          Strength: stats.str, Dexterity: stats.dex, Constitution: stats.con,
          Intelligence: stats.int, Wisdom: stats.wis, Charisma: stats.cha,
        }
        const val = prereq.name ? abilityMap[prereq.name] : undefined
        if (val === undefined || val < (prereq.value ?? 0)) return false
        break
      }
      case 'feat':
        if (!prereq.name) break
        if (!(stats.feats ?? []).some(id => {
          const f = getFeatById(id)
          return f?.name === prereq.name
        })) return false
        break
      case 'bab':
        if ((stats.bab ?? 0) < (prereq.value ?? 0)) return false
        break
      case 'casterLevel':
        if ((stats.casterLevel ?? 0) < (prereq.value ?? 0)) return false
        break
      case 'classLevel':
        if (!prereq.name) break
        if ((stats.classLevels?.[prereq.name] ?? 0) < (prereq.value ?? 0)) return false
        break
      case 'skill':
        if (!prereq.name) break
        if ((stats.skillRanks?.[prereq.name] ?? 0) < (prereq.value ?? 0)) return false
        break
      case 'special':
        // Cannot auto-check special prereqs — caller must validate
        break
    }
  }
  return true
}
