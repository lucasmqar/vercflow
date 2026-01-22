import React from 'react';
import { motion } from 'framer-motion';

interface HeaderAnimatedProps {
    title: string;
}

const HeaderAnimated: React.FC<HeaderAnimatedProps> = ({ title }) => {
    // Only animate on desktop (min-width: 1024px)
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

    const animation = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    return (
        <>{
            isDesktop ? (
                <motion.h1
                    className="text-3xl font-black tracking-tighter text-foreground"
                    initial="hidden"
                    animate="visible"
                    variants={animation}
                >
                    {title}
                </motion.h1>
            ) : (
                <h1 className="text-3xl font-black tracking-tighter text-foreground">{title}</h1>
            )}
        </>
    );
};

export default HeaderAnimated;
