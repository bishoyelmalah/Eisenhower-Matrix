document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const deadlineInput = document.getElementById('task-deadline');
    const uncategorizedTasksContainer = document.getElementById('uncategorized-tasks');
    const containers = document.querySelectorAll('.task-container');
    const modal = document.getElementById('task-details-modal');
    const modalContent = document.getElementById('modal-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    let draggedItem = null;
    let taskIdCounter = 0;
    let currentEditingTask = null; // Reference to the task being edited in the modal
    
    const quadrantColors = {
        'do-tasks': 'bg-red-200 border-red-300',
        'schedule-tasks': 'bg-blue-200 border-blue-300',
        'delegate-tasks': 'bg-orange-200 border-orange-300',
        'eliminate-tasks': 'bg-slate-200 border-slate-300',
        'uncategorized-tasks': 'bg-white border-slate-300'
    };
    const colorClasses = Object.values(quadrantColors).flatMap(c => c.split(' '));

    const quadrantDetails = {
        'do-tasks': { title: 'Urgent & Important', color: 'bg-red-500'},
        'schedule-tasks': { title: 'Not Urgent & Important', color: 'bg-blue-500'},
        'delegate-tasks': { title: 'Urgent & Not Important', color: 'bg-orange-500'},
        'eliminate-tasks': { title: 'Not Urgent & Not Important', color: 'bg-slate-500'},
        'uncategorized-tasks': { title: 'Uncategorized', color: 'bg-slate-400'}
    };

    // --- State Management (Local Storage) ---

    const saveState = () => {
        try {
            const tasks = [];
            document.querySelectorAll('.task-item').forEach(taskEl => {
                const text = taskEl.querySelector('.task-content-text').textContent;
                const deadline = taskEl.dataset.rawDeadline || '';
                const notesEl = taskEl.querySelector('.task-notes-text');
                const notes = notesEl ? notesEl.textContent : '';

                tasks.push({
                    id: taskEl.id,
                    text,
                    deadline,
                    notes,
                    containerId: taskEl.parentElement.id,
                });
            });
            const state = {
                tasks,
                nextId: taskIdCounter,
            };
            localStorage.setItem('eisenhowerMatrixState', JSON.stringify(state));
        } catch (error) {
            console.error("Error saving state to localStorage:", error);
        }
    };

    const loadState = () => {
        try {
            const stateJSON = localStorage.getItem('eisenhowerMatrixState');
            if (!stateJSON) return;

            const state = JSON.parse(stateJSON);
            
            if (!state || !Array.isArray(state.tasks)) {
                console.warn("Invalid or corrupted state found in localStorage. Clearing it.");
                localStorage.removeItem('eisenhowerMatrixState');
                return;
            }

            taskIdCounter = state.nextId || 0;
            
            state.tasks.forEach(taskData => {
                const container = document.getElementById(taskData.containerId);
                if (container) {
                    const taskElement = createTaskElement(taskData.text, taskData.deadline, taskData.id, taskData.notes);
                    container.appendChild(taskElement);
                    updateTaskColor(taskElement);
                }
            });
        } catch (error) {
            console.error("Error loading or parsing state from localStorage:", error);
            localStorage.removeItem('eisenhowerMatrixState');
        }
    };
    
    // --- Helper Functions ---
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00'); 
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // --- Task Element Functions ---

    const updateTaskColor = (taskItem) => {
        const containerId = taskItem.parentElement.id;
        const newColor = quadrantColors[containerId] || 'bg-white border-slate-300';
        
        taskItem.classList.remove(...colorClasses);
        taskItem.classList.add(...newColor.split(' '));
    };

    const createTaskElement = (taskText, deadline, taskId, notes) => {
        const taskItem = document.createElement('div');
        taskItem.id = taskId || `task-${taskIdCounter++}`;
        if (deadline) {
            taskItem.dataset.rawDeadline = deadline;
        }
        
        taskItem.className = `task-item p-3 rounded-lg shadow-sm flex justify-between items-start transition-colors duration-300 cursor-pointer`;
        taskItem.draggable = true;
        
        const formattedDeadline = formatDate(deadline);

        taskItem.innerHTML = `
            <div class="flex items-start gap-3 flex-grow min-w-0">
                <input type="checkbox" class="task-complete-checkbox h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0 mt-1" title="Mark as complete">
                <div class="flex flex-col min-w-0 flex-grow">
                    <span class="task-content-text font-medium text-slate-800 truncate">${taskText}</span>
                    ${formattedDeadline ? `<div class="task-deadline-text text-xs text-slate-600 mt-1">Due: ${formattedDeadline}</div>` : ''}
                    <div class="task-notes-container mt-2">
                        ${notes ? `<div class="task-notes-text text-xs text-slate-700 p-2 bg-slate-100 rounded">${notes}</div>` : '<div class="task-notes-placeholder text-xs text-slate-500">Add a note...</div>'}
                    </div>
                </div>
            </div>
            <span class="delete-btn text-2xl ml-2 hover:text-red-700 font-light flex-shrink-0" title="Delete task">×</span>
        `;

        const completeCheckbox = taskItem.querySelector('.task-complete-checkbox');
        const deleteBtn = taskItem.querySelector('.delete-btn');
        
        // --- Event Listeners ---
        completeCheckbox.addEventListener('change', () => {
            if (completeCheckbox.checked) {
                taskItem.classList.add('completed');
                taskItem.style.transition = 'opacity 0.4s ease, transform 0.4s ease, margin 0.4s ease, padding 0.4s ease, height 0.4s ease';
                taskItem.style.opacity = '0';
                taskItem.style.transform = 'scale(0.9)';
                taskItem.style.margin = '0';
                taskItem.style.padding = '0';
                setTimeout(() => {
                     taskItem.remove();
                     saveState();
                }, 400);
            }
        });

        taskItem.addEventListener('click', (e) => {
            // Prevent modal from opening if an interactive element was clicked
            const isInteractive = e.target.closest('.task-complete-checkbox, .delete-btn');
            if(isInteractive) return;
            showTaskDetails(taskItem);
        });

        taskItem.addEventListener('dragstart', (e) => {
            draggedItem = e.target.closest('.task-item');
            setTimeout(() => draggedItem.classList.add('dragging'), 0);
        });

        taskItem.addEventListener('dragend', () => {
            if(draggedItem) draggedItem.classList.remove('dragging');
            draggedItem = null;
        });

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            taskItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            taskItem.style.opacity = '0';
            taskItem.style.transform = 'scale(0.8)';
            setTimeout(() => {
                taskItem.remove();
                saveState();
            }, 300);
        });

        return taskItem;
    };

    // --- Form Submission ---
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        const deadline = deadlineInput.value;
        if (taskText !== '') {
            const newTask = createTaskElement(taskText, deadline, null, '');
            uncategorizedTasksContainer.appendChild(newTask);
            updateTaskColor(newTask);
            saveState();
            taskInput.value = '';
            deadlineInput.value = '';
            taskInput.focus();
        }
    });

    // --- Drag and Drop Listeners for Containers ---
    containers.forEach(container => {
        container.addEventListener('dragover', (e) => {
            e.preventDefault(); 
            container.classList.add('drag-over');
        });
        container.addEventListener('dragleave', () => container.classList.remove('drag-over'));
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            container.classList.remove('drag-over');
            if (draggedItem) {
                const afterElement = getDragAfterElement(container, e.clientY);
                container.insertBefore(draggedItem, afterElement);
                updateTaskColor(draggedItem);
                saveState();
            }
        });
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

     // --- Modal Functions ---
    const editModalField = (type) => {
        if (!currentEditingTask || document.querySelector('.modal-edit-input')) return;

        let modalElement, taskSelector, inputType, currentText;

        if (type === 'title') {
            modalElement = document.getElementById('modal-title');
            taskSelector = '.task-content-text';
            inputType = 'input';
            currentText = modalElement.textContent;
        } else if (type === 'deadline') {
            modalElement = document.getElementById('modal-deadline');
            taskSelector = '.task-deadline-text';
            inputType = 'date';
            currentText = currentEditingTask.dataset.rawDeadline || '';
        } else { // notes
            modalElement = document.getElementById('modal-notes');
            taskSelector = '.task-notes-text, .task-notes-placeholder';
            inputType = 'textarea';
            currentText = modalElement.textContent === 'No notes added.' ? '' : modalElement.textContent;
        }

        const inputElement = document.createElement(inputType === 'textarea' ? 'textarea' : 'input');
        inputElement.className = 'modal-edit-input'; // generic class for tracking
        
        if (inputType === 'date') {
            inputElement.type = 'date';
            inputElement.className += ' w-full p-1 border rounded text-slate-600';
        } else if (inputType === 'textarea') {
            inputElement.className += ' mt-1 text-slate-700 bg-slate-50 p-3 rounded-md min-h-[60px] w-full border border-blue-400 focus:outline-none';
            inputElement.rows = 4;
        } else {
            inputElement.type = 'text';
            inputElement.className += ' text-2xl font-bold text-slate-900 w-full p-1 border rounded';
        }
        
        inputElement.value = currentText;
        modalElement.style.display = 'none'; // Hide instead of replacing to preserve it
        modalElement.parentElement.insertBefore(inputElement, modalElement.nextSibling);
        inputElement.focus();

        const saveChanges = () => {
            const newValue = inputElement.value.trim();
            let taskElement = currentEditingTask.querySelector(taskSelector);

            if (type === 'title') {
                taskElement.textContent = newValue || currentText;
                modalElement.textContent = newValue || currentText;
            } else if (type === 'deadline') {
                if (newValue) {
                    currentEditingTask.dataset.rawDeadline = newValue;
                    const formatted = `Due: ${formatDate(newValue)}`;
                    modalElement.textContent = formatted;
                    if (taskElement) {
                        taskElement.textContent = formatted;
                    } else {
                        const newDeadlineEl = document.createElement('div');
                        newDeadlineEl.className = 'task-deadline-text text-xs text-slate-600 mt-1';
                        newDeadlineEl.textContent = formatted;
                        currentEditingTask.querySelector('.task-content-text').insertAdjacentElement('afterend', newDeadlineEl);
                    }
                } else {
                    delete currentEditingTask.dataset.rawDeadline;
                    modalElement.textContent = 'No deadline set';
                    taskElement?.remove();
                }
            } else { // Notes
                if (newValue) {
                    modalElement.textContent = newValue;
                    if (taskElement && taskElement.classList.contains('task-notes-text')) {
                        taskElement.textContent = newValue;
                    } else {
                        const newNotesEl = document.createElement('div');
                        newNotesEl.className = 'task-notes-text text-xs text-slate-700 p-2 bg-slate-100 rounded';
                        newNotesEl.textContent = newValue;
                        taskElement.replaceWith(newNotesEl);
                    }
                } else {
                    modalElement.textContent = 'No notes added.';
                    const newPlaceholder = document.createElement('div');
                    newPlaceholder.className = 'task-notes-placeholder text-xs text-slate-500';
                    newPlaceholder.textContent = 'Add a note...';
                    taskElement.replaceWith(newPlaceholder);
                }
            }
            
            inputElement.remove();
            modalElement.style.display = '';
            saveState();
        };

        inputElement.addEventListener('blur', saveChanges);
        inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (type !== 'notes' || e.ctrlKey)) inputElement.blur();
            if (e.key === 'Escape') { inputElement.value = currentText; inputElement.blur(); }
        });
    };

    const showTaskDetails = (taskItem) => {
        currentEditingTask = taskItem;
        const title = taskItem.querySelector('.task-content-text').textContent;
        const deadline = taskItem.querySelector('.task-deadline-text')?.textContent || 'No deadline set';
        const notesEl = taskItem.querySelector('.task-notes-text');
        const notes = (notesEl && notesEl.textContent) ? notesEl.textContent : 'No notes added.';
        const containerId = taskItem.parentElement.id;
        const details = quadrantDetails[containerId];

        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-deadline').textContent = deadline;
        document.getElementById('modal-notes').textContent = notes;
        document.getElementById('modal-quadrant').textContent = details.title;
        const indicator = document.getElementById('modal-quadrant-indicator');
        indicator.className = 'w-4 h-4 rounded-full mr-3 ' + details.color;

        modal.classList.remove('hidden');
        setTimeout(() => modalContent.style.transform = 'scale(1)', 10);
    };

    const hideModal = () => {
        const activeInput = document.querySelector('.modal-edit-input');
        if (activeInput) activeInput.blur(); // Save any pending edits
        currentEditingTask = null;
        modalContent.style.transform = 'scale(0.95)';
        setTimeout(() => modal.classList.add('hidden'), 200);
    };

    document.getElementById('modal-title').addEventListener('click', () => editModalField('title'));
    document.getElementById('modal-deadline').addEventListener('click', () => editModalField('deadline'));
    document.getElementById('modal-notes').addEventListener('click', () => editModalField('notes'));
    modalCloseBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.classList.contains('hidden')) hideModal(); });

    // --- Initial Load ---
    loadState();
});