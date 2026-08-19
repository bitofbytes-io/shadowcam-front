import React from "react";
import { mount } from "enzyme";
import { BrowserRouter, Link } from "react-router-dom";
import { getRouterBasename, Routes } from "../../routes/routes";
import LoginPage from "../../pages/LoginPage/LoginPage";
import PastWorkoutsPage from "../../pages/PastWorkoutsPage/PastWorkoutsPage";

jest.mock("react-redux", () => ({
  connect: () => Component => Component
}));

jest.mock("../../pages/LoginPage/LoginPage", () => {
  const React = require("react");
  const { Link } = require("react-router-dom");

  return function MockLoginPage() {
    return React.createElement(
      Link,
      { id: "create-account", to: "/account/create" },
      "Create account"
    );
  };
});

jest.mock("../../pages/PastWorkoutsPage/PastWorkoutsPage", () => {
  return function MockPastWorkoutsPage() {
    return null;
  };
});

describe("Routes basename", () => {
  const originalPublicUrl = process.env.PUBLIC_URL;
  let wrapper;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = undefined;
    }
    window.history.replaceState({}, "", "/");
    if (originalPublicUrl === undefined) {
      delete process.env.PUBLIC_URL;
    } else {
      process.env.PUBLIC_URL = originalPublicUrl;
    }
  });

  it.each([
    [undefined, undefined],
    ["", undefined],
    ["/", undefined],
    ["/shadowcam-front", "/shadowcam-front"],
    ["/shadowcam-front/", "/shadowcam-front"],
    ["https://example.com", undefined],
    ["https://example.com/shadowcam-front/", "/shadowcam-front"]
  ])("derives %p as router basename %p", (publicUrl, expected) => {
    expect(getRouterBasename(publicUrl)).toBe(expected);
  });

  it("preserves root routing when PUBLIC_URL is empty", () => {
    delete process.env.PUBLIC_URL;
    window.history.replaceState({}, "", "/account/login");

    wrapper = mount(<Routes isAuth={false} />);

    expect(wrapper.find(BrowserRouter).prop("basename")).toBeUndefined();
    expect(wrapper.find(LoginPage)).toHaveLength(1);
  });

  it("matches direct navigation and prefixes links under PUBLIC_URL", () => {
    process.env.PUBLIC_URL = "/shadowcam-front/";
    window.history.replaceState({}, "", "/shadowcam-front/account/login");

    wrapper = mount(<Routes isAuth={false} />);

    expect(wrapper.find(BrowserRouter).prop("basename")).toBe(
      "/shadowcam-front"
    );
    expect(wrapper.find(LoginPage)).toHaveLength(1);
    expect(wrapper.find(Link).prop("to")).toBe("/account/create");
    expect(wrapper.find("a#create-account").prop("href")).toBe(
      "/shadowcam-front/account/create"
    );
  });

  it("uses an absolute PUBLIC_URL pathname for navigation and links", () => {
    process.env.PUBLIC_URL = "https://example.com/shadowcam-front/";
    window.history.replaceState({}, "", "/shadowcam-front/account/login");

    wrapper = mount(<Routes isAuth={false} />);

    expect(wrapper.find(BrowserRouter).prop("basename")).toBe(
      "/shadowcam-front"
    );
    expect(wrapper.find(LoginPage)).toHaveLength(1);
    expect(wrapper.find("a#create-account").prop("href")).toBe(
      "/shadowcam-front/account/create"
    );
  });

  it("keeps redirects inside an absolute PUBLIC_URL pathname", () => {
    process.env.PUBLIC_URL = "https://example.com/shadowcam-front/";
    window.history.replaceState({}, "", "/shadowcam-front/account/login");

    wrapper = mount(<Routes isAuth />);

    expect(wrapper.find(PastWorkoutsPage)).toHaveLength(1);
    expect(window.location.pathname).toBe(
      "/shadowcam-front/workouts/pastWorkouts"
    );
  });
});
