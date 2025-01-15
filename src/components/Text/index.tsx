import React from 'react';

export enum TextSize {
    SMALL = '1rem',
    MEDIUM = '1.2rem',
    LARGE = '1.5rem',
}

export enum FontWeight {
    NORMAL = 'normal',
    BOLD = 'bold',
}

interface TextProps {
    size?: TextSize;
    weight?: FontWeight;
    component?: React.ElementType;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

function Text({ size = TextSize.MEDIUM, weight = FontWeight.NORMAL, component: Component = 'p', children, style = {} }: TextProps) {
    const styles: React.CSSProperties = {
        fontSize: size,
        fontWeight: weight,
        ...style,
    };

    return <Component style={styles}>{children}</Component>;
}

export default Text;