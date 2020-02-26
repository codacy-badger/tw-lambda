import _ from "lodash";
import { handler } from "./main";

jest.setTimeout(12000);

describe("main function", () => {

    it("should invoke lambdaFunc and process the request", async () => {
        // @ts-ignore
        const r = await handler({
            path: "./users/index",
            // @ts-ignore
            body: { screenNames: ["chenqiushi404"] },
        });
        expect(_.has(r, "statusCode")).toBe(true);
        expect(_.get(r, "statusCode")).toBe(200);
        expect(_.has(r, "body")).toBe(true);
        expect(_.get(r, "body")).toBe("function completed");
        expect(_.has(r, "response.ETag")).toBe(true);
        expect(_.get(r, "response.ETag")).not.toBe("");
    });

    it("should invoke lambdaFunc and return invalid response with invalid body parameter", async () => {
        // @ts-ignore
        const r = await handler({
            path: "./users/index",
            // @ts-ignore
            body: "test",
        });
        expect(_.has(r, "statusCode")).toBe(true);
        expect(_.get(r, "statusCode")).toBe(400);
    });

    // tslint:disable-next-line: no-identical-functions
    it("should not invoke lambdaFunc when path parameter is not valid", async () => {
        // @ts-ignore
        const r = await handler({
            path: "./users/test",
            // @ts-ignore
            body: "test",
        });
        expect(_.has(r, "statusCode")).toBe(true);
        expect(_.get(r, "statusCode")).toBe(400);
    });

});
