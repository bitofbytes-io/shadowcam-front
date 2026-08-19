import React from "react";
import { shallow } from "enzyme";
import * as posenet from "@tensorflow-models/posenet";
import * as tf from "@tensorflow/tfjs";
import { NewRecordingPage } from "../../../pages/NewRecordingPage/NewRecordingPage";
import { processPose } from "../../../utils/poseUtils";

jest.mock("@tensorflow-models/posenet", () => {
  return {
    load: jest.fn()
  };
});

jest.mock("../../../utils/poseUtils", () => {
  return {
    processPose: jest.fn()
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
  it("Should load and run the configured PoseNet model", async () => {
    const keypointParts = [
      "nose",
      "leftEye",
      "rightEye",
      "leftEar",
      "rightEar",
      "leftShoulder",
      "rightShoulder",
      "leftElbow",
      "rightElbow",
      "leftWrist",
      "rightWrist",
      "leftHip",
      "rightHip",
      "leftKnee",
      "rightKnee",
      "leftAnkle",
      "rightAnkle"
    ];
    const pose = {
      score: 0.9,
      keypoints: keypointParts.map((part, index) => ({
        score: 0.9,
        part,
        position: { x: index, y: index + 1 }
      }))
    };
    const estimateSinglePose = jest.fn().mockResolvedValue(pose);
    posenet.load.mockResolvedValue({ estimateSinglePose });
    processPose.mockReturnValue("noPunch");

    const spy = jest.spyOn(NewRecordingPage.prototype, "componentDidMount");
    spy.mockImplementation(() => {});
    const wrapper = shallow(<NewRecordingPage />);
    const instance = wrapper.instance();
    instance.mediaRecorder = { state: "inactive" };
    instance.videoRef.current = { height: 480, width: 640 };
    wrapper.setState({ recorderSetup: true, trainingState: "stopped" });

    await tf.setBackend("cpu");
    await tf.ready();
    await instance.processPoses();

    expect(tf.getBackend()).toBe("cpu");
    expect(posenet.load).toHaveBeenCalledWith({
      architecture: "MobileNetV1",
      inputResolution: { height: 225, width: 305 },
      multiplier: 0.75,
      outputStride: 16
    });
    expect(estimateSinglePose).toHaveBeenCalledWith(
      instance.videoRef.current,
      { flipHorizontal: true }
    );
    expect(processPose).toHaveBeenCalledWith(pose);
    expect(pose.keypoints).toHaveLength(17);
    expect(pose.keypoints[0]).toEqual({
      score: 0.9,
      part: "nose",
      position: { x: 0, y: 1 }
    });
  });

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
