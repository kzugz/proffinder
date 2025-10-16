/**
* Role-based Authorization Middleware
* -----------------------------------
* Protects routes by checking if the authenticated user has one of the allowed roles.

* Usage:
* - Apply after authMiddleware to ensure user is authenticated.
* - Pass an array of allowed roles, e.g. ['admin', 'teacher'].
*/

/**
* Creates middleware to restrict access based on user role.
* @param {Array<string>} roles - List of allowed roles for the route.
* @returns {Function} Express middleware function.

* Example:
* app.get('/admin', authMiddleware, roleMiddleware(['admin']), adminController);

* Response:
* - 403 if user's role is not included in allowed roles.
* - Calls next() if role is authorized.
*/
export const roleMiddleware = (roles) => {
  return (req, res, next) => {
    
    // Check if user's role is included in allowed roles
    if (!roles.includes(req.user.role)) {

      // Deny access if role is not authorized
      return res.status(403).json({ message: "Access denied" });
    }

    // Proceed if user has proper role
    next();
  };
};