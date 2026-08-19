import React from "react";
import { shallow } from "enzyme";
import { NewRecordingPage } from "../../../pages/NewRecordingPage/NewRecordingPage";

jest.mock("@tensorflow-models/posenet", () => {
  return {
    load: jest.fn(() => {})
  };
});

describe("NewRecordingPage render", () => {
  it("Should render NewRecordingPage component without crashing", () => {
    Object.defineProperty(window.navigator, "mediaDevices", {
      value: {
        getUserMedia: () => {
          return Promise.resolve();
        }
      },
      writable: true
    });

    const spy = jest.spyOn(NewRecordingPage.prototype, "componentDidMount");
    spy.mockImplementation(() => {});
    shallow(<NewRecordingPage />);
  });

  it("Should match NewRecordingPage component snapshot", () => {
    Object.defineProperty(window.navigator, "mediaDevices", {
      value: {
        getUserMedia: () => {
          return Promise.resolve();
        }
      },
      writable: true
    });

    const spy = jest.spyOn(NewRecordingPage.prototype, "componentDidMount");
    spy.mockImplementation(() => {});
    const wrapper = shallow(<NewRecordingPage />);
    expect(wrapper.debug().replace(/[ \t]+$/gm, "")).toMatchSnapshot();
  });
});

describe("NewRecordingPage start training tests", () => {
  it("Should set training state to running when called", () => {
    Object.defineProperty(window.navigator, "mediaDevices", {
      value: {
        getUserMedia: () => {
          return Promise.resolve();
        }
      },
      writable: true
    });

    const spy = jest.spyOn(NewRecordingPage.prototype, "componentDidMount");
    spy.mockImplementation(() => {});
    const wrapper = shallow(<NewRecordingPage />);
    const instance = wrapper.instance();

    expect(wrapper.state("trainingState")).toEqual("stopped");
    instance.handleStartTraining();
    expect(wrapper.state("trainingState")).toEqual("running");
  });

  it("Should set training state to running when rest is over", () => {
    Object.defineProperty(window.navigator, "mediaDevices", {
      value: {
        getUserMedia: () => {
          return Promise.resolve();
        }
      },
      writable: true
    });

    const spy = jest.spyOn(NewRecordingPage.prototype, "componentDidMount");
    spy.mockImplementation(() => {});
    const wrapper = shallow(<NewRecordingPage />);
    const instance = wrapper.instance();

    expect(wrapper.state("trainingState")).toEqual("stopped");
    instance.handleStopRest();
    expect(wrapper.state("trainingState")).toEqual("running");
  });

  it("Should set training state to pause when user pauses recording", () => {
    Object.defineProperty(window.navigator, "mediaDevices", {
      value: {
        getUserMedia: () => {
          return Promise.resolve();
        }
      },
      writable: true
    });

    const spy = jest.spyOn(NewRecordingPage.prototype, "componentDidMount");
    spy.mockImplementation(() => {});
    const wrapper = shallow(<NewRecordingPage />);

    const instance = wrapper.instance();
    instance.mediaRecorder = {};
    instance.mediaRecorder.state = "not_paused";

    expect(wrapper.state("trainingState")).toEqual("stopped");
    instance.handlePauseTraining();
    expect(wrapper.state("trainingState")).toEqual("running");
  });

  it("Should set training state to stop when training is over", () => {
    Object.defineProperty(window.navigator, "mediaDevices", {
      value: {
        getUserMedia: () => {
          return Promise.resolve();
        }
      },
      writable: true
    });

    const spy = jest.spyOn(NewRecordingPage.prototype, "componentDidMount");
    spy.mockImplementation(() => {});
    const wrapper = shallow(<NewRecordingPage />);
    const instance = wrapper.instance();

    expect(wrapper.state("trainingState")).toEqual("stopped");
    instance.handleStopTraining();
    expect(wrapper.state("trainingState")).toEqual("done");
  });

  it("Should set training state to rest when user is resting", () => {
    Object.defineProperty(window.navigator, "mediaDevices", {
      value: {
        getUserMedia: () => {
          return Promise.resolve();
        }
      },
      writable: true
    });

    const spy = jest.spyOn(NewRecordingPage.prototype, "componentDidMount");
    spy.mockImplementation(() => {});
    const wrapper = shallow(<NewRecordingPage />);
    const instance = wrapper.instance();

    expect(wrapper.state("trainingState")).toEqual("stopped");
    instance.handleRestTraining();
    expect(wrapper.state("trainingState")).toEqual("resting");
  });
});
