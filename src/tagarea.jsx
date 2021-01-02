import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import _ from "lodash";

import Resizer from "./resizer";
import Tag from "./tag";
import TagAction from "./tag-action";
import {
    calculateTagBoundary,
    calculatePaddings,
    calculateTagMaxWidth,
    calculateMinimumHeight,
} from "./tagarea-layout-calculator";

const Layout = styled.div`
    box-sizing: border-box;
    font: ${({ font }) => font};
    width: ${({ size: { width } }) => `${width}px`};
    height: ${({ size: { height } }) => `${height}px`};
    position: relative;
    resize: none !important;
    overflow: hidden !important;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    & > textarea {
        box-sizing: border-box;
        resize: none !important;
        flex: 1;
        font: ${({ font }) => font};
        border-width: ${({ borderWidth }) => `${borderWidth}px`};
        padding-left: ${({ paddings: { left } }) => `${left}px`};
        padding-top: ${({ paddings: { top } }) => `${top}px`};
        padding-right: ${({ paddings: { right } }) => `${right}px`};
        padding-bottom: ${({ paddings: { bottom } }) => `${bottom}px`};
    }
`;
Layout.propTypes = {
    font: PropTypes.string.isRequired,
    size: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }).isRequired,
    borderWidth: PropTypes.number.isRequired,
    paddings: PropTypes.shape({
        left: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
        right: PropTypes.number.isRequired,
        bottom: PropTypes.number.isRequired,
    }).isRequired,
};

function getDefaultTagBoundaries(tags, appearanceConfig) {
    return tags.reduce((accumulator, tag, index) => {
        accumulator[index] = calculateTagBoundary(appearanceConfig);
        return accumulator;
    }, {});
}

export default class Tagarea extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        tags: PropTypes.arrayOf(
            PropTypes.shape({
                text: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            })
        ).isRequired,
        appearanceConfig: PropTypes.shape({
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired,
            borderWidth: PropTypes.number.isRequired,
            tagSpacing: PropTypes.number.isRequired,
            font: PropTypes.string.isRequired,
        }),
        onAddTag: PropTypes.func.isRequired,
        onDeleteTag: PropTypes.func.isRequired,
        onResize: PropTypes.func.isRequired,
    };

    static defaultProps = {
        appearanceConfig: {
            width: 500,
            height: 300,
            borderWidth: 2,
            tagSpacing: 10,
            font: "16px Arial, Helvetica, sans-serif",
        },
    };

    constructor(props) {
        super(props);
        const { tags, appearanceConfig } = this.props;

        this.state = {
            text: "",
            newTagText: "",
            tagBoundaries: getDefaultTagBoundaries(tags, appearanceConfig),
        };

        this.tagComponents = {};
        this.setTagComponent = (index, tagComponent) => {
            this.tagComponents[index] = tagComponent;
        };

        this.handleChangeText = this.handleChangeText.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleDeleteTag = this.handleDeleteTag.bind(this);
        this.handleResize = this.handleResize.bind(this);

        this.layoutRef = React.createRef();
        this.textareaRef = React.createRef();
    }

    componentDidMount() {
        this.updateTagBoundaries();
    }

    componentDidUpdate(preProps, preState) {
        const { tags, appearanceConfig } = this.props;
        const {
            tags: preTags,
            appearanceConfig: preAppearanceConfig,
        } = preProps;
        if (tags !== preTags || appearanceConfig !== preAppearanceConfig) {
            this.updateTagBoundaries();
        }

        const { newTagText } = this.state;
        const { newTagText: preNewTagText } = preState;
        if (!preNewTagText && newTagText) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                newTagText: "",
            });
            const newTag = {
                text: newTagText,
                value: newTagText,
            };
            const { onAddTag } = this.props;
            onAddTag(newTag);
        }

        const textarea = this.textareaRef.current;
        const minimumHeight = calculateMinimumHeight(
            appearanceConfig,
            textarea
        );
        const { height } = appearanceConfig;
        if (height < minimumHeight) {
            const { onResize } = this.props;
            onResize({
                ...appearanceConfig,
                height: minimumHeight,
            });
        }
    }

    handleChangeText(event) {
        this.setState((state) => {
            const nextText = event.target.value;
            return {
                ...state,
                text: nextText,
            };
        });
    }

    handleKeyPress(event) {
        const { key } = event;
        if (key !== "Enter") return;

        this.setState((state) => {
            const { text: newTagText } = state;
            return {
                text: "",
                newTagText,
            };
        });

        event.preventDefault();
    }

    handleKeyDown(event) {
        const { key } = event;
        if (key === "Backspace") {
            const { text } = this.state;
            if (text.length) return;

            const { tags } = this.props;
            const deletedTagIndex = tags.length - 1;
            if (deletedTagIndex !== -1) {
                this.handleDeleteTag(deletedTagIndex);
                event.preventDefault();
            }
        }
    }

    handleDeleteTag(deletedTagIndex) {
        const { onDeleteTag } = this.props;
        onDeleteTag(deletedTagIndex);
    }

    handleResize(differences) {
        const { appearanceConfig, onResize } = this.props;
        const { width, height } = appearanceConfig;
        onResize({
            ...appearanceConfig,
            width: width + differences.width,
            height: height + differences.height,
        });
    }

    updateTagBoundaries() {
        this.setState((state, props) => {
            const nextTagBoundaries = {};
            const { tags, appearanceConfig } = props;

            for (let i = 0; i < tags.length; i += 1) {
                const tagComponent = this.tagComponents[i];
                const tagSize = tagComponent.getSize();
                nextTagBoundaries[i] = calculateTagBoundary(
                    appearanceConfig,
                    i > 0 ? nextTagBoundaries[i - 1] : null,
                    tagSize
                );
            }
            return {
                ...state,
                tagBoundaries: nextTagBoundaries,
            };
        });
    }

    render() {
        const { name, tags, appearanceConfig } = this.props;
        const { width, height, borderWidth, font } = appearanceConfig;
        const { text, tagBoundaries } = this.state;
        const size = {
            width,
            height,
        };
        const defaultTagBoundary = calculateTagBoundary(appearanceConfig);
        const tagsCount = tags.length;
        const paddings = calculatePaddings(
            appearanceConfig,
            tagsCount > 0
                ? tagBoundaries[tagsCount - 1] || defaultTagBoundary
                : null,
            text
        );
        const tagMaxWidth = calculateTagMaxWidth(appearanceConfig);

        this.tagComponents = {};

        return (
            <Layout
                ref={this.layoutRef}
                size={size}
                borderWidth={borderWidth}
                font={font}
                paddings={paddings}
            >
                <textarea
                    ref={this.textareaRef}
                    name={name}
                    value={text}
                    onChange={this.handleChangeText}
                    onKeyPress={this.handleKeyPress}
                    onKeyDown={this.handleKeyDown}
                />
                <Resizer onResize={this.handleResize} />
                {_.map(tags, (tag, index) => (
                    <Tag
                        key={index}
                        data={tag}
                        boundary={tagBoundaries[index] || defaultTagBoundary}
                        maxWidth={tagMaxWidth}
                        ref={this.setTagComponent.bind(this, index)}
                    >
                        <TagAction
                            title="Delete"
                            onAct={() => {
                                this.handleDeleteTag(index);
                            }}
                        >
                            &times;
                        </TagAction>
                    </Tag>
                ))}
            </Layout>
        );
    }
}
