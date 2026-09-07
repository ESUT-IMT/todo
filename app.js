// ---------------------------------------------------------------
// Ledger — a small To-Do List application
// Uses: a class (Task), a loop (rendering), conditionals (validation),
// and Local Storage for persistence.
// ---------------------------------------------------------------

const STORAGE_KEY = 'ledger.tasks';

/**
 * Represents a single to-do item.
 */
class Task {
  constructor(text, id = Date.now() + Math.random()) {
    this.id = id;
    this.text = text;
    this.completed = false;
  }
}

/**
 * Handles all task state and persistence.
 */
class TaskStore {
  constructor() {
    this.tasks = this.load();
  }

  load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      // Rebuild as real Task instances
      return parsed.map((t) => Object.assign(new Task(t.text, t.id), t));
    } catch (err) {
      console.error('Could not read saved tasks, starting fresh.', err);
      return [];
    }
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
  }

  add(text) {
    const task = new Task(text.trim());
    this.tasks.unshift(task);
    this.save();
    return task;
  }

  edit(id, newText) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.text = newText.trim();
      this.save();
    }
  }

  toggleComplete(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.save();
    }
  }

  remove(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.save();
  }

  count() {
    return this.tasks.length;
  }
}

// ---------------------------------------------------------------
// App wiring
// ---------------------------------------------------------------

const store = new TaskStore();

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const formError = document.getElementById('form-error');
const listEl = document.getElementById('task-list');
const listPanel = document.querySelector('.list-panel');
const tallyText = document.getElementById('tally-text');

let editingId = null;

function render() {
  listEl.innerHTML = '';

  // Loop over every stored task and build its row
  for (const task of store.tasks) {
    listEl.appendChild(buildTaskRow(task));
  }

  // Conditional: toggle empty-state messaging
  if (store.count() === 0) {
    listPanel.classList.add('is-empty');
  } else {
    listPanel.classList.remove('is-empty');
  }

  const n = store.count();
  tallyText.textContent = `${n} ${n === 1 ? 'task' : 'tasks'}`;
}

function buildTaskRow(task) {
  const li = document.createElement('li');
  li.className = 'task' + (task.completed ? ' completed' : '');

  const checkbox = document.createElement('button');
  checkbox.className = 'task-checkbox';
  checkbox.type = 'button';
  checkbox.setAttribute('role', 'checkbox');
  checkbox.setAttribute('aria-checked', String(task.completed));
  checkbox.setAttribute('aria-label', task.completed ? 'Mark as not done' : 'Mark as done');
  checkbox.textContent = task.completed ? '✓' : '';
  checkbox.addEventListener('click', () => {
    store.toggleComplete(task.id);
    render();
  });

  const body = document.createElement('div');
  body.className = 'task-body';

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  if (editingId === task.id) {
    const editInput = document.createElement('input');
    editInput.className = 'task-edit-input';
    editInput.type = 'text';
    editInput.maxLength = 120;
    editInput.value = task.text;
    body.appendChild(editInput);

    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.type = 'button';
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => commitEdit(task.id, editInput.value));

    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') commitEdit(task.id, editInput.value);
      if (e.key === 'Escape') { editingId = null; render(); }
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => { editingId = null; render(); });

    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);

    setTimeout(() => editInput.focus(), 0);
  } else {
    const text = document.createElement('p');
    text.className = 'task-text';
    text.textContent = task.text;
    body.appendChild(text);

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => { editingId = task.id; render(); });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      store.remove(task.id);
      render();
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
  }

  li.appendChild(checkbox);
  li.appendChild(body);
  li.appendChild(actions);
  return li;
}

function commitEdit(id, value) {
  const trimmed = value.trim();
  // Conditional: don't allow saving an empty edit
  if (trimmed === '') {
    return;
  }
  store.edit(id, trimmed);
  editingId = null;
  render();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = input.value.trim();

  // Input validation: reject empty tasks
  if (value === '') {
    formError.textContent = 'A task can\u2019t be empty. Write something first.';
    return;
  }
  if (value.length > 120) {
    formError.textContent = 'Keep tasks under 120 characters.';
    return;
  }

  formError.textContent = '';
  store.add(value);
  input.value = '';
  input.focus();
  render();
});

render();
