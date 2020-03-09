import React from 'react';

interface IProps {
    value?: any;
}

const Label: React.SFC<IProps> = props => {
    const { value } = props;
    return (
        <span style={{ fontWeight: 'bold' }}>
            {value}
        </span>
    );
};

export default Label;
