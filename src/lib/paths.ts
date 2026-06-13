export const withTrailingSlash = (path: string) => (path.endsWith("/") ? path : `${path}/`);

export const basePath = withTrailingSlash(import.meta.env.BASE_URL);

export const sitePath = (path = "") => `${basePath}${path.replace(/^\//, "")}`;
