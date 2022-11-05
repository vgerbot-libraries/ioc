export type Primary = string | number | boolean | null;

export interface JsonMap {
    [member: string]: Primary | JSONArray | JsonMap;
}

export type JSONArray = Array<Primary | JsonMap | JSONArray>;

export type JSONData = JsonMap | JSONArray | Primary;
