# Multiple Event Organizers Feature

## Overview
This feature allows events to have multiple clubs as organizers instead of just one. Users can now select multiple clubs (including ADEI and Administration ENSA Fès) to organize the same event.

## What's Been Implemented

### 1. Frontend Admin Form (EventsAdmin.jsx)
- **Multi-select dropdown**: Users can add multiple clubs as organizers
- **Visual badges**: Each selected club appears as a colored badge
- **Easy removal**: Click the × button to remove a club from the list
- **Visual feedback**: Shows count when multiple organizers are selected
- **Color coding**: 
  - ADEI: Red badge (#dc2626)
  - Administration ENSA Fès: Green badge (#059669)
  - Regular clubs: Blue badge (#3b82f6)

### 2. Display Logic (helpers.js)
- **Smart formatting**: 
  - 1 organizer: "Club A"
  - 2 organizers: "Club A & Club B"
  - 3+ organizers: "Club A, Club B & Club C"
- **Backward compatibility**: Still works with old single-organizer events
- **Club name resolution**: Looks up actual club names from clubs data

### 3. Events Display (Events.jsx)
- **Fetches clubs data**: Now loads clubs to resolve names properly
- **Updated organizer display**: Shows multiple organizers in event cards
- **Search functionality**: Can search by any organizer name

### 4. Details Modal (DetailsModal.jsx)
- **Enhanced organizer section**: Shows all organizers properly formatted
- **Receives clubs data**: For proper name resolution

### 5. Backend Support (server/index.js)
- **New clubIds field**: Stores JSON array of club IDs
- **Backward compatibility**: Still supports old clubId field
- **Smart organizer generation**: Creates display names from selected clubs
- **Database model updated**: Event model includes clubIds field

## How It Works

### Admin Interface
1. User opens "Add Event" or "Edit Event" form
2. In the "Clubs organisateurs" section, they can:
   - Select from dropdown to add clubs
   - See selected clubs as colored badges
   - Remove clubs by clicking the × button
   - See a count when multiple clubs are selected

### Data Storage
- **clubIds**: JSON array like `["adei", "1", "3"]`
- **organizer**: Generated display string like "ADEI, Club Informatique & Club Entrepreneuriat"
- **clubId**: For backward compatibility (set to first club if only one selected)

### Display
- Events page shows: "Organisé par ADEI & Club Informatique"
- Details modal shows: "ADEI, Club Informatique & Club Entrepreneuriat"
- Admin table shows: Individual badges for each organizer

## Example Usage

### Single Organizer (unchanged)
```javascript
// Old format still works
{
  organizer: "ADEI"
}
```

### Multiple Organizers (new)
```javascript
// New format
{
  clubIds: ["adei", "1", "2"],
  organizer: "ADEI, Club Informatique & Club Robotique"
}
```

## Benefits
1. **Realistic representation**: Many events are co-organized by multiple clubs
2. **Better visibility**: All organizing clubs get proper credit
3. **Improved search**: Users can find events by any organizing club
4. **Professional appearance**: Shows collaboration between clubs
5. **Backward compatible**: Existing events continue to work

## Testing
A test file `testMultipleOrganizers.js` is included to verify the functionality works correctly with various combinations of organizers.

## Future Enhancements
- Database migration to add `clubIds` column (optional)
- Analytics on club collaboration
- Filtering events by specific organizer combinations
- Bulk organizer management tools