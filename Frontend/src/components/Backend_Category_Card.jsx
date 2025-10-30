import React, {useEffect, useState} from 'react'

function Backend_Category_Card() {

    const [topics, setTopics] = useState([]);

    useEffect(() => {
        // Simulated API data — replace later with fetch from backend
        setTopics([
            { id: 1, name: "Django", icon: "devicon-django-plain", color: "#092e20" },
            { id: 2, name: "Python", icon: "devicon-python-plain", color: "#3776ab" },
            { id: 3, name: "Node.js", icon: "devicon-nodejs-plain", color: "#3c873a" },
            { id: 4, name: "C++", icon: "devicon-cplusplus-plain", color: "#004482" },
            { id: 5, name: "JavaScript", icon: "devicon-javascript-plain", color: "#f7df1e" },

        ]);
    }, []);

    return (
        <>
            <h4 className="text-center mb-4 fw-bold">Backend</h4>
            <div className="row g-4 justify-content-center">
                {topics.map((topic) => (
                    <div className="col-6 col-md-3 col-lg-3 text-center" key={topic.id}>
                        <div className="p-4 rounded-4 shadow-sm topic-card" style={{ backgroundColor: '#fff', transition: '0.3s', }} >
                            <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '80px', height: '80px', backgroundColor: topic.color, }} >
                                <i className={`${topic.icon} colored fs-1 text-white`}></i>
                            </div>
                            <h5 className="fw-semibold">{topic.name}</h5>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Backend_Category_Card