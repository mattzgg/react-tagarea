import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Location from "./location";
import Boundary from "./boundary";
import { getElementSize } from "./mootools-dimensions";

const Layout = styled.div`
    box-sizing: border-box;
    position: absolute;
    left: ${({ location: { x } }) => `${x}px`};
    top: ${({ location: { y } }) => `${y}px`};
    max-width: ${({ maxWidth }) => `${maxWidth}px`};
    display: flex;
    flex-direction: row;
    border: 1px solid rgb(0, 149, 255);
    background-color: rgb(0, 149, 255);
    color: white;
    padding: 2px;
    border-radius: 4px;
    align-items: center;
    & > div:nth-child(1) {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 8px;
    }
`;
Layout.propTypes = {
    location: PropTypes.instanceOf(Location).isRequired,
    maxWidth: PropTypes.number.isRequired,
};

export default class Tag extends React.Component {
    static propTypes = {
        data: PropTypes.shape({
            text: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        }).isRequired,
        boundary: PropTypes.instanceOf(Boundary).isRequired,
        maxWidth: PropTypes.number.isRequired,
        children: PropTypes.node.isRequired,
    };

    constructor(props) {
        super(props);

        this.layoutRef = React.createRef();
    }

    getData() {
        const { data } = this.props;
        return data;
    }

    getBoundary() {
        const { boundary } = this.props;
        return boundary;
    }

    getMaxWidth() {
        const { maxWidth } = this.props;
        return maxWidth;
    }

    getSize() {
        const size = getElementSize(this.layoutRef.current);
        return {
            width: size.x,
            height: size.y,
        };
    }

    render() {
        const {
            data: { text },
            boundary: { topLeft: location },
            maxWidth,
            children,
        } = this.props;

        return (
            <Layout
                ref={this.layoutRef}
                location={location}
                maxWidth={maxWidth}
            >
                <div title={text}>{text}</div>
                <div>{children}</div>
            </Layout>
        );
    }
}
