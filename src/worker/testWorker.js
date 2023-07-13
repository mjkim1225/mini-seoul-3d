import { print } from "../utils/test.ts";


self.onmessage = function (event) {
    const { line, trains, railways } = event.data;

    print(line)

    postMessage(true); //TODO
};
