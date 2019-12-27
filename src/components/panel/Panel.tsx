import React, { HTMLAttributes } from 'react';
import classnames from 'classnames';

const Panel = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
    const { children, className, ...other } = props;
    return (
        <div ref={ref} className={classnames('editor-panel', className)} {...other}>
            {children}
        </div>
    );
});

export default Panel;
