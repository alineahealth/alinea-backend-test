import { Context } from "aws-lambda";

class MockContext implements Context {
    awsRequestId: string;
    getRemainingTimeInMillis: () => number;
    functionName: string;
    functionVersion: string;
    invokedFunctionArn: string;
    memoryLimitInMB: string;
    callbackWaitsForEmptyEventLoop: boolean;
    logGroupName: string;
    logStreamName: string;
    done: jest.Mock<void, []>;
    fail: jest.Mock<void, [Error]>;
    succeed: jest.Mock<void, [any]>;

    constructor() {
        this.awsRequestId = "mockRequestId";
        this.getRemainingTimeInMillis = () => 5000;
        this.functionName = "mockFunctionName";
        this.functionVersion = "mockFunctionVersion";
        this.invokedFunctionArn = "mockInvokedFunctionArn";
        this.memoryLimitInMB = "256";
        this.callbackWaitsForEmptyEventLoop = true;
        this.logGroupName = "mockLogGroupName";
        this.logStreamName = "mockLogStreamName";
        this.done = jest.fn();
        this.fail = jest.fn();
        this.succeed = jest.fn();
    }
}

export const context: Context = new MockContext();
