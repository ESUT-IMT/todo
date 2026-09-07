# Ledger — A To-Do List Application

A small web app for managing daily tasks: add, edit, complete, and delete
items, with everything saved automatically to the browser's Local Storage.

## What it does

Ledger lets you keep a running list of tasks. You can:
- Add a new task
- Mark a task as done / not done
- Edit an existing task
- Delete a task
- See a running count of how many tasks you have
- Reopen the page later and find your list exactly as you left it (Local Storage)

## How to run it

No build tools or installation required.

1. Download / clone this folder.
2. Open `index.html` in any modern web browser (double-click it, or
   right-click → "Open with" → your browser).

That's it — the app runs entirely client-side.

## Project structure

```
todo-app/
├── index.html   # page structure
├── style.css    # styling (responsive, works on mobile and desktop)
├── app.js       # app logic: Task class, TaskStore class, rendering, events
├── PLAN.md      # project plan (requirements, classes/functions, input/output sketches)
└── README.md    # this file
```

## Requirements implemented

- [x] Responsive user interface
- [x] Add a new task
- [x] Display all tasks
- [x] Mark a task as completed
- [x] Edit an existing task
- [x] Delete a task
- [x] Display the total number of tasks
- [x] Save tasks using Local Storage
- [x] Input validation (empty tasks are rejected, with an on-screen error message)

## Technical notes

- Built with plain HTML, CSS, and JavaScript (no framework needed).
- Uses a `Task` class (one instance per to-do item) and a `TaskStore` class
  that owns the array of tasks, loads/saves them to Local Storage, and
  exposes `add`, `edit`, `toggleComplete`, and `remove` methods.
- Uses a `for...of` loop to render the task list, and conditional checks for
  form validation and for switching between "empty list" and "list with
  tasks" states.

## A bug found while testing

While testing with unusual input, submitting a task made only of spaces
(e.g. `"   "`) was originally accepted because the check only looked for an
empty string, not a string of whitespace. **Fix:** the input is now trimmed
(`value.trim()`) before the empty check, so whitespace-only tasks are
correctly rejected.
