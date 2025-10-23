# 🖥️ Interactive OS Learning Toolkit (OS-Lab-Assistant)

A one-stop simulator for learning Operating System concepts through interactive experiments.  
This toolkit helps users run simulations for:
- CPU Scheduling
- Page Replacement
- Disk Scheduling

## 📂 Project Structure

```
OS-Lab-Assistant/
│
├── cpu_scheduling/       # CPU scheduling algorithms (Sonali)
├── page_replacement/     # Page replacement algorithms (Kunal)
├── disk_scheduling/      # Disk scheduling algorithms (Krishna)
├── main.py               # Entry point to run the project
├── requirements.txt      # Python dependencies
├── README.md             # Documentation
└── .gitignore            # Ignore unnecessary files
```

## 🚀 How to Run 

1. Clone this repository:
   ```bash
   git clone https://github.com/<your-username>/OS-Lab-Assistant.git
   cd OS-Lab-Assistant
   ```

2. Create & activate virtual environment:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the project:
   ```bash
   python main.py
   ```

## 👨‍💻 Contributors
- Sonali → CPU Scheduling
- Kunal → Page Replacement
- Krishna → Disk Scheduling

## 🎯 Roadmap
- **Phase 1**: Console-based backend with working algorithms and visualizations.
- **Phase 2**: Convert into APIs + add improved graphs/animations.
- **Phase 3**: Build full web app with React frontend + FastAPI backend.

## 📜 License
Open-source project for learning purposes.