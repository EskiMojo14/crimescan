import type { ButtonProps } from "@rmwc/button";
import { Button } from "@rmwc/button";
import BEMHelper from "@s/util/bem-helper";
import type { HTMLProps } from "@s/util/types";
import "./segmented-button.module.scss";

const bemClasses = new BEMHelper("segmented-button");

type SegmentedButtonProps = HTMLProps & {
  toggle?: boolean;
};

export const SegmentedButton = ({ children, className, toggle, ...props }: SegmentedButtonProps) => (
  <div {...props} className={bemClasses({ extra: className, modifiers: { toggle: !!toggle } })}>
    {children}
  </div>
);

type SegmentedButtonSegmentProps = ButtonProps &
  HTMLProps & {
    selected?: boolean;
  };

export const SegmentedButtonSegment = ({ selected = false, ...props }: SegmentedButtonSegmentProps) => (
  <Button
    {...props}
    className={bemClasses("segment", { "only-icon": !!props.icon && !props.label, selected }, props.className)}
    outlined
  />
);
