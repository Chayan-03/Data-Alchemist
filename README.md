<<<<<<< HEAD
# 🧪 Data Alchemist

A smart Next.js web application that transforms messy Excel/CSV data into clean, validated datasets with AI-powered rules and validation.

## 🚀 Features

### ✅ Core Features
- **File Upload & Parsing**: Accept CSV/Excel files for clients, workers, and tasks
- **Editable Grid**: Edit data directly in tables with live validation
- **Smart Validation**: 8+ validation types including missing data, duplicates, malformed data, and more
- **Rules Builder**: Create business rules for co-run tasks, slot restrictions, load limits
- **Prioritization Interface**: Configure priority weights with sliders and templates
- **Export System**: Download cleaned CSV/Excel files plus rules.json configuration

### 🧠 AI Features
- **Natural Language Search**: "show tasks with Duration > 2"
- **Smart Data Processing**: AI-powered data cleaning suggestions
- **Rule Recommendations**: Intelligent business rule suggestions
- **Validation Insights**: AI-driven error analysis and fixes

### 🎛️ Advanced Features
- **Live Data Editing**: Click any cell to edit with instant validation
- **Multi-file Support**: Handle multiple data files simultaneously
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Validation**: See errors as you type
- **Export Flexibility**: Multiple formats (CSV, Excel, JSON)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Animations**: Framer Motion
- **File Processing**: XLSX, PapaParse
- **UI Components**: Lucide React icons
- **State Management**: React hooks

## 📁 Project Structure

```
data-alchemist/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application
├── components/            # React components
│   ├── DataGrid.tsx       # Editable data table
│   ├── FileUpload.tsx     # File upload interface
│   ├── ValidationPanel.tsx # Error display
│   ├── RulesBuilder.tsx   # Business rules creator
│   ├── PrioritizationInterface.tsx # Priority settings
│   ├── ExportPanel.tsx    # Export functionality
│   └── NaturalLanguageSearch.tsx # AI search
├── types/                 # TypeScript definitions
├── utils/                 # Utility functions
├── samples/               # Sample data files
└── README.md
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd data-alchemist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Sample Data

The `/samples` directory contains example files:
- `clients.csv` - Client information with priorities and budgets
- `workers.csv` - Worker skills and availability
- `tasks.csv` - Task requirements and assignments

## 🎯 Usage Guide

### 1. Upload Data
- Drag & drop CSV/Excel files or click to browse
- Supports clients, workers, and tasks data
- Files are automatically parsed and validated

### 2. Edit & Validate
- Click any cell to edit data inline
- See validation errors highlighted in real-time
- Use natural language search: "show high priority tasks"

### 3. Create Rules
- Build business rules for task co-running
- Set slot restrictions and load limits
- Configure phase restrictions and regex filters

### 4. Set Priorities
- Use sliders to weight different factors
- Choose from preset templates or create custom weights
- Balance priority, fairness, efficiency, and resource utilization

### 5. Export Clean Data
- Download cleaned CSV/Excel files
- Get rules.json with all configurations
- Include validation reports and original data

## 🔧 Validation Types

1. **Missing Columns**: Required fields for each file type
2. **Duplicate IDs**: Ensures unique identifiers
3. **Malformed Data**: Invalid emails, JSON, etc.
4. **Out-of-range Values**: Priority levels, durations, budgets
5. **Unknown References**: Missing client/task IDs
6. **Conflicting Rules**: Circular dependencies
7. **Phase-slot Saturation**: Resource allocation issues
8. **Skill Coverage**: Required skills availability

## 🎨 Design Features

- **Apple-level Design**: Clean, intuitive interface
- **Responsive Layout**: Works on all screen sizes
- **Smooth Animations**: Framer Motion transitions
- **Accessible**: WCAG compliant design
- **Dark/Light Themes**: Automatic theme detection

## 🚀 Deployment

The app is ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Any Node.js hosting platform**

## 📈 Performance

- **Fast Loading**: Optimized bundle size
- **Efficient Parsing**: Streaming file processing
- **Memory Management**: Large file handling
- **Caching**: Smart data caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Internship Project Goals

This project demonstrates:
- ✅ Full-stack Next.js development
- ✅ TypeScript proficiency
- ✅ Complex state management
- ✅ File processing and validation
- ✅ UI/UX design skills
- ✅ AI integration concepts
- ✅ Production-ready code quality

---

Built with ❤️ for data transformation and workflow optimization.
=======
# Data-Alchemist
>>>>>>> 58069c2fd9d249d9094fbc6cabcfd9450f79b16a
