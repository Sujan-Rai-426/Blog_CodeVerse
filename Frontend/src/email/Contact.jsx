

import React, { useEffect, useState } from 'react'
import "../assets/css/Contact.css"
// import "../assets/css/Utility.css"
import api from '../api';

function Contact() {

    // For API of Contact using access key
    const [result, setResult] = React.useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        setResult("Sending....");
        const formData = new FormData(event.target);

        formData.append("access_key", import.meta.env.VITE_EMAIL_ACCESS_KEY);

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            setResult("Form Submitted Successfully");
            alert("Your message is sent successfully!!!");  // alert only if success
            event.target.reset();
        } else {
            console.log("Error", data);
            setResult(data.message || "Something went wrong");
        }
    };



    return (
        
<section id='CONTACT-FORM' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
    <div className="contact-section">
            
            <div className="contact-left">
                                
                    <div className="address-detail">
                        <i className="fa-solid fa-location-dot"></i>
                        <h1>  Address  </h1>
                        <p> Belbari-10, Morang</p>
                    </div>

                    <div className="phone-detail">
                        <i className="fa-solid fa-phone"></i>
                        <h1>  Phone  </h1>
                        <p>   +977 9805376861  </p>
                    </div>

                    <div className="email-detail">
                        <i className="fa-solid fa-envelope"></i>
                        <h1>  Email  </h1>
                        <p> rsujan140.in@gmail.com </p>
                        <p> sujanrai20070140@gmail.com </p>
                    </div>
            </div>

            <div className="contact-right">

{/*     ACTUAL FORM SECTION  */}
        <section className="form-container contact">
            <form onSubmit={onSubmit}>
                <h2>Contact Form</h2>

                <div className="input-box">
                    <input type="text" className='form-label1' placeholder='Full Name' name="name" id="name" required="required" />
                </div>

                <div className="input-box">
                    <input type="email" className='form-label1' placeholder='your_email@gmail.com' name="email" id="email" required />
                </div>

                <div className="input-box">
                    <input type="text" className='form-label1' placeholder='Subject' name="subject" id="subject" required />
                </div>

                <div className='input-box'>
                    <textarea className='form-label2' placeholder='Message' name="message" id="message" required></textarea>
                </div>

                <button type="submit" className='contact-btn'> Send Message </button>
            </form>
        </section>
{/*     ACTUAL FORM SECTION  END    */}


        </div>
    </div>

</section>
    )
}

export default Contact;