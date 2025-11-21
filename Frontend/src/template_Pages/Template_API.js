


// Dummy API that returns multiple templates. Replace with real API calls later.
const templates = [
    {
        "id": 1,
        "type": "html",
        "title": "Landing Page",
        "thumbnail": "/img/template1.png",
        "user_access": "Free",
        "price": 0,
        "html": "<h1>Hello World</h1>",
        "css": "h1 { color: red; }",
        "js": "console.log('Hello')",
        "documentation": "This is a simple landing page template built with HTML, CSS, and JavaScript."
    },
    {
        "id": 2,
        "type": "react",
        "title": "React Card Component",
        "thumbnail": "/img/template2.png",
        "user_access": "Free",
        // "user_access": "Premium",
        "price": 10,
        "react_code": `
function App() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id); // element inside iframe
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };


  return (
    <div style={{ fontFamily: "Arial" }}>
      <header style={{ position: "sticky", top: 0, background: "#0f172a", color: "white", padding: "1rem" }}>
        <h1>Sujan Rai</h1>
        <nav>
          <button onClick={() => scrollToSection("about")}>About</button>
          <button onClick={() => scrollToSection("projects")}>Projects</button>
          <button onClick={() => scrollToSection("contact")}>Contact</button>
        </nav>
      </header>

      <section id="about" style={{ height: "400px", padding: "2rem", background: "#f1f5f9" }}>
        <h2>About Me</h2>
        <p>Hi! I'm Sujan Rai, a Full Stack Developer.</p>
      </section>

      <section id="projects" style={{ height: "400px", padding: "2rem", background: "#e2e8f0" }}>
        <h2>Projects</h2>
        <p>Project 1, Project 2, Project 3...</p>
      </section>

      <section id="contact" style={{ height: "400px", padding: "2rem", background: "#cbd5e1" }}>
        <h2>Contact</h2>
        <p>Email: sujan@example.com</p>
      </section>
    </div>
  );
}

`
,
        "css": `body {
  margin: 0;
  font-family: Arial, sans-serif;
  line-height: 1.6;
  background: #f9f9f9;
}
header nav button {
  margin-left: 1rem;
  background: #38bdf8;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
}

header nav button:hover {
  background: #0ea5e9;
}

a {
  text-decoration: none;
  color: inherit;
}

.header {
  position: sticky;
  top: 0;
  background: #0f172a;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  z-index: 100;
}

.header nav a {
  margin-left: 1rem;
  transition: color 0.3s;
}

.header nav a:hover {
  color: #38bdf8;
}

section {
  padding: 4rem 2rem;
  text-align: center;
}

.projects-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.project-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  width: 250px;
  transition: transform 0.3s;
}

.project-card:hover {
  transform: translateY(-5px);
}

footer {
  text-align: center;
  padding: 2rem;
  background: #0f172a;
  color: white;
}
`,
        "documentation": "This is a React card component template styled with CSS."
    }
];



export async function fetchTemplates() {
// simulate network latency
return new Promise((resolve) => setTimeout(() => resolve(templates), 450));
}


export async function fetchTemplateById(id) {
return new Promise((resolve) => setTimeout(() => resolve(templates.find(t => t.id === Number(id)) || null), 300));
}