import React, { useEffect, useState } from "react";

function Carousel() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Fetch images from API (you can replace this URL with your own)
        fetch("https://picsum.photos/v2/list?page=1&limit=5")
        .then((response) => response.json())
        .then((data) => setImages(data))
        .catch((error) => console.error("Error fetching images:", error));
    }, []);

    return (
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" style={{ maxWidth: "900px", margin: "auto", borderRadius: "12px" }} >
        
            {/* Carousel Indicators */}
            <div className="carousel-indicators">
                {images.map((_, index) => (
                    <button key={index} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index} className={index === 0 ? "active" : ""} aria-current={index === 0 ? "true" : "false"} aria-label={`Slide ${index + 1}`} ></button>
                ))}
            </div>

            {/* Carousel Inner */}
            <div className="carousel-inner">
                {images.length > 0 ? (
                    images.map((img, index) => (
                        <div key={img.id} className={`carousel-item ${index === 0 ? "active" : ""}`} >
                            <img src={img.download_url} className="d-block w-100" alt={`Slide ${index + 1}`} style={{ height: "450px", objectFit: "cover", borderRadius: "12px", }} />
                            <div className="carousel-caption d-none d-md-block bg-None bg-opacity-50 rounded p-2" style={{ bottom: "20px" }} >
                                <h5>{img.author}</h5>
                                <p> Lets build this internet world together </p>
                            </div>
                        </div>
                    ))
                    ) : (
                        <div className="text-center py-5">
                            <p>Loading images...</p>
                        </div>
                    )
                }
            </div>

            {/* Controls */}
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev" >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>

            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next" >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>

        </div>
    );
}

export default Carousel;
