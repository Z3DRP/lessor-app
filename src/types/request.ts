export type HttpMethod = "get" | "post" | "put" | "delete";

export type HttpRequest = {
  method: string;
  headers: Record<string, string>;
  body: string;
};

export const NewHttpRequest = (
  rMethod: HttpMethod,
  rHeaders: Record<string, string>,
  rBody: object
): HttpRequest => {
  return {
    method: rMethod.toUpperCase(),
    headers: rHeaders,
    body: JSON.stringify(rBody),
  };
};
