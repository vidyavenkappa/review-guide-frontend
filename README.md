<<<<<<< HEAD
# **📚 AI Research Paper Evaluator**
An **AI-powered application** that analyzes research papers and provides **structured evaluations** using **Google Gemini AI**.  

✅ **Backend:** FastAPI (Python)  
✅ **Frontend:** React (Material UI)  
✅ **AI Model:** Google Gemini API  
✅ **Deployment:** Render (Backend) + Vercel (Frontend)  

---

## **📌 Features**
✔ **Upload Research Papers (PDFs)**  
✔ **AI Evaluation & Scoring** (Originality, Clarity, Impact, etc.)  
✔ **Chat-style UI for a modern feel**  
✔ **Fully responsive & user-friendly**  
✔ **Deployed using Render & Vercel**  

---

# **🚀 Backend (FastAPI)**
### **1️⃣ Installation & Setup**
#### **🔹 Clone the Repository**
```bash
git clone https://github.com/vidyavenkappa/fastapi-research-evaluator.git
cd fastapi-research-evaluator
```

#### **🔹 Create a Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
```

#### **🔹 Install Dependencies**
```bash
pip install -r requirements.txt
```

#### **🔹 Create a `.env` File**
Inside the project directory, create a **`.env`** file:
```
GEMINI_API_KEY=your-google-gemini-api-key
```

#### **🔹 Run the FastAPI Server**
```bash
uvicorn main:app --reload
```
📌 **Backend will be available at:**  
```
http://127.0.0.1:8000
```

#### **🔹 Test API in Swagger UI**
Visit:
```
http://127.0.0.1:8000/docs
```

---

### **2️⃣ API Endpoints**
| Method | Endpoint       | Description |
|--------|---------------|-------------|
| POST   | `/upload/`    | Uploads a research paper (PDF) and evaluates it using Gemini AI |
| GET    | `/docs`       | Opens Swagger UI |

---

### **3️⃣ Deploy Backend on Render**
1. **Push your code to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```
2. **Go to [Render](https://render.com/)** → **New Web Service**  
3. **Connect GitHub repo** → Select **`fastapi-research-evaluator`**  
4. **Set Build Command:**
   ```bash
   pip install -r requirements.txt
   ```
5. **Set Start Command:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
6. **Add Environment Variable:**
   - `GEMINI_API_KEY` → Your Google Gemini API Key  
7. **Click Deploy!** 🎉  

📌 **Backend will be live at:**  
```
https://fastapi-research-evaluator.onrender.com
```

---

# **🎨 Frontend (React)**
### **1️⃣ Installation & Setup**
#### **🔹 Clone the Frontend Repo**
```bash
git clone https://github.com/vidyavenkappa/review-guide-frontend.git
cd react-research-evaluator
```

#### **🔹 Install Dependencies**
```bash
npm install
```

#### **🔹 Update API URL in `App.js`**
Modify `API_BASE_URL` in `App.js` to use the **live backend URL**:
```javascript
const API_BASE_URL = "https://fastapi-research-evaluator.onrender.com"; // Replace with Render API URL
```

#### **🔹 Run React App Locally**
```bash
npm start
```
📌 **Frontend will be available at:**  
```
http://localhost:3000
```

---

### **2️⃣ Deploy Frontend on Vercel**
1. Install **Vercel CLI**:
   ```bash
   npm install -g vercel
   ```
2. Login to **Vercel**:
   ```bash
   vercel login
   ```
3. Deploy React:
   ```bash
   vercel
   ```
4. **Get your frontend URL (e.g., `https://review-guide-frontend.vercel.app`)**

📌 **Now your React frontend is live! 🎯**

---

# **🎯 Final Steps**
- **Visit Frontend URL** (`https://review-guide-frontend.vercel.app`)
- **Upload a research paper** and verify AI evaluation works!
- **Test API in Swagger UI** (`https://fastapi-research-evaluator.onrender.com/docs`)

---

# **🛠 Tech Stack**
🔹 **Frontend:** React, Material UI  
🔹 **Backend:** FastAPI (Python), Google Gemini AI  
🔹 **Database:** (Optional) Can integrate PostgreSQL, Firebase, or MongoDB  
🔹 **Hosting:** Render (Backend) + Vercel (Frontend)  

---

# **🤝 Contributing**
Want to improve this project?  
1. **Fork the repo**  
2. **Create a new branch** (`feature-branch`)  
3. **Commit changes** (`git commit -m "Added new feature"`)  
4. **Push changes** (`git push origin feature-branch`)  
5. **Create a Pull Request!** 🎉  

---

# **📄 License**
This project is **open-source** under the **MIT License**.

---

## 🎉 **Now Your AI Research Evaluator is Fully Deployed! 🚀**
Let me know if you need **additional features or improvements!** 😊
=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
>>>>>>> 4a0311d (Initial commit - Uploaded React frontend)
