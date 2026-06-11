# Feature: Export World Cup 2026 Schedule to Calendar (ICS)

## Objective

Allow users to export selected World Cup matches as an `.ics` calendar file that can be imported into:

- Google Calendar
- Apple Calendar
- Outlook
- Samsung Calendar
- Most calendar applications supporting the iCalendar format

The export flow should be handled through a modal window.

---

# User Experience

## New Button

Add an "Add to Calendar" button near the top of the schedule page.

Example placement:

- Near the page title
- Near filters/search controls
- Sticky action bar on mobile

---

# Export Modal

When the user clicks "Add to Calendar", open a modal.

The modal should contain:

## Match Selection

### Quick Select Options

- Select All Matches
- Group Stage Only
- Round of 32
- Round of 16
- Quarter Finals
- Semi Finals
- Third Place Match
- Final

Selecting one of these options should automatically select matching fixtures.

---

## Team Filter

Provide an optional team dropdown.

Examples:

- All Teams
- Argentina
- Brazil
- England
- France
- Germany
- Spain
- etc.

When a team is selected:

- Only that team's matches are selected
- User can still manually adjust selections

This is expected to be one of the most-used export scenarios.

---

## Individual Match Selection

Display a scrollable list of matches.

Each row should contain:

- Checkbox
- Home Team
- Away Team
- Match Date
- Match Time (local user timezone)

Example:

[✓] Argentina vs Spain
[✓] Brazil vs Germany
[ ] England vs France

---

# Notification Settings

Allow the user to choose a reminder.

Options:

- No reminder
- 15 minutes before
- 30 minutes before
- 1 hour before
- 3 hours before
- 1 day before

The selected reminder should be written into the ICS file using VALARM entries.

---

# Optional Export Settings

Include toggles for:

## Include Venue

Adds stadium/location to the event.

Default: ON

---

## Include Match Details

Adds information such as:

- Stage
- Match Number
- Venue
- Kickoff Time

Default: ON

---

## Include Timezone Information

Ensure generated events import correctly across calendar applications.

Default: ON

---

# ICS Generation

Use the `ics` npm package.

Install:

```bash
npm install ics
```

---

# Event Structure

Each selected match becomes one calendar event.

## Title

```text
Argentina vs Spain
```

---

## Description

Example:

```text
FIFA World Cup 2026

Stage: Group Stage
Match: #14

Kickoff:
2026-06-18 18:00 UTC
```

---

## Location

```text
MetLife Stadium
```

---

## Duration

Default duration:

```text
2 hours
```

This should be configurable via a constant.

Example:

```ts
const MATCH_DURATION_HOURS = 2
```

---

# Technical Requirements

## Create Utility

Create:

```text
src/utils/calendar.ts
```

Responsibilities:

- Convert matches to ICS events
- Generate alarms/reminders
- Generate ICS content
- Trigger browser download

---

## Create Modal Component

Create:

```text
src/components/CalendarExportModal.tsx
```

Responsibilities:

- Match selection
- Team filtering
- Reminder selection
- Export settings
- Trigger download

---

## Create Calendar Button Component

Create:

```text
src/components/CalendarButton.tsx
```

Responsibilities:

- Open modal
- Pass match data into modal

---

# Data Model Assumptions

Existing Match object contains:

```ts
type Match = {
  MatchNumber: number
  HomeTeam: string
  AwayTeam: string
  DateUtc: string
  Stage: string
  Location: string
}
```

If fields differ, adapt accordingly.

---

# Performance Considerations

The tournament contains approximately 104 matches.

Requirements:

- No noticeable lag when opening modal
- No noticeable lag generating ICS
- Support exporting all matches at once

---

# Accessibility

- Keyboard navigable
- ESC closes modal
- Focus trap inside modal
- Screen-reader labels
- Proper checkbox labeling

---

# Mobile Requirements

Modal must be fully usable on mobile.

Requirements:


- Full-width modal on small screens
- Scrollable match list
- Sticky footer actions

Footer:

[Cancel] [Download ICS]

---

# Nice-to-Have Enhancements

## Team-Based Export

Example:

Export all Brazil matches only.

This should be optimized because it is likely a common use case.

---

## Favorite Teams Integration

Future enhancement:

If the application later supports favorite teams, preselect those teams in the export modal.

---

## Multiple Reminder Types

Future enhancement:

Allow multiple reminders.

Example:

- 1 day before
- 1 hour before
- 15 minutes before

Generate multiple VALARM entries.

---

# Success Criteria

A user should be able to:

1. Click "Add to Calendar"
2. Select matches (all, by stage, by team, or individually)
3. Choose reminder timing
4. Download a valid `.ics` file
5. Import the file into Google Calendar, Apple Calendar, Outlook, or Samsung Calendar
6. Receive reminders according to the chosen settings