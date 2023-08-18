export function buildRoutePath(path) {
    const routeParameteresRegex = /:([a-zA-Z]+)/g;
    const pathWithParams = path.replaceAll(routeParameteresRegex, '(?<$1>[a-z0-9\-_]+)');

    const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);

    return pathRegex;
}