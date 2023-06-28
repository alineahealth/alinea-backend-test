import { S3Event, S3EventRecord } from "aws-lambda";

export class MockS3Event {

    static readonly eventWithoutRecords: S3Event = {
        Records: [],
    };

    static readonly recordMock: S3EventRecord = {
        eventVersion: '2.1',
        eventSource: 'aws:s3',
        awsRegion: 'us-east-1',
        eventTime: '2023-06-04T10:00:00Z',
        eventName: 'ObjectCreated:Put',
        userIdentity: {
            principalId: 'EXAMPLE'
        },
        requestParameters: {
            sourceIPAddress: '127.0.0.1'
        },
        responseElements: {
            'x-amz-request-id': 'EXAMPLE123456789',
            'x-amz-id-2': 'EXAMPLEabcdefghijklmno123456789'
        },
        s3: {
            s3SchemaVersion: '1.0',
            configurationId: 'EXAMPLEConfigId',
            bucket: {
                name: 'example-bucket',
                ownerIdentity: {
                    principalId: 'EXAMPLE'
                },
                arn: 'arn:aws:s3:::example-bucket'
            },
            object: {
                key: 'example-object.txt',
                size: 1024,
                eTag: 'EXAMPLEETAG123456789',
                versionId: 'EXAMPLEVERSION123456789',
                sequencer: 'EXAMPLESEQUENCER123456789'
            }
        }
    };

}
