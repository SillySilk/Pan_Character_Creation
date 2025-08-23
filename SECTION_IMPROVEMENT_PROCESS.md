# Section Improvement Process

This document outlines the proven process for fixing problematic sections in the PanCasting character generator by adopting the successful Heritage page pattern.

## Problem Analysis

### Heritage Page (Working Well) - Pattern to Follow
- **Linear Workflow**: Clear step-by-step progression with conditional rendering
- **State Persistence**: Restores selections from character store on page reload  
- **Visual Feedback**: Green "Selected:" badges for completed choices
- **Automatic Progression**: Smooth transitions between steps with delays
- **Table Display**: Hides full table by default, shows only result after rolling
- **Technical Consistency**: Uses global table engine and persistent services

### Youth Events (Fixed) - Previous Issues
- **Complex Multi-Event Arrays**: Managed arrays of events instead of single selections
- **Manual Progression**: Required "Add Another" and "Proceed" button decisions
- **No State Restoration**: Didn't check character store for existing events
- **Always Visible Tables**: Showed full selection menus instead of just results
- **Technical Issues**: Missing roll parameters, inconsistent service patterns

## Step-by-Step Improvement Process

### Phase 1: Analysis
1. **Examine Working Section**: Study Heritage components for patterns
2. **Identify Problem Areas**: Compare with broken section to find differences
3. **Document Issues**: List specific technical and UX problems

### Phase 2: Table Component Fix
#### File: `[Section]Table.tsx`

**Key Changes:**
```typescript
// 1. Import useRef for persistent services
import React, { useState, useEffect, useRef } from 'react'

// 2. Use global table engine and persistent service
const tableEngine = getGlobalTableEngine()
const tableServiceRef = useRef(new TableService())
const tableService = tableServiceRef.current

// 3. Add showFullTable state (defaults to false)
const [showFullTable, setShowFullTable] = useState(false)

// 4. Fix roll parameter passing
const result = await tableEngine.processTable(table.id, character, {
  manualSelection: roll.finalResult
})

// 5. Update render structure to match Heritage pattern
```

**Template Structure:**
```tsx
return (
  <div className="space-y-6">
    {/* Table Header with Roll Controls */}
    <div className="bg-parchment-100 border-2 border-amber-600 rounded-lg p-4">
      <h3 className="text-xl font-bold text-amber-800 mb-2">{table.name}</h3>
      <p className="text-parchment-700 mb-3">{table.instructions}</p>
      
      <div className="flex items-center gap-4">
        <button onClick={handleRoll}>Roll {table.diceType}</button>
        {!selectedEntry && (
          <button onClick={() => setShowFullTable(!showFullTable)}>
            {showFullTable ? 'Hide Table' : 'Manual Selection'}
          </button>
        )}
        {currentRoll && <span>Rolled: {currentRoll.finalResult}</span>}
      </div>
    </div>

    {/* Current Selection - Only show after roll/selection */}
    {selectedEntry && (
      <div className="[color-scheme] border-2 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{selectedEntry.rollRange[0]}-{selectedEntry.rollRange[1]}</span>
            <h4>{selectedEntry.result}</h4>
          </div>
          <button onClick={resetSelection}>Change Selection</button>
        </div>
        {/* Effects display */}
      </div>
    )}

    {/* Full Table - Only show when showFullTable is true */}
    {showFullTable && (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Table entries */}
      </div>
    )}
  </div>
)
```

### Phase 3: Selector Component Simplification  
#### File: `[Section]EventSelector.tsx`

**Key Changes:**
```typescript
// 1. Simplify state from arrays to single selections
const [selectedEvent1, setSelectedEvent1] = useState<any>(null)
const [selectedEvent2, setSelectedEvent2] = useState<any>(null)

// 2. Add state restoration useEffect
useEffect(() => {
  if (character.[sectionEvents]) {
    // Check character store and restore selections
    setSelectedEvent1(existingEvent1)
    setSelectedEvent2(existingEvent2)
  }
}, [character])

// 3. Implement automatic progression with delays
const handleEvent1Selection = (result: any) => {
  setSelectedEvent1(result.entry)
  setShowEvent1Table(false)
  
  // Auto-progress after delay
  setTimeout(() => {
    setShowEvent2Table(true)
  }, 500)
}

// 4. Add visual feedback with "Selected:" badges
{selectedEvent1 && (
  <div className="flex items-center gap-2">
    <span className="text-green-600 font-medium">Selected:</span>
    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-semibold">
      {selectedEvent1.result}
    </span>
  </div>
)}
```

**Template Structure:**
```tsx
return (
  <div className="space-y-6">
    {/* Progress Header */}
    <div className="bg-parchment-100 border-2 border-amber-600 rounded-lg p-4">
      <h2 className="text-2xl font-bold text-amber-800 mb-2">[Section Name]</h2>
      <p className="text-parchment-700">[Description]</p>
    </div>

    {/* Step 1 */}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3>Step 1: [Event Type]</h3>
        {selectedEvent1 && (
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-medium">Selected:</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-semibold">
              {selectedEvent1.result}
            </span>
          </div>
        )}
      </div>
      
      {!selectedEvent1 && !showTable1 && (
        <button onClick={() => setShowTable1(true)}>Generate [Event]</button>
      )}
      
      {showTable1 && (
        <[Section]Table onComplete={handleEvent1Selection} />
      )}
    </div>

    {/* Step 2 - Only show after Step 1 completion */}
    {selectedEvent1 && (
      <div className="space-y-4">
        {/* Same pattern as Step 1 */}
      </div>
    )}

    {/* Summary - Only show when all complete */}
    {selectedEvent1 && selectedEvent2 && (
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
        <h4>[Section] Complete</h4>
        {/* Show all selections in grid */}
      </div>
    )}
  </div>
)
```

### Phase 4: Technical Verification

**Required Technical Fixes:**
1. ✅ **Global Table Engine**: Import and use `getGlobalTableEngine()`
2. ✅ **Persistent Services**: Use `useRef(new TableService())`  
3. ✅ **Roll Parameters**: Pass `manualSelection: roll.finalResult`
4. ✅ **Method Names**: Use `getTable()` not `getTableById()`
5. ✅ **Table Display**: Default `showFullTable = false`
6. ✅ **State Restoration**: Check character store in useEffect
7. ✅ **Character Updates**: Call `updateCharacter()` with results
8. ✅ **Auto-Progression**: Use setTimeout delays between steps

### Phase 5: Testing Checklist

**Functionality Tests:**
- [ ] Tables load without errors
- [ ] Rolling works and shows only result (not full table)
- [ ] "Manual Selection" button shows/hides full table
- [ ] "Change Selection" button works after rolling
- [ ] Automatic progression between steps
- [ ] "Selected:" badges appear for completed choices
- [ ] State restoration works on page refresh/navigation
- [ ] Character data is properly saved
- [ ] Final summary shows all selections

**UX Tests:**
- [ ] No confusing "Add Another" buttons
- [ ] Clear step-by-step progression
- [ ] Visual feedback matches Heritage pattern
- [ ] Smooth transitions with loading states

## Sections to Apply This Process

1. **Youth Events** ✅ - **COMPLETED**
2. **Occupations** - Next candidate
3. **Adulthood Events** - May need attention  
4. **Personality** - Likely needs work
5. **Contacts** - Probably needs work
6. **Special Items** - Probably needs work

## Success Metrics

**Before (Youth Events Issues):**
- Complex multi-event arrays with manual progression
- Always-visible selection tables causing confusion
- Missing state restoration
- Technical inconsistencies with table processing

**After (Heritage Pattern Applied):**
- Clean step-by-step workflow: 1 childhood + 1 adolescence event
- Tables hidden by default, only results shown after rolling
- State restoration from character store
- Consistent technical patterns matching working sections

## Key Principle

**The Heritage page works well because it's simple and predictable.** Every problematic section should adopt its exact patterns:

- **Linear not branching** workflows
- **Single required selections** not optional multiple events  
- **Automatic progression** not manual decisions
- **Hide complexity** until needed (tables, options)
- **Visual consistency** with green badges and similar layouts
- **Technical consistency** with same service and engine patterns

This process ensures all sections feel cohesive and work reliably like the successful Heritage page.