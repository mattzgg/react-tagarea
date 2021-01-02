import React, { useState } from "react";
import Tagarea from "./index";

export default {
    title: "react-tagarea",
    component: Tagarea,
};

const Template = ({
    name,
    tags: initialTags,
    appearanceConfig: initialAppearanceConfig,
    onAddTag,
    onDeleteTag,
    onResize,
}) => {
    const [tags, setTags] = useState(initialTags);
    const [appearanceConfig, setAppearanceConfig] = useState(
        initialAppearanceConfig
    );
    const onAddTagEnhanced = (newTag) => {
        setTags([...tags, newTag]);
        onAddTag(newTag);
    };
    const onDeleteTagEnhanced = (deletedTagIndex) => {
        setTags(tags.filter((tag, index) => index !== deletedTagIndex));
        onDeleteTag(deletedTagIndex);
    };
    const onResizeEnhanced = (newAppearanceConfig) => {
        setAppearanceConfig(newAppearanceConfig);
        onResize(newAppearanceConfig);
    };
    return (
        <Tagarea
            name={name}
            tags={tags}
            appearanceConfig={appearanceConfig}
            onAddTag={onAddTagEnhanced}
            onDeleteTag={onDeleteTagEnhanced}
            onResize={onResizeEnhanced}
        />
    );
};
Template.propTypes = Tagarea.propTypes;
export const Primary = Template.bind({});

Primary.args = {
    name: "skills",
    appearanceConfig: Tagarea.defaultProps.appearanceConfig,
    tags: [
        { text: "React", value: "1" },
        { text: "React Native", value: "2" },
        {
            text:
                "Capable of using React ecosystem and nodejs to develop modern web and mobile applications",
            value: "3",
        },
        { text: "Storybook", value: "4" },
        { text: "Styled components", value: "5" },
        { text: "Webpack and its ecosystem", value: "6" },
        { text: "Economy principles & Basic Accounting", value: "7" },
    ],
};
