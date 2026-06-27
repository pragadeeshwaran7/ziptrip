# Ziptrrip Tech Assessment Solutions

This repository contains the completed code and documentation for Challenge 1 and Challenge 2 of the Ziptrrip technical assessment.

---

## Repository Structure

```
/
├── README.md                     # Main documentation and run guide
├── challenge1/                   # Answers for Challenge 1
│   ├── q1_pattern.js             # Question 1: Pattern printing
│   ├── q2_reverse_string.js      # Question 2: String reversal
│   ├── q3_remove_duplicates.js   # Question 3: Duplicate removal
│   ├── q4_selectors.md           # Question 4: CSS selectors analysis
│   ├── q5_three_boxes.html       # Question 5: HTML layout wrapper
│   └── q5_three_boxes.css        # Question 5: CSS layouts stylesheet
└── challenge2/                   # Challenge 2: Multi-Page Todo App
    ├── vercel.json               # Vercel deployment and routing rules
    ├── backend/                  # Express.js server
    │   ├── data/
    │   │   └── todos.json        # Database persistence file
    │   ├── package.json
    │   └── server.js             # REST API endpoint handlers
    └── frontend/                 # React.js client
        ├── index.html            # Dashboard HTML entrypoint
        ├── todo.html             # Detail page HTML entrypoint
        ├── vite.config.js        # Vite multi-page configuration
        ├── package.json
        └── src/
            ├── App.jsx           # Main dashboard React application
            ├── TodoDetailApp.jsx # Task detail view React application
            ├── main.jsx          # Dashboard mounting script
            ├── todo.jsx          # Detail page mounting script
            └── css/
                └── styles.css    # Premium glassmorphic styling
```

---

## Live Vercel Deployment

Challenge 2 has been successfully published to Vercel and is fully operational online:
👉 **[Infinity Todo on Vercel](https://challenge2-woad.vercel.app/)**

### Serverless Architecture Highlights:
*   **Vite React Frontend**: Statically built and served via Vercel's Edge Network for high performance.
*   **Express API Function**: Hosted as an auto-scaling Node.js Serverless Function mapping `/api/*` requests to the Express server.
*   *Note on Serverless Storage*: Because serverless containers are ephemeral (stateless), any changes written to the local file database `todos.json` are temporary and will reset during scale-up/scale-down cycles or container cold starts. In a production system, this backend is designed to be easily swapped with a persistent database service like MongoDB or PostgreSQL.

---

## Challenge 1: Answer Key & Explanations

### Question 1: Pattern Printing (`/challenge1/q1_pattern.js`)
Prints the decreasing triangle pattern up to `n`. It accommodates three common interpretations:
*   **Interpretation A (Descending to 1)**: For row $i$, print digits $i \dots 1$. (e.g., Row 5 = `54321`).
*   **Interpretation B (Last Row Repeated)**: Row $1 \dots n-1$ are descending, while the last row is digit $n$ repeated $n$ times (literal reading of `nnnnn(n times)`).
*   **Interpretation C (Number Repeated)**: Row $i$ is digit $i$ repeated $i$ times.

**Implementations Provided**:
1.  *Traditional Nested Loops*: Iterative construction of rows.
2.  *Functional Mapping*: Built utilizing `Array.from()` and `.map()`.
3.  *Recursion*: Dynamic row generation via recursive functions.

*Run command:* `node challenge1/q1_pattern.js`

### Question 2: String Reversal (`/challenge1/q2_reverse_string.js`)
Reverses characters of the string `"Bhaskara"` to output `"araksahB"`.

**Implementations Provided**:
1.  *Standard Array methods*: `.split('').reverse().join('')`.
2.  *Iterative Prepend loop*: Prepends characters sequentially into an accumulator.
3.  *Iterative Decrementing loop*: Appends characters by crawling from index `length - 1` down to `0`.
4.  *Functional Array.reduce*: Combines splitting with reduction logic.
5.  *Recursion*: Reverses string by calling itself on the substring slice.
6.  *Pointer Swap (In-place)*: Splits into an array and swaps letters using two converging pointers.

*Run command:* `node challenge1/q2_reverse_string.js`

### Question 3: Removing Array Duplicates (`/challenge1/q3_remove_duplicates.js`)
Filters out duplicates from `[ 1, 2, 3, 6, 4, 3, 7, 4, 2, 6, 8, 2, 5, 9, 0, 1 ]` to output `[ 1, 2, 3, 6, 4, 7, 8, 5, 9, 0 ]` while keeping order.

**Implementations Provided**:
1.  *ES6 Set Constructor*: `[...new Set(arr)]` (Cleanest & fastest).
2.  *Filter and indexOf*: Filter checks if current index matches `indexOf(item)` first occurrence.
3.  *Reduce and includes*: Accumulates items, skipping if already included.
4.  *Lookup Object (Hash table)*: Checks existence in $O(1)$ lookup cache.
5.  *ES6 Map*: Maps keys to preserve types and order.

*Run command:* `node challenge1/q3_remove_duplicates.js`

### Question 4: CSS Selectors Analysis (`/challenge1/q4_selectors.md`)
Full line selection breakdowns and rationale for selectors `.box`, `div .box`, `div.box`, `[class]`, `#container .box`, and `#container > .box`. Refer to the file for extensive answers.

### Question 5: Three-Column Layout (`/challenge1/q5_three_boxes.html`, `/challenge1/q5_three_boxes.css`)
Layout rendering of three columns inside a responsive container. The left and right boxes are fixed at `100px`, and the middle box stretches to absorb the remaining width dynamically without overlap.

**CSS Layout Methods Provided**:
1.  *CSS Flexbox*: Uses `display: flex` with `flex-shrink: 0` on sidebars and `flex-grow: 1` on the center element.
2.  *CSS Grid*: Uses `display: grid` with `grid-template-columns: 100px 1fr 100px;`.
3.  *Absolute Positioning*: Uses `position: relative` on container, `position: absolute` on outer sides, and `margin: 0 108px` on the static middle box to prevent overlap.
4.  *Floats with Calc*: Uses floats (`float: left`/`right`) and calculates width using `width: calc(100% - 216px)` on the middle floated box.

*Preview:* Open `challenge1/q5_three_boxes.html` in any web browser.

---

## Challenge 2: Multi-Page Todo Application

This is a multi-page React application hosted on an Express.js backend. Instead of utilizing client-side SPA routing (which keeps one page loaded), Vite is configured to compile two distinct entry HTML files (`index.html` and `todo.html`). Clicking on a task redirects the user to `/todo.html?id=ID`, provoking a real browser-level full page load.

### Key Features

#### 1. Dashboard Page (`index.html`)
*   **Progress Dashboard**: Circular SVG completion ring measuring the percentage of tasks completed, combined with a breakdown of active, completed, and total tasks.
*   **Search Engine**: Real-time filtering matching queries in either the task title or description.
*   **Filter Matrix**: Filter tasks dynamically by status (All, Active, Completed), by priority (Low, Medium, High), and by dynamic tag categories.
*   **Sort Options**: Sort tasks by Date Created, Due Date, Priority (High first), or Alphabetically. Toggling changes direction (ascending/descending).
*   **Quick Create Task**: Revealing glassmorphic form to set Titles, Descriptions, Priorities, Due Dates, and Categories.
*   **Inline Editor**: Instantly edit Title, Description, Priority, Due Date, and Category directly on the card without switching screens.
*   **Overdue Tracker**: Highlights tasks that are active but past their due date with flashing red tags.
*   **Status Toggles**: Toggle completion status directly from the dashboard card.

#### 2. Detailed Task Page (`todo.html?id=ID`)
*   **Subtasks Checklist**: Complete checklist tracker. Add subtasks, check them off (crosses them out), or delete them. Updates the database immediately.
*   **Timestamped Notes Log**: Discussion panel where notes/reminders can be left. Each note is saved with a creation timestamp and can be removed individually.
*   **Full Editor**: Full-page editor form to update all task metadata.
*   **Status Toggles & Removal**: Complete/activate task directly on this page, or delete it (which redirects back to dashboard).

#### 3. Backend REST API
*   `GET /api/todos`: Fetches tasks list. Processes query requests for searching, filtering, and sorting before responding.
*   `GET /api/todos/:id`: Fetches a single todo item's full JSON structure (including notes/subtasks).
*   `POST /api/todos`: Creates a task with validations and initializes attributes.
*   `PUT /api/todos/:id`: Updates todo records (subtasks, notes, or details) and updates the modification timestamp.
*   `DELETE /api/todos/:id`: Deletes task.
*   **Persistence**: Automatically loads from and updates `/challenge2/backend/data/todos.json`.

---

## Installation & Setup Instructions

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Launch the Backend API Server
Navigate to the backend folder, install dependencies, and start the development server:
```bash
cd challenge2/backend
npm install
npm run dev
```
The server will boot up and listen on **port 5000**:
`Backend server is running on port 5000`

### 2. Launch the Frontend Dev Server
In a new terminal window, navigate to the frontend folder, install dependencies, and start Vite:
```bash
cd challenge2/frontend
npm install
npm run dev
```
The client dev server will launch on **port 5173** (or the next available port):
`  ➜  Local:   http://localhost:5173/`

### 3. Usage
Open `http://localhost:5173/` in your browser. All API requests are proxied automatically from Vite to the Express backend.

---

## Technology Choice & Aesthetics
*   **React (v18)**: Powering component rendering and state management.
*   **Vite**: Providing ultra-fast bundler builds for multi-page routing.
*   **Express & fs/promises**: Delivering RESTful interfaces and robust data persistence in JSON.
*   **Vanilla CSS**: Used to design a dark UI with custom HSL variables, glassmorphic cards (`backdrop-filter`), glowing button states, and smooth transition animations.
