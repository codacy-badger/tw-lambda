import S3 = require("aws-sdk/clients/s3");
import {ClientConfiguration} from "aws-sdk/clients/s3";

export const s3Client = (configs: ClientConfiguration) => new S3(configs);
