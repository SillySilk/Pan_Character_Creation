// Utility functions for working with PersonalityTraits
import type { PersonalityTraits, PersonalityTrait, ExoticTrait } from '../types/character'

/**
 * Get all personality traits as a flat array
 */
export function getAllTraits(traits: PersonalityTraits): (PersonalityTrait | ExoticTrait)[] {
  return [
    ...traits.lightside,
    ...traits.neutral,
    ...traits.darkside,
    ...traits.exotic
  ]
}

/**
 * Get total count of all personality traits
 */
export function getTraitCount(traits: PersonalityTraits): number {
  return traits.lightside.length + traits.neutral.length + traits.darkside.length + traits.exotic.length
}

/**
 * Check if there are any personality traits
 */
export function hasTraits(traits?: PersonalityTraits): boolean {
  if (!traits) return false
  return getTraitCount(traits) > 0
}

/**
 * Get the type/category of a trait (handles both PersonalityTrait and ExoticTrait)
 */
export function getTraitType(trait: PersonalityTrait | ExoticTrait): string {
  if ('type' in trait) {
    return trait.type
  }
  return 'Exotic'
}
