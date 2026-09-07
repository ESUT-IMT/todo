# Project Plan — Ledger (To-Do List Application)

## Requirements

1. A user can add a new task by typing text and submitting the form.
2. A user can mark a task as completed, and mark it back to not-completed.
3. A user can edit the text of an existing task.
4. A user can delete a task they no longer need.
5. The app displays the total number of tasks currently in the list, and
   rejects empty (or whitespace-only) tasks with a visible error message.

## Classes / functions needed

- **`Task` (class)** — represents one to-do item: `id`, `text`, `completed`.
- **`TaskStore` (class)** — owns the list of tasks and Local Storage
  persistence:
  - `load()` — read saved tasks from Local Storage on startup
  - `save()` — write the current tasks to Local Storage
  - `add(text)` — create and store a new `Task`
  - `edit(id, newText)` — update a task's text
  - `toggleComplete(id)` — flip a task's completed state
  - `remove(id)` — delete a task
  - `count()` — number of tasks currently stored
- **`render()`** — redraws the task list and the total-count display.
- **`buildTaskRow(task)`** — builds the DOM row for a single task (view vs.
  edit mode).
- **`commitEdit(id, value)`** — validates and saves an in-progress edit.
- Form `submit` handler — validates and adds a new task.

## Expected input / output per feature

| Feature | Input | Output |
|---|---|---|
| Add task | Text typed into the input, e.g. `"Buy milk"` | New row appears at the top of the list; total count increases by 1; input clears |
| Add task (invalid) | Empty or whitespace-only text | Error message shown, no task added |
| Mark complete | Click the round checkbox next to a task | Row shows a check mark and strikethrough text |
| Edit task | Click "Edit", change text, click "Save" | Row updates to show the new text; empty edits are ignored |
| Delete task | Click "Delete" on a row | Row disappears from the list; total count decreases by 1 |
| Reload page | Refresh the browser | Previously saved tasks reappear (loaded from Local Storage) |
