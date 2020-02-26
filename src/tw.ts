import Twitter = require("twitter");
import {AccessTokenOptions} from "twitter";

export const getTwClient = (options: AccessTokenOptions): Twitter => new Twitter(options);

