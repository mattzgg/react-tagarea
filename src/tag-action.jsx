import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Wrapper = styled.div`
    & > button {
        display: block;
        box-sizing: content-box;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        border: 1px solid white;
        background-color: rgb(0, 149, 255);
        color: white;
        padding: 0;
        text-align: center;
        cursor: pointer;
        & > span {
            vertical-align: middle;
        }
    }
`;

const TagAction = ({ title, onAct, children }) => (
    <Wrapper>
        <button type="button" title={title} onClick={onAct}>
            <span>{children}</span>
        </button>
    </Wrapper>
);

TagAction.propTypes = {
    title: PropTypes.string.isRequired,
    onAct: PropTypes.func,
    children: PropTypes.node,
};

TagAction.defaultProps = {
    onAct: () => {},
    children: null,
};

export default TagAction;
