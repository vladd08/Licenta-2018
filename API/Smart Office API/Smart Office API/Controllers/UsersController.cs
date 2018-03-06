using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Web.Http;
using Smart_Office_API.Customs;
using Swashbuckle.Swagger.Annotations;

namespace Smart_Office_API.Controllers.V1
{
    [ApiVersion("1.0")]
    [RoutePrefix("api/v{version:apiVersion}/{clientName}")]
    public class LoginController : ApiController
    {
        //Call this to test versioning works
        [HttpGet]
        [Route("values")]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpGet]
        [Route("login")]
        public HttpResponseMessage Login(string clientName)
        {
            using (SqlConnection connection = DatabaseContext.GetConnection(clientName))
            {
                try
                {
                    connection.Open();
                    return this.Request.CreateResponse(HttpStatusCode.OK, "Succesfully connected!");
                }
                catch (Exception ex)
                {
                    return this.Request.CreateResponse(HttpStatusCode.NotFound, "The client provided does not exist. Connection not established!");
                }
            }
        }
    }
}

namespace Smart_Office_API.Controllers.V2
{
    [ApiVersion("2.0")]
    [RoutePrefix("api/v{version:apiVersion}")]
    public class ValuesController : ApiController
    {
        //Call this to test versioning works
        [HttpGet]
        [Route("values")]
        public IEnumerable<string> Get()
        {
            return new string[] { "value3", "value4" };
        }
    }
}
