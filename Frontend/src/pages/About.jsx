import React from 'react';
import '../assets/css/About.css';

import sujanImg from "../assets/img/About_img/sujan_rai.jpeg";
import roshanImg from "../assets/img/About_img/roshan_rai.JPG";


function About() {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="hero-content">
                    <h1>About &nbsp; <span> Code<sup><u>Verse</u></sup></span></h1>
                    <p>Your ultimate destination for learning and building modern web applications.</p>
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
                    <h2>Meet Our Team</h2>
                    <div className="team-cards">
                        <div className="team-card">
                            <img src={sujanImg} alt="Er. Sujan Rai" />
                            <h3>Er. Sujan Rai</h3>
                            <p className='p-0'>Founder & Developer</p>
                            <p><small><i>rsujan140.in@gmail.com</i></small></p>
                        </div>
                        <div className="team-card">
                            <img src={roshanImg} alt="Roshan Rai" />
                            <h3>Roshan Rai</h3>
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
