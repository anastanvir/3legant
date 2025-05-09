'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AtSign, MapPin, Phone } from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Replace with your actual form submission logic
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactMethods = [
        {
            icon: <MapPin className="w-6 h-6 text-primary" />,
            title: "Our Location",
            description: "123 E-Commerce Street, Karachi, Pakistan",
        },
        {
            icon: <Phone className="w-6 h-6 text-primary" />,
            title: "Call Us",
            description: "+92 300 1234567",
        },
        {
            icon: <AtSign className="w-6 h-6 text-primary" />,
            title: "Email Us",
            description: "support@3l3gent.com",
        },
    ];

    return (
        <div className="bg-base-100 text-base-content">
            {/* Hero Section */}
            <section className="relative bg-base-200 py-20">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        Contact Us
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl md:text-2xl max-w-3xl mx-auto"
                    >
                        We'd love to hear from you! Reach out for inquiries, support, or feedback.
                    </motion.p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16 container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Contact Information */}
                    <motion.div
                        className="lg:w-1/2"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>

                        <div className="space-y-6">
                            {contactMethods.map((method, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-start gap-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="mt-1">
                                        {method.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold">{method.title}</h3>
                                        <p className="text-base-content/80">{method.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            className="mt-12 bg-base-200 p-6 rounded-box"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                            <ul className="space-y-2">
                                <li className="flex justify-between">
                                    <span className="text-base-content/80">Monday - Friday</span>
                                    <span>9:00 AM - 6:00 PM</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-base-content/80">Saturday</span>
                                    <span>10:00 AM - 4:00 PM</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-base-content/80">Sunday</span>
                                    <span>Closed</span>
                                </li>
                            </ul>
                        </motion.div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        className="lg:w-1/2 bg-base-200 p-8 rounded-lg shadow-sm"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>

                        {submitStatus === 'success' && (
                            <div className="alert alert-success mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Your message has been sent successfully!</span>
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className="alert alert-error mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Error sending message. Please try again.</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-control">
                                <label htmlFor="name" className="label">
                                    <span className="label-text">Your Name</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label htmlFor="email" className="label">
                                    <span className="label-text">Email Address</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label htmlFor="subject" className="label">
                                    <span className="label-text">Subject</span>
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label htmlFor="message" className="label">
                                    <span className="label-text">Your Message</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className="textarea textarea-bordered w-full"
                                    required
                                ></textarea>
                            </div>

                            <div className="form-control pt-4">
                                <button
                                    type="submit"
                                    className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Map Section */}
            <section className="bg-base-200 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Location</h2>
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.041664885889!2d67.02886831500292!3d24.86192998404961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e06651d4bbf%3A0x9cf92f44555a0c23!2sKarachi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            className="rounded-lg"
                        ></iframe>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;