import { APIGatewayEvent } from "aws-lambda";
import { constants } from "http2";
import _ from "lodash";
// @ts-ignore
import { Environment, LogLevel } from "../../lib/src/constants";
// @ts-ignore
import { getEnvs } from "../../lib/src/envs";
// @ts-ignore
import { createLogger } from "../../lib/src/logger";
import { Envs } from "./envs";

export const handler = async (event: APIGatewayEvent): Promise<any> => {
    try {
        const envs = await getEnvs(process.env, Envs);
        const logger = createLogger(envs.get("NODE_ENV") as Environment, envs.get("SERVICE_NAME") as string, LogLevel.DEBUG);
        const mod = await import(event.path);
        const result = mod.lambdaFunc(envs, logger, event);
        if (_.isUndefined(result)) {
            return {
                statusCode: constants.HTTP_STATUS_BAD_REQUEST,
                body: "result is undefined",
            };
        }
        const response = await result.toPromise();
        return {
            statusCode: constants.HTTP_STATUS_OK,
            body: "function completed",
            response,
        };
    } catch (err) {
        return {
            statusCode: constants.HTTP_STATUS_BAD_REQUEST,
            err,
        };
    }
};
