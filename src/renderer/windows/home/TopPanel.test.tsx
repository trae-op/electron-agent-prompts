import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useStatusSelectorMock = vi.fn();

type TUserPopoverProps = {
  nav: ReactNode;
  isNewVersionApp: boolean;
};

let capturedUserPopoverProps: TUserPopoverProps | undefined;
let capturedAppVersionProps: { sx?: unknown; variant?: string } | undefined;

const {
  layoutTopPanelMock,
  userPopoverMock,
  ContainerAppVersionMock,
  LightDarkModeToggleMock,
  DownloadedButtonMock,
  LogoutButtonMock,
} = vi.hoisted(() => {
  const layoutTopPanelMock = vi.fn(({ children }: { children: ReactNode }) => (
    <div data-testid="layout-top-panel">{children}</div>
  ));

  const userPopoverMock = vi.fn((props: TUserPopoverProps) => {
    capturedUserPopoverProps = props;
    return (
      <div data-testid="user-popover">
        <div data-testid="user-popover-content">{props.nav}</div>
        <div data-testid="user-popover-flag">
          {props.isNewVersionApp ? "true" : "false"}
        </div>
      </div>
    );
  });

  const ContainerAppVersionMock = vi.fn(
    (props: { sx?: unknown; variant?: string }) => {
      capturedAppVersionProps = props;
      return <div data-testid="app-version" />;
    }
  );

  const LightDarkModeToggleMock = vi.fn(() => (
    <div data-testid="light-dark-mode-toggle" />
  ));

  const DownloadedButtonMock = vi.fn(
    ({ children }: { children: ReactNode }) => (
      <div data-testid="downloaded-button">{children}</div>
    )
  );

  const LogoutButtonMock = vi.fn(({ children }: { children: ReactNode }) => (
    <div data-testid="logout-button">{children}</div>
  ));

  return {
    layoutTopPanelMock,
    userPopoverMock,
    ContainerAppVersionMock,
    LightDarkModeToggleMock,
    DownloadedButtonMock,
    LogoutButtonMock,
  };
});

vi.mock("@layouts/TopPanel", () => ({
  TopPanel: layoutTopPanelMock,
}));

vi.mock("@conceptions/User", () => ({
  UserPopover: userPopoverMock,
}));

vi.mock("@conceptions/Updater", () => ({
  useStatusSelector: () => useStatusSelectorMock(),
  DownloadedButton: DownloadedButtonMock,
}));

vi.mock("@conceptions/Auth", () => ({
  LogoutButton: LogoutButtonMock,
}));

vi.mock("@composites/AppVersion", () => ({
  Container: ContainerAppVersionMock,
}));

vi.mock("@composites/LightDarkMode", () => ({
  Toggle: LightDarkModeToggleMock,
}));

import TopPanel from "./TopPanel";

describe("Home TopPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedUserPopoverProps = undefined;
    capturedAppVersionProps = undefined;
  });

  it("renders layout with default status", () => {
    useStatusSelectorMock.mockReturnValue("idle");

    render(<TopPanel />);

    expect(layoutTopPanelMock).toHaveBeenCalled();
    expect(screen.getByTestId("light-dark-mode-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("user-popover")).toBeInTheDocument();
    expect(capturedUserPopoverProps?.isNewVersionApp).toBe(false);
    expect(screen.getByTestId("downloaded-button")).toBeInTheDocument();
    expect(screen.getByTestId("logout-button")).toBeInTheDocument();
    expect(capturedAppVersionProps?.variant).toBe("caption");
    expect((capturedAppVersionProps?.sx as { width?: string })?.width).toBe(
      "100%"
    );
  });

  it("flags popover when update is downloaded", () => {
    useStatusSelectorMock.mockReturnValue("update-downloaded");

    render(<TopPanel />);

    expect(capturedUserPopoverProps?.isNewVersionApp).toBe(true);
    expect(screen.getByTestId("downloaded-button")).toHaveTextContent("Update");
    expect(screen.getByTestId("logout-button")).toHaveTextContent("Logout");
  });
});
