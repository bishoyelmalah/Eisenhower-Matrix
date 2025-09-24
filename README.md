# Eisenhower Matrix Task Manager

A modern, interactive web application for organizing tasks using the Eisenhower Decision Matrix methodology. Built with vanilla HTML, CSS, and JavaScript with a clean, responsive design using Tailwind CSS.

## 🎯 What is the Eisenhower Matrix?

The Eisenhower Matrix, also known as the Urgent-Important Matrix, is a decision-making framework that helps you prioritize tasks by categorizing them into four quadrants:

- **Quadrant 1** (Red): **Urgent & Important** - Do First
- **Quadrant 2** (Blue): **Not Urgent & Important** - Schedule
- **Quadrant 3** (Orange): **Urgent & Not Important** - Delegate
- **Quadrant 4** (Gray): **Not Urgent & Not Important** - Eliminate

## ✨ Features

### Task Management
- ➕ **Add Tasks**: Create new tasks with optional deadlines
- 🎯 **Drag & Drop**: Easily move tasks between quadrants
- ✅ **Mark Complete**: Check off completed tasks with smooth animations
- 🗑️ **Delete Tasks**: Remove tasks you no longer need
- 💾 **Auto-Save**: All changes are automatically saved to local storage

### Task Details
- 📝 **Editable Notes**: Click on any task to add detailed notes
- 📅 **Deadline Management**: Set and edit task deadlines
- 🏷️ **Inline Editing**: Edit task titles, deadlines, and notes in a modal
- 🎨 **Color Coding**: Visual indicators for each quadrant

### User Experience
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean interface with smooth animations and transitions
- ⌨️ **Keyboard Support**: ESC to close modals, Enter to save edits
- 🔄 **Persistent Storage**: Your tasks are saved locally and restored on reload

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or build tools required!

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start organizing your tasks!

```bash
git clone https://github.com/bishoyelmalah/Eisenhower-Matrix.git
cd Eisenhower-Matrix
```

## 📁 Project Structure

```
Eisenhower Matrix/
├── index.html          # Main HTML file
├── styles.css          # Custom CSS styles
├── script.js           # JavaScript functionality
├── assets/
│   └── favicon.svg     # Project favicon
└── README.md           # This file
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Custom styles with modern features
- **JavaScript (ES6+)**: Interactive functionality and local storage
- **Tailwind CSS**: Utility-first CSS framework via CDN
- **Google Fonts**: Inter font family for clean typography

## 💡 How to Use

### Adding Tasks
1. Enter your task in the "Add a New Task" input field
2. Optionally set a deadline using the date picker
3. Click "Add Task" or press Enter
4. New tasks appear in the "New Tasks" section

### Organizing Tasks
1. **Drag and drop** tasks from the "New Tasks" section to the appropriate quadrant
2. **Move tasks** between quadrants by dragging them
3. **Click on any task** to open the detail modal and add notes

### Managing Tasks
- **Complete**: Check the checkbox to mark a task as complete (it will fade out and be removed)
- **Delete**: Hover over a task and click the "×" button to delete it
- **Edit**: Click on a task to open the modal where you can edit the title, deadline, and notes

### Quadrant Guidelines
- **🔴 Urgent & Important**: Crises, emergencies, deadline-driven projects
- **🔵 Not Urgent & Important**: Prevention, planning, personal development, relationship building
- **🟠 Urgent & Not Important**: Interruptions, some calls/emails, some meetings
- **⚪ Not Urgent & Not Important**: Time wasters, excessive TV, excessive internet, some phone calls

## 🎨 Customization

### Modifying Colors
The quadrant colors are defined in `styles.css` and can be easily customized:

```css
/* Quadrant color mappings in script.js */
const quadrantColors = {
    'do-tasks': 'bg-red-200 border-red-300',
    'schedule-tasks': 'bg-blue-200 border-blue-300',
    'delegate-tasks': 'bg-orange-200 border-orange-300',
    'eliminate-tasks': 'bg-slate-200 border-slate-300',
    'uncategorized-tasks': 'bg-white border-slate-300'
};
```

### Adding Features
The codebase is well-structured and commented, making it easy to add new features:
- Modify `script.js` for new functionality
- Update `styles.css` for visual changes
- Extend `index.html` for new UI elements

## 🔧 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices with:
- Touch-friendly drag and drop
- Responsive grid layout
- Mobile-optimized form inputs
- Proper viewport scaling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by Dwight D. Eisenhower's decision-making methodology
- Built with [Tailwind CSS](https://tailwindcss.com/) for styling
- Uses [Google Fonts](https://fonts.google.com/) Inter typeface
- Icons and design inspired by modern productivity applications

## 📧 Contact

Bishoy Elmalah - [@bishoyelmalah](https://github.com/bishoyelmalah)

Project Link: [https://github.com/bishoyelmalah/Eisenhower-Matrix](https://github.com/bishoyelmalah/Eisenhower-Matrix)

---

**Made with ❤️ for better productivity and task management**