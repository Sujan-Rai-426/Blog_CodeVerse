import React, { useEffect, useRef } from "react";
import "../assets/css/Services.css";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carousel = carouselRef.current;
    let isDragging = false;
    let startX = 0;
    let scrollLeftStart = 0;
    let autoScrollEnabled = true;
    let autoScrollSpeed = 1.2;
    let scrollDirection = 1;
    let rafId;

    const atEnd = () => Math.ceil(carousel.scrollLeft) >= carousel.scrollWidth - carousel.clientWidth;
    const atStart = () => Math.floor(carousel.scrollLeft) <= 0;

    const autoScroll = () => {
      if (autoScrollEnabled && !isDragging) {
        carousel.scrollLeft += autoScrollSpeed * scrollDirection;
        if (atEnd()) scrollDirection = -1;
        else if (atStart()) scrollDirection = 1;
      }
      rafId = requestAnimationFrame(autoScroll);
    };

    // For iOS: Start auto-scroll *after a short delay* to allow layout
    const startAutoScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(autoScroll);
    };

    // Add a slight delay so iOS properly initializes layout
    const startTimeout = setTimeout(startAutoScroll, 800);

    const startDrag = (x) => {
      isDragging = true;
      startX = x - carousel.getBoundingClientRect().left;
      scrollLeftStart = carousel.scrollLeft;
      autoScrollEnabled = false;
      carousel.style.cursor = "grabbing";
    };

    const dragMove = (x) => {
      if (!isDragging) return;
      const walk = x - carousel.getBoundingClientRect().left - startX;
      carousel.scrollLeft = scrollLeftStart - walk;
      if (atEnd()) scrollDirection = -1;
      else if (atStart()) scrollDirection = 1;
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      carousel.style.cursor = "grab";
      setTimeout(() => (autoScrollEnabled = true), 1000);
    };

    carousel.addEventListener("mousedown", (e) => startDrag(e.pageX));
    carousel.addEventListener("mousemove", (e) => dragMove(e.pageX));
    window.addEventListener("mouseup", endDrag);
    carousel.addEventListener("mouseleave", endDrag);
    carousel.addEventListener("touchstart", (e) => startDrag(e.touches[0].pageX), {
      passive: true,
    });
    carousel.addEventListener("touchmove", (e) => dragMove(e.touches[0].pageX), {
      passive: true,
    });
    carousel.addEventListener("touchend", endDrag);

    const handleWheel = (e) => {
      autoScrollEnabled = false;
      carousel.scrollLeft += e.deltaY;
      if (atEnd()) scrollDirection = -1;
      else if (atStart()) scrollDirection = 1;
      clearTimeout(carousel.wheelTimeout);
      carousel.wheelTimeout = setTimeout(() => (autoScrollEnabled = true), 1000);
    };
    carousel.addEventListener("wheel", handleWheel);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(startTimeout);
    };
  }, []);


  const services = [
    {
      img: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20220804114400/Design-Components-For-Front-End-Developers.jpg",
      title: "Frontend Design Components",
      desc: "React, Tailwind, Bootstrap, Animation UI",
      link: "/frontend-design",
    },
    {
      img: "https://themefisher.com/blog-thumb/free-responsive-website-templates-html5-css3.webp",
      title: "Premium Website Templates",
      desc: "Use pre-built templates for faster development",
      link: "/premium-templates",
    },
    {
      img: "https://sklc-tinymce-2021.s3.amazonaws.com/comp/2023/04/full-stack%20web%20development_1681290664.png",
      title: "Full Stack Web Development",
      desc: "For businesses, shops & content creators",
      link: "/fullstack-development",
    },
    {
      img: "https://softwaresindemand.com/assets/images/how_it_works_images/6780c93b22a5e1736493371.png",
      title: "E-Commerce Platforms",
      desc: "Power your online store with CodeVora",
      link: "/ecommerce",
    },
    {
      img: "https://communications.news.columbia.edu/sites/communications.news.columbia.edu/files/content/Communications%20Lab/Web%20SEO%20Analytics%20Research%20Image.jpg",
      title: "SEO & Analytics",
      desc: "Grow visibility and reach globally",
      link: "/seo-analytics",
    },
  ];

  return (
    <div className="cv-carousel-main-container">
      <div className="cv-carousel-container">
        <h2 className="cv-section-title">
          🚀 <sup><u><b>Our Top Services</b></u></sup>
        </h2>

        <div className="cv-carousel" ref={carouselRef}>
          {services.map((service, idx) => (
            <div
              className="cv-card"
              key={idx}
              // onClick={() => navigate(service.link)}
            >
              <img src={service.img} alt={service.title} />
              <div className="cv-card-overlay"></div>
              <div className="cv-card-info">
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
