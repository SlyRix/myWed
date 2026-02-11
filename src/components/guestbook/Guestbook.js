import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mdiHeart, mdiSend, mdiDelete } from '@mdi/js';
import Icon from '@mdi/react';

const Guestbook = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filter, setFilter] = useState('all'); // all, recent, popular

    // In a real app, you would fetch messages from a backend
    useEffect(() => {
        // Simulated data
        const initialMessages = [
            {
                id: 1,
                name: 'Sarah Johnson',
                message: 'So excited for both ceremonies! The fusion of traditions will be beautiful.',
                timestamp: new Date('2025-02-10T14:30:00'),
                likes: 5
            },
            {
                id: 2,
                name: 'Raj Patel',
                message: 'Looking forward to the celebrations! Can\'t wait to see you both on your special day.',
                timestamp: new Date('2025-02-15T10:24:00'),
                likes: 3
            },
            {
                id: 3,
                name: 'Emma Williams',
                message: 'Your love story is so inspiring. Wishing you both a lifetime of happiness!',
                timestamp: new Date('2025-02-20T18:15:00'),
                likes: 7
            }
        ];
        setMessages(initialMessages);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newMessage.trim() || !name.trim()) return;

        setIsSubmitting(true);

        // Simulate API delay
        setTimeout(() => {
            const newEntry = {
                id: Date.now(),
                name: name.trim(),
                message: newMessage.trim(),
                timestamp: new Date(),
                likes: 0
            };

            setMessages(prev => [newEntry, ...prev]);
            setNewMessage('');
            setIsSubmitting(false);
        }, 800);
    };

    const handleLike = (id) => {
        setMessages(prev =>
            prev.map(msg =>
                msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg
            )
        );
    };

    const handleDelete = (id) => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
    };

    const filteredMessages = () => {
        let result = [...messages];

        if (filter === 'recent') {
            result.sort((a, b) => b.timestamp - a.timestamp);
        } else if (filter === 'popular') {
            result.sort((a, b) => b.likes - a.likes);
        }

        return result;
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold mb-6 text-center">Guestbook</h2>

                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="name">
                            Your Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-accent/20"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="message">
                            Your Message
                        </label>
                        <textarea
                            id="message"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-accent/20"
                            rows="3"
                            placeholder="Leave a message for the couple..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="text-right">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`py-2 px-6 rounded-full font-semibold flex items-center space-x-2 ml-auto ${
                                isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-christian-accent text-white hover:shadow-md'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Posting...</span>
                                </>
                            ) : (
                                <>
                                    <Icon path={mdiSend} size={0.8} />
                                    <span>Post Message</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="flex justify-center mb-6">
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${filter === 'all'
                                ? 'bg-christian-accent text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium ${filter === 'recent'
                                ? 'bg-christian-accent text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => setFilter('recent')}
                        >
                            Recent
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${filter === 'popular'
                                ? 'bg-christian-accent text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => setFilter('popular')}
                        >
                            Popular
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto p-6">
                <AnimatePresence>
                    {filteredMessages().length > 0 ? (
                        filteredMessages().map(msg => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mb-6 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{msg.name}</h3>
                                        <p className="text-sm text-gray-500 mb-2">{formatDate(msg.timestamp)}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        aria-label="Delete message"
                                    >
                                        <Icon path={mdiDelete} size={0.8} />
                                    </button>
                                </div>

                                <p className="text-gray-700 mb-3">{msg.message}</p>

                                <button
                                    onClick={() => handleLike(msg.id)}
                                    className="flex items-center space-x-1 text-gray-500 hover:text-christian-accent transition-colors"
                                >
                                    <Icon path={mdiHeart} size={0.7} />
                                    <span>{msg.likes}</span>
                                </button>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-6">
                            <p>No messages yet. Be the first to leave a message!</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Guestbook;