'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const AboutPage = () => {
    const teamMembers = [
        {
            id: 1,
            name: 'Alex Johnson',
            role: 'Founder & CEO',
            bio: 'Visionary leader with 10+ years in e-commerce and technology innovation.',
            image: '/team/ceo.jpg'
        },
        {
            id: 2,
            name: 'Sarah Williams',
            role: 'Head of Design',
            bio: 'Creative director passionate about user experience and minimalist design.',
            image: '/team/designer.jpg'
        },
        {
            id: 3,
            name: 'Michael Chen',
            role: 'Tech Lead',
            bio: 'Full-stack developer specializing in scalable e-commerce solutions.',
            image: '/team/developer.jpg'
        }
    ];

    const stats = [
        { value: '10,000+', label: 'Happy Customers' },
        { value: '100+', label: 'Brands Partnered' },
        { value: '24/7', label: 'Customer Support' },
        { value: '100%', label: 'Secure Payments' }
    ];

    const values = [
        {
            title: 'Customer First',
            description: 'We prioritize your needs above all else, ensuring exceptional shopping experiences.',
            icon: '👑'
        },
        {
            title: 'Innovation Driven',
            description: 'Constantly evolving to bring you the latest products and shopping technologies.',
            icon: '💡'
        },
        {
            title: 'Sustainability',
            description: 'Committed to eco-friendly practices and responsible sourcing.',
            icon: '🌱'
        }
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
                        About 3legent
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl md:text-2xl max-w-3xl mx-auto"
                    >
                        Redefining e-commerce with elegance, efficiency, and exceptional service.
                    </motion.p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16 container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <motion.div
                        className="lg:w-1/2"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                        <p className="text-lg mb-4">
                            3legent was born in 2023 from a simple idea: e-commerce should be effortless, elegant, and enjoyable.
                            Frustrated by clunky online shopping experiences, our founder set out to create a platform that
                            combines cutting-edge technology with intuitive design.
                        </p>
                        <p className="text-lg">
                            Today, we're proud to serve thousands of customers across Pakistan with fast, reliable delivery
                            and a carefully curated selection of products that meet our high standards for quality and value.
                        </p>
                    </motion.div>
                    <motion.div
                        className="lg:w-1/2 rounded-lg overflow-hidden shadow-xl"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Image
                            src="/team/office.jpg"
                            alt="Our office"
                            width={600}
                            height={400}
                            className="w-full h-auto object-cover rounded-box"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-base-200 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">By The Numbers</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="bg-base-100 p-6 rounded-lg shadow-md text-center"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                                <p className="text-lg">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-16 container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {values.map((value, index) => (
                        <motion.div
                            key={value.title}
                            className="bg-base-200 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-4xl mb-4">{value.icon}</div>
                            <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                            <p className="text-base-content/80">{value.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Team */}
            <section className="py-16 bg-base-200">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Meet The Team</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {teamMembers.map((member) => (
                            <motion.div
                                key={member.id}
                                className="bg-base-100 p-5 rounded-box overflow-hidden shadow-lg"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <div className="relative h-32 w-32 rounded-full overflow-hidden mx-auto">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover rounded-full"
                                        style={{ borderRadius: '50%' }}
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold">{member.name}</h3>
                                    <p className="text-primary mb-3">{member.role}</p>
                                    <p className="text-base-content/80">{member.bio}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-primary text-primary-content">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience 3legent?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join thousands of satisfied customers enjoying seamless shopping today.
                    </p>
                    <button className="btn btn-secondary btn-lg">Start Shopping</button>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;