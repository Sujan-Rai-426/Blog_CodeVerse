// src/template_Pages/Template_API.js

const templates = [
  {
    id: 1,
    access_type: "Free",
    price: 0,
    title: "Portfolio React App",
    project_info: "A personal portfolio website built with React.",
    iframe_url: "https://donkirkby.github.io/react-gh-pages/?utm_source=chatgpt.com", // Hosted via GitHub Pages
    repo_url: "https://github.com/donkirkby/react-gh-pages", // For download/view
    cover_image: "https://media.istockphoto.com/id/1413056339/vector/red-free-stamp.jpg?s=612x612&w=0&k=20&c=16ng4tPJkMoN4DuTy3fbNr_tepOAp-_w80aS3BfpdRA=",
    documentation: "https://github.com/your-username/portfolio-app#readme"
  },
  {
    id: 2,
    access_type: "Free",
    price: 10,
    title: "Portfolio using React TS [ Credit: lightswind.com ]",
    project_info: "This portfolio is created by lightswind.com using React TypeScript. We just used this link for testing purpose.",
    iframe_url: "https://lwportfolio01.muhilanorg.in/",
    repo_url: "https://lightswind.com/templates/portfolio01",
    cover_image: "https://png.pngtree.com/png-clipart/20250105/original/pngtree-premium-gold-stickers-design-png-image_18775640.png",
    documentation: "https://lightswind.com/templates/portfolio01"
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
