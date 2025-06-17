# PM Template Generator CLI

**Interactive CLI tool for intelligent PM template generation and project setup**

## 🚀 Features

- **Interactive Project Assessment** - Intelligent questionnaire to understand your project needs
- **AI-Powered Methodology Recommendation** - Smart algorithm recommends the best PM methodology
- **Template Customization** - Automatically customizes templates with your project information
- **Project Structure Generation** - Creates organized directory structure for your methodology
- **Industry-Specific Guidance** - Tailored recommendations for different industries
- **Multi-Platform Support** - Works on Windows, macOS, and Linux

## 🎯 Business Value

- **70% reduction** in project setup time
- **Standardized template** application across teams
- **Easier adoption** for non-technical users
- **Intelligent recommendations** based on project characteristics

## 📋 Prerequisites

- **Node.js** 16.0.0 or higher
- **npm** or **yarn** package manager

## 🔧 Installation

### Option 1: Local Development
```bash
# Clone the repository
git clone https://github.com/mirichard/pm-tools-templates.git
cd pm-tools-templates/tools/template-generator-cli

# Install dependencies
npm install

# Run the CLI
npm start
```

### Option 2: Global Installation (Future)
```bash
# Will be available when published to npm
npm install -g pm-template-generator
pm-template generate
```

## 🎪 Usage

### Interactive Mode (Recommended)
```bash
# Start interactive assessment
npm start

# Or specify the command explicitly
npm start generate
```

### List Available Templates
```bash
npm start list
```

## 🧠 How It Works

### 1. Project Assessment
The CLI asks intelligent questions about:
- Project name and industry
- Team size and experience level
- Project duration and complexity
- Expected change frequency
- Stakeholder types involved

### 2. AI-Powered Recommendation
The recommendation engine analyzes your answers using weighted scoring:
- **Change Frequency** (30% weight) - How often requirements change
- **Complexity** (25% weight) - Project complexity level
- **Team Size** (20% weight) - Size of your team
- **Duration** (15% weight) - Project timeline
- **Industry** (10% weight) - Industry-specific factors

### 3. Template Generation
Based on the recommendation, the CLI:
- Creates project directory structure
- Copies relevant templates
- Customizes templates with your project information
- Generates setup instructions and README

## 📊 Supported Methodologies

### Agile/Scrum
**Best for:**
- Frequently changing requirements
- Small to medium teams (1-20 people)
- Software development projects
- Innovation and research projects

**Templates included:**
- Product backlog template
- Sprint planning template
- Sprint retrospective template
- User story template

### Traditional/Waterfall (PMBOK)
**Best for:**
- Stable, well-defined requirements
- Large teams (20+ people)
- Construction and regulated industries
- Long-duration projects (1+ years)

**Templates included:**
- Project charter template
- Project management plan template
- Work breakdown structure template
- Status report template

### Hybrid
**Best for:**
- Mixed project characteristics
- Medium complexity projects
- Diverse stakeholder groups
- Organizations transitioning between methodologies

**Templates included:**
- Hybrid project charter template
- Hybrid release planning template
- Integrated change strategy template
- Progressive acceptance plan template

## 🏭 Industry Support

The CLI provides specialized recommendations for:

- **🏗️ Construction** - Regulatory compliance, inspection checkpoints
- **💰 Financial Services** - SOX compliance, security requirements
- **🏥 Healthcare/Pharmaceutical** - FDA compliance, validation activities
- **💻 Information Technology** - System integration, cybersecurity
- **⚡ Software Development** - CI/CD, agile practices
- **🌐 General/Other** - Universal best practices

## 📁 Generated Project Structure

```
your-project/
├── templates/          # Customized PM templates
├── docs/              # Project documentation
├── planning/          # Planning documents
├── reports/           # Status and progress reports
├── meetings/          # Meeting notes and agendas
├── [methodology-specific folders]
└── README.md          # Project overview and next steps
```

## 🎯 Example Output

```
┌─────────────────────────────────────────────────────────────┐
│               PM Template Generator CLI                     │
│         Intelligent Project Setup Automation               │
└─────────────────────────────────────────────────────────────┘

🚀 Let's set up your project with the perfect templates!

? What is your project name? E-commerce Platform
? What industry is this project for? Software Development
? What is your team size? Medium (6-20 people)
? What is your project duration? Medium (3-12 months)
? How complex is your project? Complex - Many unknowns, high risk

📊 Assessment Results:
Project: E-commerce Platform
Industry: software_development
Team Size: medium
Complexity: complex

🎯 Recommended Methodology: AGILE
Confidence: 87%
Reasoning: high change frequency suits iterative development, industry strongly benefits from agile practices, complex projects benefit from iterative discovery

✅ Project setup complete!
📁 Project created at: ./e-commerce-platform
📋 See e-commerce-platform/README.md for next steps
```

## 🔧 Development

### Project Structure
```
tools/template-generator-cli/
├── src/
│   ├── index.js          # Main CLI entry point
│   ├── recommender.js    # Methodology recommendation engine
│   └── generator.js      # Template generation and customization
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

### Key Components

1. **Interactive Assessment (`index.js`)**
   - Command-line interface using Inquirer.js
   - Project questionnaire and user interaction
   - Results display and confirmation

2. **Recommendation Engine (`recommender.js`)**
   - Weighted scoring algorithm
   - Methodology-specific scoring functions
   - Reasoning generation

3. **Template Generator (`generator.js`)**
   - Project structure creation
   - Template copying and customization
   - Documentation generation

### Adding New Features

1. **New Methodology Support:**
   - Add scoring function in `recommender.js`
   - Add template mapping in `generator.js`
   - Update base templates array

2. **New Industry Support:**
   - Add industry scoring in recommendation engine
   - Add industry-specific instructions in generator
   - Create industry template variants

3. **New Assessment Questions:**
   - Add questions to `index.js` assessment prompt
   - Update recommendation scoring to use new data
   - Add reasoning logic for new factors

## 🧪 Testing

```bash
# Run the CLI in development mode
npm run dev

# Test with different project scenarios
# - Small agile software project
# - Large traditional construction project
# - Medium hybrid IT project
```

## 📈 Success Metrics

### Target Goals
- **70% reduction** in project setup time
- **Support for 5+ industries** with specialized templates
- **95% user satisfaction** in beta testing
- **1000+ downloads** in first month after npm publication

### Current Status
- ✅ Interactive assessment questionnaire
- ✅ AI-powered methodology recommendation engine
- ✅ Template customization and generation
- ✅ Project structure creation
- ✅ Multi-industry support
- 🔄 Beta testing in progress
- ⏳ npm package publication pending

## 🤝 Contributing

This CLI tool is part of the PM Tools Templates repository. To contribute:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/new-feature`)
3. **Make your changes** in the `tools/template-generator-cli/` directory
4. **Test thoroughly** with different project scenarios
5. **Submit a pull request** with detailed description

## 📄 License

MIT License - see the main repository LICENSE file for details.

## 🆘 Support

- **Issues:** [GitHub Issues](https://github.com/mirichard/pm-tools-templates/issues)
- **Documentation:** [Main Repository](https://github.com/mirichard/pm-tools-templates)
- **Templates:** Browse the repository for available templates

---

**Generated by PM Template Generator CLI - Making project setup intelligent and effortless! 🚀**

