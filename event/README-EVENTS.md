# Events System

This folder contains the events management system for Clarechen.com.au.

## Structure

```
/event/
  ├── TEMPLATE.md              # Template for creating new events (set as unpublished)
  ├── event-detail.html        # Template event detail page
  ├── events/
  │   ├── birthday-celebration.md
  │   ├── design-workshop.md
  │   └── [other-events].md
  ├── birthday-celebration/
  │   └── index.html           # Published event detail page
  └── [other-published-events]/
      └── index.html
```

## How to Create a New Event

1. **Copy the template**: Start with `/event/TEMPLATE.md`

2. **Edit the frontmatter** (YAML section at the top):
   ```yaml
   ---
   title: "Event Title"
   published: false              # Set to true when ready to publish
   date: "2026-MM-DD"
   time: "HH:MM AM/PM"
   location: "Venue, City"
   jotformId: "260778160100853" # Your JotForm ID
   description: "Short description for the card"
   ---
   ```

3. **Save as** `/event/events/event-slug-name.md`
   - Use kebab-case for the filename (e.g., `birthday-celebration.md`)
   - The slug must match the folder name for the event detail page

4. **Create an event detail page** (only if publishing):
   - Create folder: `/event/event-slug-name/`
   - Create file: `/event/event-slug-name/index.html`
   - Copy the content structure from `/event/birthday-celebration/index.html`
   - Update the title, meta tags, and event details

5. **Set `published: true`** in the markdown frontmatter
   - The card will automatically appear on the homepage
   - Update the `eventFiles` array in `/assets/js/events.js` if the filename isn't already listed

## Publishing & Unpublishing

- **To show an event**: Set `published: true` in the markdown frontmatter
- **To hide an event**: Set `published: false` in the markdown frontmatter
  - Hides from the homepage card list
  - The detail page becomes inaccessible (returns "not found")

## Event Detail Page

Each published event gets its own page at `/event/[slug]/index.html`:
- Displays all event information from the markdown
- Embeds the JotForm using the `jotformId` from frontmatter
- Uses the same design language as the homepage
- Links back to the events section on homepage

## Important Notes

- The `jotformId` should match across events (unless you have different forms)
- Dates are formatted as "15 April 2026" automatically
- Event cards appear in reverse chronological order (most recent first)
- The grid layout adapts: 3 columns → 2 columns (2 events) → 1 column (1 event)
