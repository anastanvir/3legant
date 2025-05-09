'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CalendarDays, Clock, Tag } from 'lucide-react';

type BlogPost = {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    readTime: string;
    tags: string[];
    image: string;
};

const BlogsPage = () => {
    // Sample blog data array
    const allBlogPosts: BlogPost[] = [
        // {
        //     id: 1,
        //     title: 'The Future of E-Commerce in Pakistan',
        //     excerpt: 'Exploring the growing trends and opportunities in Pakistani e-commerce market.',
        //     content: 'Full content would go here...',
        //     author: 'Ali Khan',
        //     date: '2023-10-15',
        //     readTime: '5 min read',
        //     tags: ['E-Commerce', 'Trends'],
        //     image: '/blogs/ecommerce-future.jpg'
        // },
        // {
        //     id: 2,
        //     title: 'Sustainable Shopping Practices',
        //     excerpt: 'How to make your online shopping more environmentally friendly.',
        //     content: 'Full content would go here...',
        //     author: 'Sara Ahmed',
        //     date: '2023-09-28',
        //     readTime: '4 min read',
        //     tags: ['Sustainability', 'Tips'],
        //     image: '/blogs/sustainable-shopping.jpg'
        // },
        // {
        //     id: 3,
        //     title: 'Mobile Payment Solutions',
        //     excerpt: 'The rise of mobile wallets and their impact on online shopping.',
        //     content: 'Full content would go here...',
        //     author: 'Usman Malik',
        //     date: '2023-08-10',
        //     readTime: '6 min read',
        //     tags: ['Payments', 'Technology'],
        //     image: '/blogs/mobile-payments.jpg'
        // },
    ];

    // State for search and filter
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 4;

    // Get all unique tags
    const allTags = Array.from(new Set(allBlogPosts.flatMap(post => post.tags)));

    // Filter posts based on search and tag selection
    const filteredPosts = allBlogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
        return matchesSearch && matchesTag;
    });

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleTagClick = (tag: string) => {
        setSelectedTag(selectedTag === tag ? null : tag);
        setCurrentPage(1); // Reset to first page on tag filter
    };

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
                        3l3gent Blog
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl md:text-2xl max-w-3xl mx-auto"
                    >
                        Insights, trends, and stories from the world of e-commerce
                    </motion.p>
                </div>
            </section>

            {/* Blog Content */}
            <section className="py-16 container mx-auto px-4">
                {/* Search and Filter */}
                <div className="mb-12">
                    <motion.div
                        className="flex flex-col md:flex-row gap-4 mb-8"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                            <input
                                type="text"
                                placeholder="Search blogs..."
                                className="input input-bordered w-full pl-10"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn">
                                <Tag className="mr-2" />
                                {selectedTag || 'Filter by Tag'}
                            </label>
                            <ul
                                tabIndex={0}
                                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                            >
                                <li><button onClick={() => handleTagClick('')}>All Tags</button></li>
                                {allTags.map(tag => (
                                    <li key={tag}>
                                        <button onClick={() => handleTagClick(tag)}>
                                            {tag}
                                            {selectedTag === tag && (
                                                <span className="badge badge-primary">✓</span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    {/* Active filters */}
                    {(searchQuery || selectedTag) && (
                        <motion.div
                            className="flex items-center gap-2 mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <span className="text-sm">Active filters:</span>
                            {searchQuery && (
                                <span className="badge badge-outline">
                                    Search: "{searchQuery}"
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="ml-1"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {selectedTag && (
                                <span className="badge badge-outline">
                                    Tag: {selectedTag}
                                    <button
                                        onClick={() => setSelectedTag(null)}
                                        className="ml-1"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Blog Posts */}
                {currentPosts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentPosts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                className="bg-base-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="h-48 bg-base-300 relative overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {post.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="badge badge-outline cursor-pointer hover:badge-primary"
                                                onClick={() => handleTagClick(tag)}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                                    <p className="text-base-content/80 mb-4">{post.excerpt}</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-1">
                                            <CalendarDays className="w-4 h-4" />
                                            {new Date(post.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {post.readTime}
                                        </span>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        className="text-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <h3 className="text-xl font-semibold mb-2">No blog posts found</h3>
                        <p className="text-base-content/80">
                            {searchQuery ? (
                                <>No posts match your search for "{searchQuery}"</>
                            ) : (
                                "No blog posts available at the moment. Please check back later."
                            )}
                        </p>
                        {(searchQuery || selectedTag) && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedTag(null);
                                }}
                                className="btn btn-ghost mt-4"
                            >
                                Clear filters
                            </button>
                        )}
                    </motion.div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <motion.div
                        className="flex justify-center mt-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="join">
                            <button
                                className="join-item btn"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                «
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={`join-item btn ${currentPage === page ? 'btn-primary' : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                className="join-item btn"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                »
                            </button>
                        </div>
                    </motion.div>
                )}
            </section>
        </div>
    );
};

export default BlogsPage;