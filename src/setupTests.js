const { TextDecoder, TextEncoder } = require("util");
const { ReadableStream } = require("stream/web");
const { MessagePort } = require("worker_threads");

global.MessagePort = MessagePort;
global.ReadableStream = ReadableStream;
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

const { configure } = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");

configure({ adapter: new Adapter() });
