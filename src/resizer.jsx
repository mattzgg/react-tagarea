import React from "react";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import styled from "styled-components";
import Location from "./location";

const Wrapper = styled.div`
    position: absolute;
    right: 5px;
    bottom: 5px;
    border-right: 2px solid black;
    border-bottom: 2px solid black;
    box-sizing: border-box;
    width: 15px;
    height: 15px;
    & > div {
        cursor: nwse-resize;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }
`;

class Resizer extends React.Component {
    static propTypes = {
        onResize: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            isResizing: false,
            mouseLocation: null,
        };
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = debounce(this.handleMouseMove.bind(this), 10);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleRef = React.createRef();
    }

    componentDidMount() {
        const handleEl = this.handleRef.current;
        handleEl.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    componentDidUpdate(preProps, preState) {
        const { mouseLocation: preMouseLocation } = preState;
        const { isResizing, mouseLocation } = this.state;
        if (!preMouseLocation || !mouseLocation) return;
        const differences = mouseLocation.getDifferences(preMouseLocation);
        if (isResizing && differences.width !== 0 && differences.height !== 0) {
            const { onResize } = this.props;
            onResize(differences);
        }
    }

    componentWillUnmount() {
        const handleEl = this.handleRef.current;
        handleEl.removeEventListener("mousedown", this.handleMouseDown);
        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseDown(event) {
        this.setState(() => {
            const { pageX, pageY } = event;
            return {
                isResizing: true,
                mouseLocation: new Location(pageX, pageY),
            };
        });
    }

    handleMouseMove(event) {
        this.setState((state) => {
            const { pageX, pageY } = event;
            const { isResizing } = state;
            return isResizing
                ? {
                      ...state,
                      mouseLocation: new Location(pageX, pageY),
                  }
                : null;
        });
    }

    handleMouseUp() {
        this.setState(() => ({
            isResizing: false,
            mouseLocation: null,
        }));
    }

    render() {
        return (
            <Wrapper>
                <div ref={this.handleRef} />
            </Wrapper>
        );
    }
}

export default Resizer;
