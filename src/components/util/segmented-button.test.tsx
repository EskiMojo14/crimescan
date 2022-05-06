import React from "react";
import { render, screen } from "@testing-library/react";

import { SegmentedButton, SegmentedButtonSegment } from "./segmented-button";

describe("<SegmentedButton />", () => {
  it("generates element with necessary class", async () => {
    render(<SegmentedButton data-testid="button" />);
    const button = screen.getByTestId("button");
    expect(button).toHaveClass("segmented-button");
  });
  it("adds toggle class if prop is added", async () => {
    render(<SegmentedButton data-testid="button" toggle />);
    const button = screen.getByTestId("button");
    expect(button).toHaveClass("segmented-button--toggle");
  });
  it("generates element with additional classes if specified", async () => {
    render(<SegmentedButton className="test-class" data-testid="button" />);
    const button = screen.getByTestId("button");
    expect(button).toHaveClass("test-class");
  });
});

describe("<SegmentedButtonSegment />", () => {
  it("generates element with necessary class", async () => {
    render(<SegmentedButtonSegment />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("segmented-button__segment");
  });
  it("adds selected class if prop is added", async () => {
    render(<SegmentedButtonSegment selected />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("segmented-button__segment--selected");
  });
  it("adds `only-icon` modifier if only an icon is provided", async () => {
    render(<SegmentedButtonSegment icon="home" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("segmented-button__segment--only-icon");
  });
  it("generates element with additional classes if specified", async () => {
    render(<SegmentedButtonSegment className="test-class" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("test-class");
  });
});
