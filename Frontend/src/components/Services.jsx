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
    let scrollDirection = 1;
    const autoScrollSpeed = 0.6; // adjust speed
    let rafId;

    // Internal virtual scroll position
    let virtualScroll = 0;

    const smoothAutoScroll = () => {
      if (autoScrollEnabled && !isDragging) {
        virtualScroll += autoScrollSpeed * scrollDirection;
        // Bounce back at edges
        if (virtualScroll >= carousel.scrollWidth - carousel.clientWidth) {
          virtualScroll = carousel.scrollWidth - carousel.clientWidth;
          scrollDirection = -1;
        } else if (virtualScroll <= 0) {
          virtualScroll = 0;
          scrollDirection = 1;
        }
        carousel.scrollLeft = virtualScroll;
        // Force repaint on iOS
        carousel.style.transform = "translateZ(0)";
      }
      rafId = requestAnimationFrame(smoothAutoScroll);
    };

    // Start after a short delay
    const initTimeout = setTimeout(() => {
      rafId = requestAnimationFrame(smoothAutoScroll);
    }, 200);

    // Drag handling
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
      virtualScroll = carousel.scrollLeft; // sync virtual scroll
    };

    const endDrag = () => {
      isDragging = false;
      carousel.style.cursor = "grab";
      setTimeout(() => (autoScrollEnabled = true), 700);
    };

    // Mouse events
    carousel.addEventListener("mousedown", (e) => startDrag(e.pageX));
    carousel.addEventListener("mousemove", (e) => dragMove(e.pageX));
    window.addEventListener("mouseup", endDrag);
    carousel.addEventListener("mouseleave", endDrag);

    // Touch events
    carousel.addEventListener("touchstart", (e) => startDrag(e.touches[0].pageX), { passive: true });
    carousel.addEventListener("touchmove", (e) => dragMove(e.touches[0].pageX), { passive: true });
    carousel.addEventListener("touchend", endDrag);

    // Wheel scroll
    const handleWheel = (e) => {
      autoScrollEnabled = false;
      carousel.scrollLeft += e.deltaY;
      virtualScroll = carousel.scrollLeft; // sync virtual scroll
      clearTimeout(carousel.wheelTimeout);
      carousel.wheelTimeout = setTimeout(() => (autoScrollEnabled = true), 1000);
    };
    carousel.addEventListener("wheel", handleWheel);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(initTimeout);
      carousel.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const services = [
    {
      img: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20220804114400/Design-Components-For-Front-End-Developers.jpg",
      title: "Frontend Design Components",
      desc: "Free React, Tailwind, Bootstrap, Animation UI components for all ro use",
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
