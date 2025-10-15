import React from 'react';
import Layout from './Layout';
import '../styles/AboutUs.css'; // Add this for styling

function AboutUs() {
    return (
        <Layout>
            <div style={{
                backgroundColor: 'black', // Bootstrap Blue
                color: 'white',
                fontSize: '3rem',
                fontWeight: 'bold',
                textAlign: 'center',
                padding: '1rem 0',
                letterSpacing: '3px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
            }}>
                <b><i>NEIGHBOURLY</i></b>
            </div>
            <div className="about-container">
                <section>
                    <h1 className="about-title text-primary">🏡 About Neighbourhood Services Finder</h1>
                    <p className="about-text">
                        Welcome to the easiest way to get your leaky faucet fixed, AC serviced, or Wi-Fi sorted! Whether you're a busy parent, a student in a pinch, or someone who just doesn’t want to lift a wrench — we've got your back.
                    </p>
                </section>

                <section>
                    <h2 className="section-title text-success">🔎 What We Do</h2>
                    <p className="about-text">
                        We connect users with trusted, top-rated service providers in their local area. Think electricians, plumbers, tutors, mechanics — all just a search and a click away.
                    </p>
                    <ul className="about-list">
                        <li>🧰 Book professionals based on category & availability</li>
                        <li>⭐ Rate and review your experiences</li>
                        <li>📍 Find providers near you with our maps feature</li>
                        <li>⚡ Use Quick Book for instant bookings</li>
                    </ul>
                </section>

                <section>
                    <h2 className="section-title text-warning">🛡️ Why Trust Us?</h2>
                    <p className="about-text">
                        Our providers go through a verification process and earn badges like 🥇 Gold and 🥈 Silver based on performance and feedback. You always know who’s knocking at your door!
                    </p>
                </section>

                <section>
                    <h2 className="section-title text-info">🚀 Coming Soon</h2>
                    <ul className="about-list">
                        <li>🎁 Loyalty & reward points</li>
                        <li>🆘 Community help requests for emergencies</li>
                        <li>📈 Smart analytics for providers</li>
                        <li>🔐 Secure login with email alerts</li>
                    </ul>
                </section>

                <section>
                    <h2 className="section-title text-danger">📬 Let’s Stay in Touch</h2>
                    <p className="about-text">
                        We’re always looking to improve! Got suggestions, feedback, or just want to say hi?
                    </p>
                    <p className="about-text">
                        Drop us a line at <strong>hello@neighbourhelp.com</strong>
                    </p>
                </section>
            </div>
        </Layout>
    );
}

export default AboutUs;
