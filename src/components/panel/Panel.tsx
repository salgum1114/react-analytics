import React, { HTMLAttributes } from 'react';
import classnames from 'classnames';
import { ErrorBoundary } from '../error';

const Panel = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
    const { children, className, ...other } = props;
    return (
        <ErrorBoundary>
            <div ref={ref} className={classnames('editor-panel', className)} {...other}>
                {children}
            </div>
        </ErrorBoundary>
    );
});

export default Panel;
