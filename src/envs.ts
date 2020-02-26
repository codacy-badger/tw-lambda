import {IsIn, IsNotEmpty, IsString} from "class-validator";

// @ts-ignore
import {enumValues, Environment} from "../../lib/src/constants";

/**
 * Environment variables.
 */
export class Envs {

    @IsIn(enumValues(Environment), {message: `NODE_ENV must be in ${enumValues(Environment)}`})
    public NODE_ENV?: string;

    @IsNotEmpty()
    @IsString()
    public SERVICE_NAME?: string;

    @IsNotEmpty()
    @IsString()
    public CONSUMER_API_KEY?: string;

    @IsNotEmpty()
    @IsString()
    public CONSUMER_API_SECRET_KEY?: string;

    @IsNotEmpty()
    @IsString()
    public ACCESS_TOKEN?: string;

    @IsNotEmpty()
    @IsString()
    public ACCESS_SECRET?: string;

    @IsNotEmpty()
    @IsString()
    public S3_ACCESS_KEY_ID?: string;

    @IsNotEmpty()
    @IsString()
    public S3_SECRET_ACCESS_KEY?: string;

    @IsNotEmpty()
    @IsString()
    public S3_BUCKET_NAME?: string;

}
