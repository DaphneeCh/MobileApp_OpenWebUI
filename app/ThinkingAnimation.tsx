import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';

interface ThinkingAnimationProps {
    style?: object;
}

const ThinkingAnimation = ({ style }: ThinkingAnimationProps) => {
    const [dots, setDots] = useState('.');
    
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => {
                if (prev.length >= 3) return '.';
                return prev + '.';
            });
        }, 500);
        
        return () => clearInterval(interval);
    }, []);
    
    return (
        <Text style={[styles.text, style]}>
            {dots}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        color: '#fff',
    }
});

export default ThinkingAnimation;