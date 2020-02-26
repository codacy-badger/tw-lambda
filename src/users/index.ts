import { APIGatewayEvent } from "aws-lambda";
import { Map } from "immutable";
import _ from "lodash";
import moment from "moment";
import R from "ramda";
import { Observable } from "rxjs";
import S from "sanctuary";
import { Logger } from "winston";
// @ts-ignore
import { Environment } from "../../../lib/src/constants";
// @ts-ignore
import { prefixDateTime } from "../../../lib/src/logics";
import { getTwClient } from "../tw";
import { s3Client } from "../upload";
import { lookupAndUpload } from "./lookupAndUpload";
import UsersLookupParameters from "./UsersLookupParameters";

/**
 * lambdaFunc is a lambda function which will be invoked.
 * @param envs
 * @param logger
 * @param event
 */
// tslint:disable-next-line:max-line-length
export const lambdaFunc = (envs: Map<string, string | Environment | undefined>, logger: Logger, event: APIGatewayEvent): Observable<any> | undefined => {
    const s3 = s3Client({ accessKeyId: envs.get("S3_ACCESS_KEY_ID"), secretAccessKey: envs.get("S3_SECRET_ACCESS_KEY") });
    const tw = getTwClient({
        consumer_key: envs.get("CONSUMER_API_KEY") as string,
        consumer_secret: envs.get("CONSUMER_API_SECRET_KEY") as string,
        access_token_key: envs.get("ACCESS_TOKEN") as string,
        access_token_secret: envs.get("ACCESS_SECRET") as string,
    });
    const key = prefixDateTime("YYYY-MM-DD-HH:mm:ss")("users.json", moment());
    const result = lookupAndUpload({
        Bucket: envs.get("S3_BUCKET_NAME") as string,
        Key: key,
    }, s3, tw)(new UsersLookupParameters(
        _.get(event, "body.screenNames", []),
        _.get(event, "body.userIds", []),
        _.get(event, "body.includeEntities", false),
        _.get(event, "body.tweetMode", false),
    ));

    // @ts-ignore
    return S.either(logger.error)(R.identity)(result);
};

export default lambdaFunc;
