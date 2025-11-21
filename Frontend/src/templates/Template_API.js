


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
        "user_access": "Premium",
        "price": 10,
        "react_code": `
function Card() {
    return <div className='card'>Hello React</div>;
}
`,
        "css": ".card { padding: 20px; background: #f3f4f6; border-radius: 8px; text-align:center; font-weight:600; font-size:1.1rem; }",
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