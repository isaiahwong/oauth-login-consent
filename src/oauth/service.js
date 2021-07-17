import * as grpc from '@grpc/grpc-js';
import { GrpcClient } from 'grpc-utils';
import _GrpcClient from './GrpcClient';

const Client = __PROD__ ? GrpcClient : _GrpcClient;

const FILE = '/ecosystem/accounts/v1/accounts.proto';
const PROTO = `${__dirname}/../api`;
const INCLUDES = [
  PROTO,
  `${__dirname}/../api/third_party/googleapis`,
];
const defaultRetries = {
  rpcMaxRetries: 5,
  rpcRetryInterval: 3000
};

class AccountsService extends Client {
  static getMetadataHeaders(headers = {}, match = {}) {
    const metadata = new grpc.Metadata();

    Object.keys(headers).forEach((k) => {
      if (!headers[k]) {
        return;
      }
      const v = typeof headers[k] === 'object'
        ? JSON.stringify(headers[k])
        : headers[k];
      if (match) {
        if (typeof match[k] !== 'undefined') {
          metadata.set(k, v);
        }
      }
      else {
        metadata.set(k, v);
      }
    });
    return metadata;
  }

  constructor({
    protoPath = PROTO + FILE,
    serviceURL = 'accounts-service:50051',
    packageDef = 'api.accounts.v1',
    includeDirs = INCLUDES,
    deadline,
  } = {}) {
    super(protoPath, packageDef, {
      ...defaultRetries,
      serviceURL,
      includeDirs,
      deadline
    });
  }
}

export default AccountsService;
