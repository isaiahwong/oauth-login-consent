import grpc from 'grpc';
import { GrpcClient } from 'grpc-utils';
import _GrpcClient from './GrpcClient';

const Client = __PROD__ ? GrpcClient : _GrpcClient;

const FILE = '/accounts/v1/accounts.proto';
const PROTO = `${__dirname}/../proto/api`;
const INCLUDES = [
  PROTO,
  `${__dirname}/../proto/third_party/googleapis`,
];
const defaultRetries = {
  rpcMaxRetries: 5,
  rpcRetryInterval: 3000
};

class AccountsService extends Client {
  static getMetadataHeaders(req) {
    const metadata = new grpc.Metadata();
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const headers = { ...req.headers, method: req.method, 'x-forwarded-for': ip };
    Object.keys(headers).forEach((k) => {
      if (!headers[k]) {
        return;
      }
      const v = typeof headers[k] === 'object'
        ? JSON.stringify(headers[k])
        : headers[k];
      metadata.set(k, v);
    });
    return metadata;
  }

  constructor({
    protoPath = PROTO + FILE,
    serviceURL = 'accounts-service:50051',
    packageDef = 'api.accounts.v1',
    includeDirs = INCLUDES,
  } = {}) {
    super(protoPath, packageDef, {
      ...defaultRetries,
      serviceURL,
      includeDirs,
    });
  }
}

export default AccountsService;
