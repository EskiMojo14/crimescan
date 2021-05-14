import React from "react";
import { render } from "@testing-library/react";

import { SegmentedButton, SegmentedButtonSegment } from "./SegmentedButton";

describe("<SegmentedButton />", () => {
  it("generates element with necessary class", async () => {
    const { container } = render(<SegmentedButton />);
    expect(container.firstChild).toHaveClass("segmented-button");
  });
  it("adds toggle class if prop is added", async () => {
    const { container } = render(<SegmentedButton toggle />);
    expect(container.firstChild).toHaveClass("segmented-button--toggle");
  });
  it("generates element with additional classes if specified", async () => {
    const { container } = render(<SegmentedButton className="test-class" />);
    expect(container.firstChild).toHaveClass("test-class");
  });
});
