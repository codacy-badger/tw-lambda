import { ManagedUpload } from "aws-sdk/lib/s3/managed_upload";
import { ValidationError } from "class-validator";
import { map } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { Map } from "immutable";
import { createLogger, Environment, getEnvs, LogLevel, prefixDateTime } from "jianhan-fp-lib";
import moment from "moment";
import { Observable } from "rxjs";
import S from "sanctuary";
import { Logger } from "winston";
import SendData = ManagedUpload.SendData;
import { Envs } from "../envs";
import { getTwClient } from "../tw";
import { s3Client } from "../upload";
import { lookupAndUpload } from "./lookupAndUpload";
import UsersLookupParameters from "./UsersLookupParameters";

let envs: Map<string, string | Environment | undefined>;
let logger: Logger;

beforeEach(async () => {
    envs = await getEnvs(process.env, Envs);
    logger = createLogger(envs.get("NODE_ENV") as Environment, envs.get("SERVICE_NAME") as string, LogLevel.DEBUG);
});

describe("lookupAndUpload function should retrieve users information and upload to s3", () => {

    it("it should generate params, lookup users and upload", done => {
        const params = new UsersLookupParameters(["chenqiushi404"]);
        const key = prefixDateTime("YYYY-MM-DD-HH:mm:ss")("users.json", moment());
        const s3 = s3Client({
            accessKeyId: envs.get("S3_ACCESS_KEY_ID"),
            secretAccessKey: envs.get("S3_SECRET_ACCESS_KEY"),
        });

        const tw = getTwClient({
            consumer_key: envs.get("CONSUMER_API_KEY") as string,
            consumer_secret: envs.get("CONSUMER_API_SECRET_KEY") as string,
            access_token_key: envs.get("ACCESS_TOKEN") as string,
            access_token_secret: envs.get("ACCESS_SECRET") as string,
        });

        const r = pipe(key, map(
            (keyStr: string) => {
                const lau = lookupAndUpload({ Bucket: envs.get("S3_BUCKET_NAME") as string, Key: keyStr }, s3, tw)(params);

                // @ts-ignore
                expect(S.isLeft(lau)).toBe(false);

                S.either((v: ValidationError[]) => {
                    logger.info(v);
                    done();
                })((o: Observable<SendData>) => {
                    o.subscribe(
                        (r: SendData) => {
                            expect(r).toHaveProperty("ETag");
                            done();
                        },
                        err => {
                            logger.error(err);
                            done();
                        },
                        () => {
                            logger.info("completed", params);
                            done();
                        },
                    );
                    // @ts-ignore
                })(lau);
            },
        ));

        expect(r._tag).toBe("Right");
    });

});
