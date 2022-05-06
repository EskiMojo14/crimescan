import React from "react";
import type { ButtonProps } from "@rmwc/button";
import { Button } from "@rmwc/button";
import BEMHelper from "@s/util/bem-helper";
import type { HTMLProps } from "@s/util/types";
import "./segmented-button.scss";

const bemClasses = new BEMHelper("segmented-button");

type SegmentedButtonProps = HTMLProps & {
  toggle?: boolean;
};

export const SegmentedButton = (props: SegmentedButtonProps) => {
  const { toggle, ...filteredProps } = props;
  return (
    <div {...filteredProps} className={bemClasses({ extra: props.className, modifiers: { toggle: !!toggle } })}>
      {props.children}
    </div>
  );
};

type SegmentedButtonSegmentProps = ButtonProps &
  HTMLProps & {
    selected?: boolean;
  };

export const SegmentedButtonSegment = (props: SegmentedButtonSegmentProps) => {
  const selected = props.selected ? props.selected : false;
  return (
    <Button
      {...props}
      className={bemClasses("segment", { "only-icon": !!props.icon && !props.label, selected }, props.className)}
      outlined
    />
  );
};
