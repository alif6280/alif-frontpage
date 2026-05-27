<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=KYAU%20Front%20Page%20Generator&fontSize=42&fontColor=fff&animation=twinkling&fontAlignY=32&desc=Academic%20Front%20Page%20Generator%20for%20KYAU%20CSE%20Students&descAlignY=55&descSize=16" width="100%"/>

<br/>

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.39.0-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)]()

<br/>

> **✨ Generate academic assignment front pages in seconds —**
> **with full support for all KYAU CSE Semesters, Courses, and Teachers**

<br/>

[🚀 Live Demo](#) &nbsp;•&nbsp; [📖 Documentation](#-installation) &nbsp;•&nbsp; [🐛 Report Bug](../../issues) &nbsp;•&nbsp; [✨ Request Feature](../../issues)

<br/>

</div>

---

## 📸 Preview

<div align="center">

| Landing Page | Generator | History |
|:-----------:|:---------:|:-------:|
| ![Landing](https://via.placeholder.com/280x160/6366f1/white?text=Landing+Page) | ![Generator](https://via.placeholder.com/280x160/8b5cf6/white?text=Generator) | ![History](https://via.placeholder.com/280x160/06b6d4/white?text=History) |

</div>

---

## 🌟 Features

<table>
<tr>
<td width="50%">

### 🎓 Academic Focused
- Full support for all **8 KYAU CSE Semesters**
- Auto-selection of all **Courses & Labs**
- **20+ Teachers** pre-loaded with designations
- **50 Batch** options available

</td>
<td width="50%">

### 📄 Export Options
- **PDF** download via jsPDF + html2canvas
- **DOCX** file export with docx.js
- **Live Preview** before generating
- Print-ready format output

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Auth & User System
- Secure authentication powered by **Supabase**
- Email & Password registration
- Password reset functionality
- Profile setup & settings page

</td>
<td width="50%">

### 🛠️ Admin Panel
- **Student Management**
- **Teacher Management**
- **Course & Template** Management
- Full Admin Dashboard

</td>
</tr>
<tr>
<td width="50%">

### 🌙 UI/UX
- **Dark / Light Mode** toggle
- Fully responsive design
- Smooth animations & transitions
- Toast notification system

</td>
<td width="50%">

### 📚 History
- All previously generated front pages saved
- Re-download anytime
- User-specific generation history

</td>
</tr>
</table>

---

## 🧰 Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router DOM v6 |
| **Styling** | Tailwind CSS 3, Custom Design Tokens |
| **Backend / Auth** | Supabase (Auth + PostgreSQL) |
| **PDF Export** | jsPDF + html2canvas |
| **DOCX Export** | docx.js |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |
| **Utilities** | clsx |

</div>

---

## 📁 Project Structure

```
kyau-frontpage-generator/
├── 📂 public/
├── 📂 src/
│   ├── 📂 components/
│   │   ├── FrontPagePreview.jsx     # Live preview component
│   │   ├── 📂 layout/
│   │   │   └── Navbar.jsx
│   │   └── 📂 ui/
│   │       └── index.jsx            # Reusable UI components
│   │
│   ├── 📂 data/
│   │   └── courses.js               # KYAU CSE — Semesters, Courses, Teachers
│   │
│   ├── 📂 hooks/
│   │   ├── useAuth.jsx              # Auth context & hook
│   │   └── useTheme.jsx             # Dark/Light mode hook
│   │
│   ├── 📂 lib/
│   │   ├── export.js                # PDF & DOCX export logic
│   │   └── supabase.js              # Supabase client setup
│   │
│   ├── 📂 pages/
│   │   ├── LandingPage.jsx
│   │   ├── GeneratorPage.jsx        # Main front page generator
│   │   ├── HistoryPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── ProfileSetupPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── AuthCallbackPage.jsx
│   │   └── 📂 admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminCourses.jsx
│   │       ├── AdminStudents.jsx
│   │       ├── AdminTeachers.jsx
│   │       └── AdminTemplates.jsx
│   │
│   ├── App.jsx
│   ├── index.js
│   └── index.css
│
├── package.json
├── tailwind.config.js
└── README.md
```

---

## ⚙️ Installation

### Prerequisites

```bash
node >= 16.x
npm >= 8.x
```

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/kyau-frontpage-generator.git
cd kyau-frontpage-generator
```

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Setup Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> 🔑 Get your Supabase URL and Anon Key from [supabase.com](https://supabase.com) → Your Project → Settings → API

### Step 4 — Run the App

```bash
npm start
```

App will be running at → **http://localhost:3000** 🚀

---

## 🗄️ Supabase Setup

Run the following SQL in your Supabase SQL Editor:

```sql
-- User profiles table
create table profiles (
  id uuid references auth.users on delete cascade,
  full_name text,
  student_id text,
  batch text,
  avatar_url text,
  is_admin boolean default false,
  primary key (id)
);

-- Front page generation history
create table front_pages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  data jsonb,
  created_at timestamp with time zone default now()
);
```

---

## 🚀 Build for Production

```bash
npm run build
```

Production-ready files will be generated in the `build/` folder. You can deploy to any static hosting platform (Vercel, Netlify, GitHub Pages).

---

## 📦 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

> ⚠️ Make sure to add your Environment Variables in Vercel → Project Settings → Environment Variables.

---

## 🤝 Contributing

Contributions are always welcome! 🎉

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m 'Add some AmazingFeature'

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

---

## 🗺️ Roadmap

- [ ] 📱 Mobile-optimized PDF export
- [ ] 🖼️ Custom logo / image upload
- [ ] 📧 Email notification on generation
- [ ] 🌐 Multi-university support
- [x] ✅ Dark mode
- [x] ✅ DOCX export
- [x] ✅ Generation history

---

## 👨‍💻 Author

<div align="center">

**Made by MD. Montasir Monir Alif**

[![GitHub](https://img.shields.io/badge/GitHub-alif6280-181717?style=for-the-badge&logo=github)](https://github.com/alif6280)

</div>

---

## 📄 License

```
MIT License — feel free to use, modify, and distribute.
```

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

**⭐ If this project helped you, please consider giving it a star!**

</div>
