import React, { useState } from 'react';
import "../assets/css/Contact.css";

function Contact() {
    const [result, setResult] = useState("");
    const [isSending, setIsSending] = useState(false); // new state for sending

    const onSubmit = async (event) => {
        event.preventDefault();
        setIsSending(true);          // disable button
        setResult("Sending....");

        const formData = new FormData(event.target);

        formData.append("access_key", import.meta.env.VITE_EMAIL_ACCESS_KEY);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setResult("Form Submitted Successfully");
                alert("Your message is sent successfully!!!");
                event.target.reset();
            } else {
                console.log("Error", data);
                setResult(data.message || "Something went wrong");
            }
        } catch (err) {
            console.error(err);
            setResult("Network error. Try again later.");
        } finally {
            setIsSending(false);      // re-enable button
        }
    };

    return (
        <section id='CONTACT-FORM' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <div className="contact-section">
                <div className="contact-left">
                    <div className="address-detail">
                        <i className="fa-solid fa-location-dot"></i>
                        <h1>Address</h1>
                        <p>Belbari-10, Morang</p>
                    </div>
                    <div className="phone-detail">
                        <i className="fa-solid fa-phone"></i>
                        <h1>Phone</h1>
                        <p>+977 9805376861</p>
                    </div>
                    <div className="email-detail">
                        <i className="fa-solid fa-envelope"></i>
                        <h1>Email</h1>
                        <p>codevora140@gmail.com</p>
                        <p>sujanrai20070140@gmail.com</p>
                    </div>
                </div>

                <div className="contact-right">
                    <section className="form-container contact">
                        <form onSubmit={onSubmit}>
                            <h2>Contact Form</h2>

                            <div className="input-box">
                                <input type="text" className='form-label1' placeholder='Full Name' name="name" required />
                            </div>

                            <div className="input-box">
                                <input type="email" className='form-label1' placeholder='your_email@gmail.com' name="email" required />
                            </div>

                            <div className="input-box">
                                <input type="text" className='form-label1' placeholder='Subject' name="subject" required />
                            </div>

                            <div className="input-box">
                                <textarea className='form-label2' placeholder='Message' name="message" required></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className='contact-btn'
                                disabled={isSending}  // disable while sending
                            >
                                {isSending ? "Sending..." : "Send Message"} {/* show animation text */}
                            </button>
                        </form>
                        <p>{result}</p>
                    </section>
                </div>
            </div>
        </section>
    );
}

export default Contact;
