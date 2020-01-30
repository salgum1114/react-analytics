import React, { Component } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

interface IProps {
    style?: React.CSSProperties;
    className?: string;
    children?: (width: number, height: number) => React.ReactNode;
}

interface IState {
    width: number;
    height: number;
}

class Resizer extends Component<IProps, IState> {
    private container = React.createRef<HTMLDivElement>();
    private resizeObserver: ResizeObserver;

    state: IState = {
        width: 0,
        height: 0,
    }

    componentDidMount() {
        this.createObserver();
    }

    componentWillUnmount() {
        this.cancelObserver();
    }

    createObserver = () => {
        this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
            const { width = 0, height = 0 } = entries[0] && entries[0].contentRect || {};
            this.setState({
                width,
                height,
            });
        });
        this.resizeObserver.observe(this.container.current);
    }

    cancelObserver = () => {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }

    render() {
        const { children, style, className } = this.props;
        const { width, height } = this.state;
        return (
            <div ref={this.container} style={{ width: '100%', height: '100%', ...style }} className={className}>
                {children(width, height)}
            </div>
        );
    }
}

export default Resizer;
