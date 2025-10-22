import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import presentationData from '../data/presentationData.json';
import styles from './Presentation.module.css';

interface BulletItem {
    text: string;
    styles?: string;
    link?: string;
}

interface SlideImage {
    src: string;
    width?: number;
    height?: number;
    alt?: string;
}

interface Slide {
    title: string;
    subtext: (string | BulletItem)[];
    images?: SlideImage[];
}

// Helper function to parse inline styles from string
const parseInlineStyles = (styleString: string): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    if (!styleString) return styles;

    console.log('Parsing styles:', styleString); // Debug log

    styleString.split(';').forEach(style => {
        const [property, value] = style.split(':').map(s => s.trim());
        if (property && value) {
            // Convert kebab-case to camelCase for React
            const camelProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            (styles as any)[camelProperty] = value;
        }
    });

    console.log('Parsed styles object:', styles); // Debug log
    return styles;
};

const Presentation: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides] = useState<Slide[]>(presentationData);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                goToPreviousSlide();
            } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                goToNextSlide();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentSlide]);

    const goToNextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const goToPreviousSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const goToSlide = (slideIndex: number) => {
        if (slideIndex >= 0 && slideIndex < slides.length) {
            setCurrentSlide(slideIndex);
        }
    };

    if (slides.length === 0) {
        return (
            <Container className="py-4 text-center">
                <h2>No presentation data available</h2>
            </Container>
        );
    }

    const currentSlideData = slides[currentSlide];

    return (
        <Container fluid className={styles.presentationContainer}>
            <div className={`${styles.slide} ${styles.fadeIn}`} key={currentSlide}>
                <h1 className={styles.slideTitle}>
                    {currentSlideData.title}
                </h1>

                {currentSlideData.subtext && currentSlideData.subtext.length > 0 && (
                    <ul className={styles.bulletPoints}>
                        {currentSlideData.subtext.map((bullet, index) => (
                            <li key={index} className={styles.bulletPoint}>
                                {typeof bullet === 'string' ? (
                                    bullet
                                ) : (
                                    bullet.link ? (
                                        <a
                                            href={bullet.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={(() => {
                                                let className = styles.customLink;
                                                if (bullet.styles) {
                                                    // Extract color from styles string
                                                    const colorMatch = bullet.styles.match(/color:\s*([^;]+)/);
                                                    if (colorMatch) {
                                                        const color = colorMatch[1].trim();
                                                        // Map common colors to CSS classes
                                                        if (color === 'blue') className += ' ' + styles.blue;
                                                        else if (color === 'red') className += ' ' + styles.red;
                                                        else if (color === 'green') className += ' ' + styles.green;
                                                        else if (color === 'yellow') className += ' ' + styles.yellow;
                                                        else if (color === 'purple') className += ' ' + styles.purple;
                                                        else if (color === 'orange') className += ' ' + styles.orange;
                                                    }
                                                }
                                                console.log('Link className:', className); // Debug log
                                                return className;
                                            })()}
                                            style={bullet.styles ? (() => {
                                                const customStyles = parseInlineStyles(bullet.styles);
                                                // Remove color from inline styles since we handle it with CSS classes
                                                delete customStyles.color;
                                                return customStyles;
                                            })() : undefined}
                                        >
                                            {bullet.text}
                                        </a>
                                    ) : (
                                        <span style={bullet.styles ? parseInlineStyles(bullet.styles) : undefined}>
                                            {bullet.text}
                                        </span>
                                    )
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                {currentSlideData.images && currentSlideData.images.length > 0 && (
                    <div className={styles.slideImages}>
                        {currentSlideData.images.map((image, index) => (
                            <img
                                key={index}
                                src={image.src}
                                alt={image.alt || `Slide image ${index + 1}`}
                                className={styles.slideImage}
                                style={{
                                    width: image.width ? `${image.width}px` : 'auto',
                                    height: image.height ? `${image.height}px` : 'auto'
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.navigation}>
                <Button
                    variant="primary"
                    className={styles.navButton}
                    onClick={goToPreviousSlide}
                    disabled={currentSlide === 0}
                    title="Previous slide (← or ↑)"
                >
                    &lt;
                </Button>

                <div className={styles.slideCounter}>
                    {currentSlide + 1} / {slides.length}
                </div>

                <Button
                    variant="primary"
                    className={styles.navButton}
                    onClick={goToNextSlide}
                    disabled={currentSlide === slides.length - 1}
                    title="Next slide (→ or ↓)"
                >
                    &gt;
                </Button>
            </div>

            {/* Slide indicators */}
            <div style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                display: 'flex',
                gap: '0.5rem'
            }}>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: index === currentSlide
                                ? 'var(--avans-primary)'
                                : 'var(--bs-accent)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        title={`Go to slide ${index + 1}: ${slides[index].title}`}
                    />
                ))}
            </div>
        </Container>
    );
};

export default Presentation;
