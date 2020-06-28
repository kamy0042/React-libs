import * as React from 'react';
import { css } from '@emotion/core';

// context
// ------------------------
interface context {
    isOpen: boolean;
    currentClass: string;
    onClick?(): void;
}

const initialContext: context = {
    isOpen: false,
    currentClass: 'close',
};

const toggleContext = React.createContext(initialContext);

const useToggleContext = () => {
    const context = React.useContext(toggleContext);
    if (!context) {
        throw new Error(
            `WithToggle compound components cannot be rendered outside the WithToggle component`,
        );
    }

    return context;
};

// render
// --------------------------
export const WithToggle: React.FC = ({ children }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const onClick = React.useCallback(() => setIsOpen(!isOpen), [isOpen]);
    const currentClass = isOpen ? 'open' : 'close';

    const value = React.useMemo(() => ({ isOpen, currentClass, onClick }), [isOpen]);

    return <toggleContext.Provider value={value}>{children}</toggleContext.Provider>;
};

export const WithToggleTrigger: React.FC = ({ children }) => {
    const { onClick, currentClass } = useToggleContext();

    return (
        <div role="button" onClick={onClick} className={currentClass} css={triggerCss}>
            {children}
        </div>
    );
};
export const WithToggleContents: React.FC = ({ children }) => {
    const { currentClass } = useToggleContext();

    return (
        <div className={currentClass} css={contentsCss}>
            {children}
        </div>
    );
};

// style
// ----------------------------
const triggerCss = css`
    display: flex;
    align-items: center;
    :hover {
        cursor: pointer;
    }
    &:after {
        content: '';
        width: 0.5em;
        height: 0.5em;
        border-top: solid 2px #333;
        border-right: solid 2px #333;
        transform: rotate(45deg);
        transform-origin: center;
        display: block;
        margin-left: 1.5rem;
        transition: 0.2s;
        transition-timing-function: cubic-bezier(0.43, 0.26, 0.72, 1.02);
    }
    &.open::after {
        transform: rotate(135deg);
    }
`;

const contentsCss = css`
    transform: scaleY(0);
    transition: 0.2s;
    transition-timing-function: cubic-bezier(0.3, 0.78, 0.92, 0.82);
    transform-origin: top;
    height: 0;
    &.open {
        transform: scaleY(1);
        height: auto;
    }
`;
