using Microsoft.Web.Http.Routing;
using System.Web.Http;
using System.Web.Http.Routing;

namespace Smart_Office_API
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API versioning
            var constraintResolver = new DefaultInlineConstraintResolver()
            {
                ConstraintMap =
            {
                ["apiVersion"] = typeof( ApiVersionRouteConstraint )
            }};

            config.MapHttpAttributeRoutes(constraintResolver);
            config.AddApiVersioning();
        }
    }
}
