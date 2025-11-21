// src/template_Pages/Template_API.js

const templates = [
  {
    id: 1,
    access_type: "Free",
    price: 0,
    title: "Portfolio React App",
    description: "A simple portfolio built with React.",
    iframe_url: "https://donkirkby.github.io/react-gh-pages/?utm_source=chatgpt.com", // Hosted via GitHub Pages
    repo_url: "https://github.com/donkirkby/react-gh-pages", // For download/view
    cover_image: "https://via.placeholder.com/150",
    documentation: "https://github.com/your-username/portfolio-app#readme"
  },
  {
    id: 2,
    access_type: "Premium",
    price: 100,
    title: "Todo React App",
    description: "A simple todo app built with React.",
    iframe_url: "https://your-username.github.io/todo-app/",
    repo_url: "https://github.com/your-username/todo-app",
    cover_image: "https://via.placeholder.com/150",
    documentation: "https://github.com/your-username/todo-app#readme"
  }
];

export async function fetchTemplates() {
  return new Promise((resolve) => setTimeout(() => resolve(templates), 400));
}

export async function fetchTemplateById(id) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(templates.find((t) => t.id === Number(id)) || null), 300)
  );
}
