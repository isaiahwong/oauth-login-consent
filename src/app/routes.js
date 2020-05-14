/* eslint-disable object-curly-newline */
/* eslint-disable global-require */

export const routePaths = {
  auth: {
    path: '/auth',
    login: {
      title: 'Login',
      path: '/login',
    },
    signup: {
      title: 'Signup',
      path: '/signup'
    },
    client: {
      title: 'Client',
      path: '/client/claims/noop'
    }
  },
};

export const staticPaths = {
  login: routePaths.auth.path + routePaths.auth.login.path,
  signup: routePaths.auth.path + routePaths.auth.signup.path,
};

export const routePathsArray = Object.keys(routePaths).map(key => ({ ...routePaths[key] }));


// The top-level (parent) route
const routes = {
  path: '',
  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: routePaths.auth.path,
      children: [
        {
          path: routePaths.auth.login.path,
          load: () => import(/* webpackChunkName: 'login' */ './pages/login'),
        },
        {
          path: routePaths.auth.signup.path,
          load: () => import(/* webpackChunkName: 'signup' */ './pages/signup')
        },
        {
          path: routePaths.auth.client.path,
          load: () => import(/* webpackChunkName: 'clientauth' */ './pages/client')
        },
      ]
    },
    {
      path: '/notfound',
      load: () => import(/* webpackChunkName: 'not-found' */ './pages/not-found')
    },
    // Wildcard routes, e.g. { path: '(.*)', ... } (must go last)
    {
      path: '(.*)',
      load: () => import(/* webpackChunkName: 'not-found' */ './pages/not-found')
    },
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();
    const domain = __DEV__ ? 'https://localhost' : process.env.DOMAIN;

    // Provide default values for title, description etc.
    route.siteName = process.env.SITE_NAME;
    route.domain = domain;
    route.title = (route.title && `${route.title}`) || route.siteName;
    route.description = route.description || '';
    route.ogImage = `${domain}${process.env.OG_IMAGE}`;

    return route;
  },
};

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action: require('./pages/error').default,
  });
}

export default routes;
