import {ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsBoolean, IsNumber, IsString} from "class-validator";

export default class UsersLookupParameters {

    get screenNames(): string[] {
        return this._screenNames;
    }

    set screenNames(value: string[]) {
        this._screenNames = value;
    }

    get userIds(): number[] {
        return this._userIds;
    }

    set userIds(value: number[]) {
        this._userIds = value;
    }

    get includeEntities(): boolean {
        return this._includeEntities;
    }

    set includeEntities(value: boolean) {
        this._includeEntities = value;
    }

    get tweetMode(): boolean {
        return this._tweetMode;
    }

    set tweetMode(value: boolean) {
        this._tweetMode = value;
    }

    @IsArray()
    @ArrayMaxSize(100)
    @ArrayMinSize(1)
    @ArrayUnique()
    @IsString({each: true})
    private _screenNames: string[];

    @IsArray()
    @ArrayMaxSize(100)
    @ArrayUnique()
    @IsNumber({}, {each: true})
    private _userIds: number[];

    @IsBoolean()
    private _includeEntities: boolean;

    @IsBoolean()
    private _tweetMode: boolean;

    constructor(screenNames: string[] = [], userIds: number[] = [], includeEntities: boolean = false, tweetMode: boolean = false) {
        this._screenNames = screenNames;
        this._userIds = userIds;
        this._includeEntities = includeEntities;
        this._tweetMode = tweetMode;
    }
}
