import AuthRoute from '@/users/auth.route';

describe('AuthRoute', () => {
  let authRoute = new AuthRoute();

  it('should be defined', () => {
    expect(authRoute).toBeDefined();
  });

  it('should have path', () => {
    expect(authRoute.path).toBeDefined();
  });

  it('should have router', () => {
    expect(authRoute.router).toBeDefined();
  });

  it('should have controller', () => {
    expect(authRoute.controller).toBeDefined();
  });

  it('should have initRoutes', () => {
    expect(authRoute.initRoutes).toBeDefined();
  });
});
