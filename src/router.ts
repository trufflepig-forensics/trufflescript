import React from "react";

/** Configuration for defining {@link Route routes} */
export interface RouteConfig<RenderResult, UrlParams extends object, HiddenParams extends object> {
    /**
     * The route's url as string
     *
     * Use `{<param-name>}` to bind a part of the url to a parameter.
     * For example `user/{username}` binds to the parameter names "username".
     *
     * **Note:**
     * Binding parts of the url is only supported for a whole "directory" in the path.
     * For example `user-{username}` is not supported
     */
    url: string;

    /**
     * Set of functions to parse parameters
     *
     * When a parse function receives invalid input,
     * it should throw an error instead of returning `null` or `undefined`.
     */
    parser: { [Param in keyof UrlParams]: (param: string) => UrlParams[Param] };

    /**
     * Take a set of bound parameters and return the corresponding render result
     *
     * @param urlParams parameters parse from an url
     * @param hiddenParams parameters passed through the router
     * @return react element to show for this route
     */
    render: (urlParams: UrlParams, hiddenParams: HiddenParams | undefined) => RenderResult;
}

/** Regex for a bind parameter in {@link RouteConfig.url `url`} */
const BIND_REGEX = /^\{(.*)}$/;

class Route<RenderResult, UrlParams extends object, HiddenParams extends object> {
    /** The route's configuration */
    readonly config: RouteConfig<RenderResult, UrlParams, HiddenParams>;

    /** Pre-split and "parsed" version of {@link RouteConfig.url `config.url`} */
    readonly pattern: Array<string | { bind: keyof UrlParams }>;

    /** List of errors the constructor found in the config */
    readonly errors: Array<string>;

    /** Router this route is registered in */
    readonly router: Router<RenderResult>;

    /** ID the router identifies this route with */
    readonly id: number;

    constructor(router: Router<RenderResult>, id: number, config: RouteConfig<RenderResult, UrlParams, HiddenParams>) {
        this.router = router;
        this.id = id;
        this.config = config;
        if (config.url.length === 0) this.pattern = [];
        else
            this.pattern = config.url.split("/").map((fragment) => {
                const match = fragment.match(BIND_REGEX);
                return match === null ? fragment : { bind: match[1] as keyof UrlParams };
            });
        this.errors = [];

        const occurrence: Set<keyof UrlParams> = new Set();
        for (const pattern of this.pattern) {
            if (typeof pattern === "string") continue;

            if (occurrence.has(pattern.bind)) {
                this.errors.push(`The parameter '${String(pattern.bind)}' appears multiple times in the url pattern`);
            } else {
                occurrence.add(pattern.bind);
            }

            if (this.config.parser[pattern.bind] === undefined) {
                this.errors.push(`The parameter '${String(pattern.bind)}' doesn't have a parser`);
            }
        }

        for (const param of Object.keys(config.parser)) {
            if (!occurrence.has(param as keyof UrlParams)) {
                this.errors.push(`The parameter '${String(param)}' does not appear in the url`);
            }
        }
    }

    /**
     * Try to match an url to this route and parse its parameters
     *
     * @param url an url string which has been split at `/`
     */
    match(url: Array<string>): { [Param in keyof UrlParams]: UrlParams[Param] } | undefined {
        if (url.length !== this.pattern.length) return;

        const params: { [Param in keyof UrlParams]?: UrlParams[Param] } = {};
        for (const i in url) {
            const input = url[i];
            const pattern = this.pattern[i];

            if (typeof pattern !== "string") {
                const parser = this.config.parser[pattern.bind];
                try {
                    params[pattern.bind] = parser(input);
                } catch {
                    return;
                }
            } else if (pattern !== input) {
                return;
            }
        }

        return params as { [Param in keyof UrlParams]: UrlParams[Param] };
    }

    /**
     * Build an url to this route using concrete parameters
     *
     * @param urlParams parameters to use
     * @return the constructed url
     */
    build(urlParams: { [Param in keyof UrlParams]: Stringable }): string {
        return this.pattern
            .map((pattern) => {
                if (typeof pattern === "string") return pattern;
                else return String(urlParams[pattern.bind]);
            })
            .join("/");
    }

    /**
     * Open this route in the current tab
     *
     * @param urlParams parameters to {@link build `build`} the url with
     * @param hiddenParams parameters to pass to the route's render method through the router instead of the url
     */
    visit(urlParams: { [Param in keyof UrlParams]: Stringable }, hiddenParams: HiddenParams | undefined = undefined) {
        const url = this.build(urlParams);
        this.router.setHiddenParams(this, hiddenParams);
        window.location.hash = `/${url}`;
    }

    /**
     * Open this route in a new tab
     *
     * **Beware**
     * Browsers block calls to {@link window.open `window.open`} if they don't occur while handling a user event.
     *
     * @param urlParams parameters to {@link build `build`} the url with
     */
    open(urlParams: { [Param in keyof UrlParams]: Stringable }) {
        const url = this.build(urlParams);
        window.open(`${window.location.origin}/#/${url}`);
    }

    /**
     * Return a set of react click handler to make an element behave like a link
     *
     * i.e. left click to open in this tab, middle click to open in new tab
     *
     * @param urlParams parameters to {@link build `build`} the url with
     */
    clickHandler(urlParams: { [Param in keyof UrlParams]: Stringable }) {
        return {
            onClick: () => this.visit(urlParams),
            onAuxClick: () => this.open(urlParams),
        };
    }
}

export class Router<RenderResult> {
    // Changing the array could invalidate the routes' ids
    protected routes: Array<Route<RenderResult, object, object>> = [];
    protected hiddenParam: { id: number; params: object } | undefined = undefined;

    /**
     * Create a new route and add it to this router
     *
     * @param config the route's config
     * @return the new route
     */
    add<UrlParams extends object, HiddenParams extends object>(
        config: RouteConfig<RenderResult, UrlParams, HiddenParams>
    ): Route<RenderResult, UrlParams, HiddenParams> {
        const route = new Route(this, this.routes.length, config);
        this.routes.push(route as Route<RenderResult, object, object>);
        return route;
    }

    /**
     * Finalize all routes and log any potential errors
     *
     * TODO this method could post process the list of all route and produce some kind of tree to speed up the url matching process
     */
    finish() {
        for (const route of this.routes) {
            if (route.errors.length > 0) {
                console.error(`Errors in route "${route.config.url}":`, ...route.errors);
            }
        }
    }

    /**
     * Set hidden parameters to pass to a route
     *
     * @param route to set parameters for
     * @param hiddenParams parameters to set
     */
    setHiddenParams<UrlParams extends object, HiddenParams extends object>(route: Route<RenderResult, UrlParams, HiddenParams>, hiddenParams: HiddenParams | undefined) {
        if (this !== route.router) {
            console.error("Routes are misconfigured");
            return;
        }
        this.hiddenParam = hiddenParams && { id: route.id, params: hiddenParams };
    }

    /**
     * Match a given pre-split url
     *
     * @param url url already split at "/"
     * @return the matched route and its parameters, if any
     */
    match(url: Array<string>): [Route<RenderResult, object, object>, object, object | undefined] | undefined {
        // TODO this naive iter and check step by step could be improved by processing the list in `finish()`
        for (const route of this.routes) {
            const urlParams = route.match(url);
            if (urlParams === undefined) continue;

            let hiddenParams = undefined;
            if (this.hiddenParam) {
                if (this.hiddenParam.id === route.id) hiddenParams = this.hiddenParam.params;
                else this.hiddenParam = undefined;
            }

            return [route, urlParams, hiddenParams];
        }
        return undefined;
    }

    /**
     * Match a given pre-split url and render the routes element
     *
     * @param url url already split at "/"
     * @return the matched route's {@link RouteConfig.render `render`} result, if any
     */
    matchAndRender(url: Array<string>): RenderResult | undefined {
        const match = this.match(url);
        if (match === undefined) return undefined;
        const [route, urlParams, hiddenParams] = match;
        return route.config.render(urlParams, hiddenParams);
    }
}

/** Any type which provides a `toString` method i.e. most builtins */
export type Stringable = {toString(): string};

export class ReactRouter extends Router<React.ReactNode> {
    protected component: React.ComponentType<RouterComponentProps> = () => null;

    /** Assert that only one instance of `this.Component` is active at a time */
    protected instances = 0;

    get Component(): React.ComponentType<RouterComponentProps> {
        return this.component;
    }

    finish() {
        super.finish();
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const ROUTER = this;
        type RouterComponentState = { match: ReturnType<ReactRouter["match"]> };
        this.component = class extends React.Component<RouterComponentProps, RouterComponentState>{
            static displayName = "ReactRouter.Component";

            state: RouterComponentState = {match: undefined};

            hashChange = () => {
                const rawPath = window.location.hash;

                // Ensure well-formed path i.e. always have a #/
                if (!rawPath.startsWith("#/")) {
                    window.location.hash = "#/";

                    // this method will be immediately triggered again
                    return;
                }

                // Split everything after #/
                const path = rawPath.substring(2).split("/");

                // #/ should result in [] not [""]
                if (path.length === 1 && path[0] === "") {
                    path.shift();
                }

                this.setState({match: ROUTER.match(path)})
            };

            componentDidMount() {
                window.addEventListener("hashchange", this.hashChange);
                this.hashChange();

                ROUTER.instances += 1;
                if (ROUTER.instances > 1) console.error("Don't use a ReactRouter's Component more than once!");
            }

            componentWillUnmount() {
                window.removeEventListener("hashchange", this.hashChange);

                ROUTER.instances -= 1;
                if (ROUTER.instances < 0) console.warn("`ReactRouter.instances` is buggy");
            }

            render() {
                let contextValue: RouterContext = {route: undefined, params: undefined};

                let content;
                if (this.state.match !== undefined) {
                    const [route, urlParams, hiddenParams] = this.state.match;
                    contextValue = {route, params: urlParams};
                    content = route.config.render(urlParams, hiddenParams);
                } else {
                    content = this.props.fallback;
                }

                const wrapped = this.props.children === undefined ? content : this.props.children(content);

                return React.createElement(ROUTER_CONTEXT.Provider, {value: contextValue}, [wrapped]);
            }
        };
    }
}

export type RouterComponentProps = {
    fallback?: React.ReactNode,
    children?: (content: React.ReactNode) => React.ReactNode,
};

export type RouterContext = {
    readonly route: Route<React.ReactNode, object, object>;
    readonly params: object;
} | {
    readonly route: undefined;
    readonly params: undefined;
};

export const ROUTER_CONTEXT = React.createContext<RouterContext>({route: undefined, params: undefined});
ROUTER_CONTEXT.displayName = "RouterContext";