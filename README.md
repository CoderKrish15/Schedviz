# SchedViz - CPU Scheduling Algorithm Visualizer

A modern, interactive web application for visualizing and comparing CPU scheduling algorithms. Built with **React, Vite, and Tailwind CSS**, SchedViz provides real-time animated Gantt charts and detailed performance metrics.

---

## Features

### Supported Algorithms

* **FCFS** (First Come First Serve)
* **SJF** (Shortest Job First)

  * Preemptive
  * Non-preemptive
* **SRTF** (Shortest Remaining Time First)
* **Round Robin** (with configurable time quantum)

---

### Interactive Visualization

* Animated Gantt Charts (real-time execution)
* Ready Queue Visualization
* Add / Edit / Delete Processes
* Performance Metrics:

  * Turnaround Time
  * Waiting Time
  * Response Time

---

### Comparison Tools

* Side-by-side algorithm comparison
* Performance charts
* Export results (future enhancement)

---

## Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn

---

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project folder
cd Schedviz

# Install dependencies
npm install
```

---

### Run the Project

```bash
npm run dev
```

Open your browser and go to:

```
http://localhost:5173
```

---

### Build for Production

```bash
npm run build
```

Output will be available in the `dist/` folder.

---

## Usage Guide

### Basic Workflow

1. **Configure Processes**

   * PID
   * Arrival Time
   * Burst Time
   * Priority

2. **Select Algorithm**

   * Choose from FCFS, SJF, SRTF, Round Robin

3. **Adjust Settings**

   * Time quantum (RR)
   * Preemptive toggle (SJF)
   * Animation speed

4. **Run Visualization**

   * Click **Run Algorithm**

5. **Analyze Results**

   * Gantt chart
   * Metrics
   * Comparison graphs

---

### Advanced Features

* Compare multiple algorithms simultaneously
* Save & load process sets
* Control animations (play/pause/reset)
* Real-time metrics tracking

---

## Project Structure

```
src/
  components/
    Header.jsx
    ProcessTable.jsx
    AlgorithmConfig.jsx
    GanttChart.jsx
    ReadyQueue.jsx
    StatsTable.jsx
    CompareChart.jsx

  algorithms/
    fcfs.js
    sjf.js
    rr.js
    index.js

  hooks/
    useScheduler.js
    useAnimation.js

  assets/
  App.jsx
  main.jsx
  index.css
```

---

## Tech Stack

* React 19
* Vite 6
* Tailwind CSS 4
* JavaScript (ES6+)

---

## Contributing

1. Fork the repo
2. Create a new branch

   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit changes

   ```bash
   git commit -m "Add new feature"
   ```
4. Push to GitHub

   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License**.

---

## Educational Purpose

SchedViz is designed for:

*  Students learning Operating Systems
*  Teachers explaining scheduling algorithms
*  Developers exploring visualization tools

---

## Future Enhancements

*  Priority Scheduling
*  Multilevel Queue Scheduling
*  Chart Export Feature
*  Dark Mode
*  Mobile Responsiveness 
*  TypeScript Migration
*  Unit & Integration Testing

---

#Support

If you like this project, consider giving it a ⭐ on GitHub!

