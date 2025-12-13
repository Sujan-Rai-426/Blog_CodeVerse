import React from 'react';
import '../assets/css/About.css';

import sujanImg from "../assets/img/About_img/sujan_rai.jpeg";
import roshanImg from "../assets/img/About_img/roshan_rai.JPG";


function About() {
    return (
        <div className="about-page container" style={{ minHeight: "100vh" }}>
            {/* Hero Section */}
            <section className="about-hero">
                <div className="hero-content" style={{ textAlign: "justify" }}>
                    <h1 className="text-center">
                        <span>
                            <b>Code</b>
                            <sup>
                                <u><small>Vora</small>💻</u>
                            </sup>
                        </span>
                    </h1>
                    <p>
                        Welcome to <strong>CodeVora</strong> — your ultimate destination for learning, exploring, 
                        and building modern web applications. Whether you’re a beginner taking your first steps into 
                        coding or an experienced developer looking to polish your skills, CodeVora is here to guide 
                        you every step of the way.
                    </p>
                    <p>
                        Our mission is to simplify coding education by blending practical projects with real-world 
                        examples. From interactive tutorials and problem-solving sessions to full-stack project 
                        walkthroughs, we aim to make coding not just a skill but a creative experience.
                    </p>
                    <p>
                        We believe that learning to code should be <strong>accessible, engaging, and rewarding</strong>. 
                        That’s why at CodeVora, we focus on clear explanations, hands-on practice, and community-driven 
                        growth — helping you turn your ideas into powerful digital solutions.
                    </p>
                </div>
            </section>


            {/* Mission & Vision */}
            <section className="mission-vision">
                <div className="container">
                    <div className="card">
                        <h2>Our Mission</h2>
                        <p>To empower developers by providing high-quality tutorials, projects, and resources that help them grow their skills and careers.</p>
                    </div>
                    <div className="card">
                        <h2>Our Vision</h2>
                        <p>To be the most trusted and comprehensive platform for learning web development and coding worldwide.</p>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team-section">
                <div className="container">
                    <h2> <small>👥 Our Team Members</small> </h2>
                    <div className="team-cards">
                        <div className="team-card">
                            <img src={sujanImg} alt="Er. Sujan Rai" />
                            <h3>Er. Sujan Rai</h3>
                            <p className='p-0'>Founder & Developer</p>
                            <p><small><i>rsujan140.in@gmail.com</i></small></p>
                        </div>
                        <div className="team-card">
                            <img src={roshanImg} alt="Roshan Rai" />
                            <h3>Roshan Bantawa Rai</h3>
                            <p>UI/UX Designer</p>
                        </div>
                        {/* <div className="team-card">
                            <img src="https://via.placeholder.com/150" alt="Team Member" />
                            <h3>John Smith</h3>
                            <p>Frontend Developer</p>
                        </div> */}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;
