/* ─── Static KYAU CSE data ─────────────────────────────────────── */

export const SEMESTERS = [
  "1st Year 1st Semester",
  "1st Year 2nd Semester",
  "2nd Year 1st Semester",
  "2nd Year 2nd Semester",
  "3rd Year 1st Semester",
  "3rd Year 2nd Semester",
  "4th Year 1st Semester",
  "4th Year 2nd Semester",
];

export const BATCHES = Array.from({ length: 50 }, (_, i) => {
  const n = i + 1;
  const s = n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th';
  return `${n}${s} Batch`;
});

export const TEACHERS = [
  { code:"GGF",  name:"Mohammad Gazi Golam Faruque",       designation:"Asst. Prof. & Head of CSE" },
  { code:"TI",   name:"Md. Tarequl Islam",                  designation:"Asst. Prof. & Program Coordinator" },
  { code:"PM",   name:"Prince Mahmud",                      designation:"Lecturer" },
  { code:"HU",   name:"A. Hasib Uddin",                     designation:"Lecturer on Probation" },
  { code:"RA",   name:"Rokeya Akter",                       designation:"Lecturer on Probation" },
  { code:"AR",   name:"Abu Raihan",                         designation:"Lecturer on Probation" },
  { code:"IZR",  name:"Ishrat Zahan Raka",                  designation:"Lecturer on Probation" },
  { code:"NRS",  name:"Nikhat Rejoana Sadia",               designation:"Lecturer on Probation" },
  { code:"MR",   name:"Md. Matiur Rahman",                  designation:"Lecturer (Physics)" },
  { code:"HR",   name:"Md. Harun-or-Rashid",                designation:"Lecturer (Math)" },
  { code:"SM",   name:"Saikat Mitra",                       designation:"Lecturer (EEE)" },
  { code:"SS",   name:"Sumaiya Shahria",                    designation:"Lecturer on Probation" },
  { code:"AAI",  name:"Prof. AHM Abual Islam",              designation:"Professor (English)" },
  { code:"FA",   name:"Farha Atif",                         designation:"Lecturer (English)" },
  { code:"DRK",  name:"Dr. Md. Rajaul Karim",               designation:"Lecturer (HUM)" },
  { code:"RB",   name:"Rabia Bosri",                        designation:"Lecturer (Accounting)" },
  { code:"KH",   name:"Kamrul Hasan",                       designation:"Lecturer (Economics)" },
  { code:"MAAM", name:"Md. Mohitul Ameen Ahmed Mustafi",    designation:"Lecturer (Statistics)" },
  { code:"RI",   name:"Md. Roni Islam",                     designation:"Lecturer on Probation" },
  { code:"YS",   name:"Dr. Md. Yaqub Sharif",               designation:"Lecturer (Ethics)" },
];

export const COURSES = [
  // ── 1st Year 1st Semester ──────────────────────────────────────
  { code:"CSE 1101", title:"Introduction to Computer Science",         type:"Theory",  sem:"1st Year 1st Semester", tc:"AR" },
  { code:"CSE 1103", title:"Electrical Circuit",                       type:"Theory",  sem:"1st Year 1st Semester", tc:"SM" },
  { code:"CSE 1104", title:"Electrical Circuit Lab",                   type:"Lab",     sem:"1st Year 1st Semester", tc:"SM" },
  { code:"PHY 1101", title:"Physics-I",                                type:"Theory",  sem:"1st Year 1st Semester", tc:"MR" },
  { code:"PHY 1102", title:"Physics-I Lab",                            type:"Lab",     sem:"1st Year 1st Semester", tc:"MR" },
  { code:"MATH 1101",title:"Differential and Integral Calculus",       type:"Theory",  sem:"1st Year 1st Semester", tc:"HR" },
  { code:"ENG 1101", title:"English-I",                                type:"Theory",  sem:"1st Year 1st Semester", tc:"FA" },
  { code:"ETC 111",  title:"Introduction to Ethics",                   type:"Theory",  sem:"1st Year 1st Semester", tc:"YS" },
  // ── 1st Year 2nd Semester ──────────────────────────────────────
  { code:"CSE 1201", title:"Structured Programming",                   type:"Theory",  sem:"1st Year 2nd Semester", tc:"TI" },
  { code:"CSE 1202", title:"Structured Programming Lab",               type:"Lab",     sem:"1st Year 2nd Semester", tc:"TI" },
  { code:"CSE 1203", title:"Digital Logic Design",                     type:"Theory",  sem:"1st Year 2nd Semester", tc:"NRS" },
  { code:"CSE 1205", title:"Discrete Mathematics",                     type:"Theory",  sem:"1st Year 2nd Semester", tc:"IZR" },
  { code:"CSE 1206", title:"Digital Logic Design Lab",                 type:"Lab",     sem:"1st Year 2nd Semester", tc:"IZR" },
  { code:"CSE 1208", title:"Engineering Drawing and AutoCAD Lab",      type:"Lab",     sem:"1st Year 2nd Semester", tc:"SS" },
  { code:"PHY 1201", title:"Physics-II",                               type:"Theory",  sem:"1st Year 2nd Semester", tc:"MR" },
  { code:"MATH 1201",title:"Co-ordinate Geometry and Vector Analysis", type:"Theory",  sem:"1st Year 2nd Semester", tc:"HR" },
  { code:"ENG 1201", title:"English-II",                               type:"Theory",  sem:"1st Year 2nd Semester", tc:"AAI" },
  { code:"HUM 1101", title:"Emergence of Bangladesh",                  type:"Theory",  sem:"1st Year 2nd Semester", tc:"DRK" },
  // ── 2nd Year 1st Semester ──────────────────────────────────────
  { code:"CSE 2101", title:"Object Oriented Programming-I",            type:"Theory",  sem:"2nd Year 1st Semester", tc:"AR" },
  { code:"CSE 2102", title:"Object Oriented Programming-I Lab",        type:"Lab",     sem:"2nd Year 1st Semester", tc:"AR" },
  { code:"CSE 2103", title:"Data Structures",                          type:"Theory",  sem:"2nd Year 1st Semester", tc:"GGF" },
  { code:"CSE 2104", title:"Data Structures Lab",                      type:"Lab",     sem:"2nd Year 1st Semester", tc:"GGF" },
  { code:"CSE 2105", title:"Electronics",                              type:"Theory",  sem:"2nd Year 1st Semester", tc:"PM" },
  { code:"CSE 2107", title:"Electronics Lab",                          type:"Lab",     sem:"2nd Year 1st Semester", tc:"RA" },
  { code:"CSE 2108", title:"Numerical Methods",                        type:"Theory",  sem:"2nd Year 1st Semester", tc:"RA" },
  { code:"MATH 2101",title:"Linear Algebra and Matrix Analysis",       type:"Theory",  sem:"2nd Year 1st Semester", tc:"HR" },
  { code:"ACC 2101", title:"Financial, Cost and Managerial Accounting",type:"Theory",  sem:"2nd Year 1st Semester", tc:"RB" },
  { code:"ECO 2101", title:"Economics",                                type:"Theory",  sem:"2nd Year 1st Semester", tc:"KH" },
  // ── 2nd Year 2nd Semester ──────────────────────────────────────
  { code:"CSE 2201", title:"Object Oriented Programming-II",           type:"Theory",  sem:"2nd Year 2nd Semester", tc:"PM" },
  { code:"CSE 2202", title:"Object Oriented Programming-II Lab",       type:"Lab",     sem:"2nd Year 2nd Semester", tc:"PM" },
  { code:"CSE 2203", title:"Computer Architecture",                    type:"Theory",  sem:"2nd Year 2nd Semester", tc:"IZR" },
  { code:"CSE 2204", title:"Computer Architecture Lab",                type:"Lab",     sem:"2nd Year 2nd Semester", tc:"GGF" },
  { code:"CSE 2205", title:"Algorithm Design",                         type:"Theory",  sem:"2nd Year 2nd Semester", tc:"NRS" },
  { code:"CSE 2207", title:"Microprocessor and Assembly Language",     type:"Theory",  sem:"2nd Year 2nd Semester", tc:"RA" },
  { code:"CSE 2208", title:"Microprocessor Lab",                       type:"Lab",     sem:"2nd Year 2nd Semester", tc:"RA" },
  { code:"MATH 2201",title:"Complex Variable, Laplace, Fourier and Z-Transform", type:"Theory", sem:"2nd Year 2nd Semester", tc:"HR" },
  { code:"STAT 2201",title:"Statistics and Probability",               type:"Theory",  sem:"2nd Year 2nd Semester", tc:"MAAM" },
  // ── 3rd Year 1st Semester ──────────────────────────────────────
  { code:"CSE 3201", title:"Database Management Systems",              type:"Theory",  sem:"3rd Year 1st Semester", tc:"IZR" },
  { code:"CSE 3202", title:"Database Lab",                             type:"Lab",     sem:"3rd Year 1st Semester", tc:"IZR" },
  { code:"CSE 3203", title:"Operating Systems",                        type:"Theory",  sem:"3rd Year 1st Semester", tc:"NRS" },
  { code:"CSE 3204", title:"Operating Systems Lab",                    type:"Lab",     sem:"3rd Year 1st Semester", tc:"NRS" },
  { code:"CSE 3205", title:"Computer Networks",                        type:"Theory",  sem:"3rd Year 1st Semester", tc:"GGF" },
  { code:"CSE 3206", title:"Computer Networks Lab",                    type:"Lab",     sem:"3rd Year 1st Semester", tc:"GGF" },
  { code:"CSE 3207", title:"Software Engineering",                     type:"Theory",  sem:"3rd Year 1st Semester", tc:"HU" },
  // ── 3rd Year 2nd Semester ──────────────────────────────────────
  { code:"CSE 3208", title:"Compiler Design",                          type:"Theory",  sem:"3rd Year 2nd Semester", tc:"HU" },
  { code:"CSE 3209", title:"Compiler Design Lab",                      type:"Lab",     sem:"3rd Year 2nd Semester", tc:"AR" },
  { code:"CSE 3210", title:"Artificial Intelligence",                  type:"Theory",  sem:"3rd Year 2nd Semester", tc:"AR" },
  { code:"CSE 3299", title:"Project-I",                                type:"Project", sem:"3rd Year 2nd Semester", tc:"TI" },
  // ── 4th Year 1st Semester ──────────────────────────────────────
  { code:"CSE 4101", title:"Machine Learning",                         type:"Theory",  sem:"4th Year 1st Semester", tc:"PM" },
  { code:"CSE 4102", title:"Machine Learning Lab",                     type:"Lab",     sem:"4th Year 1st Semester", tc:"PM" },
  { code:"CSE 4103", title:"Computer Graphics",                        type:"Theory",  sem:"4th Year 1st Semester", tc:"RA" },
  { code:"CSE 4104", title:"Computer Graphics Lab",                    type:"Lab",     sem:"4th Year 1st Semester", tc:"RA" },
  { code:"CSE 4107", title:"Information Security",                     type:"Theory",  sem:"4th Year 1st Semester", tc:"NRS" },
  { code:"CSE 4113", title:"Web Technology",                           type:"Theory",  sem:"4th Year 1st Semester", tc:"TI" },
  { code:"CSE 4114", title:"Web Technology Lab",                       type:"Lab",     sem:"4th Year 1st Semester", tc:"TI" },
  // ── 4th Year 2nd Semester ──────────────────────────────────────
  { code:"CSE 4105", title:"Digital Signal Processing",                type:"Theory",  sem:"4th Year 2nd Semester", tc:"RI" },
  { code:"CSE 4106", title:"Digital Signal Processing Lab",            type:"Lab",     sem:"4th Year 2nd Semester", tc:"RI" },
  { code:"CSE 4207", title:"Image Processing",                         type:"Theory",  sem:"4th Year 2nd Semester", tc:"HU" },
  { code:"CSE 4208", title:"Image Processing Lab",                     type:"Lab",     sem:"4th Year 2nd Semester", tc:"HU" },
  { code:"CSE 4399", title:"Project-II / Thesis",                      type:"Project", sem:"4th Year 2nd Semester", tc:"GGF" },
];

const teacherMap = Object.fromEntries(TEACHERS.map(t => [t.code, t]));

export const enrichCourse = (c) => ({ ...c, teacher: teacherMap[c.tc] });

export const getCoursesBySemester = (sem) =>
  COURSES.filter(c => c.sem === sem).map(enrichCourse);

export const searchCoursesLocal = (q) => {
  const lq = q.toLowerCase();
  return COURSES.filter(c =>
    c.code.toLowerCase().includes(lq) || c.title.toLowerCase().includes(lq)
  ).map(enrichCourse).slice(0, 12);
};

export const TEMPLATES = [
  { id:"kyau",     name:"KYAU Style",     desc:"Official centered layout with blue headings & two-column table",  default:true },
  { id:"modern",   name:"Modern Clean",   desc:"Clean sans-serif, thin accent top bar, card-style bottom" },
  { id:"minimal",  name:"Minimal",        desc:"Maximum whitespace, hairline borders, editorial typography" },
  { id:"dark",     name:"Dark Academic",  desc:"Navy header with gold text — elegant formal look" },
  { id:"colorful", name:"Colorful",       desc:"Teal-blue gradient header with vibrant accents" },
  { id:"thesis",   name:"Thesis Style",   desc:"Fully centered, formal layout for final year projects" },
];

export const DEPARTMENTS = [
  { id:"cse", name:"Computer Science and Engineering", short:"CSE" },
  { id:"eee", name:"Electrical and Electronic Engineering", short:"EEE" },
  { id:"bba", name:"Business Administration", short:"BBA" },
  { id:"law", name:"Law", short:"Law" },
  { id:"phr", name:"Pharmacy", short:"Pharmacy" },
];
