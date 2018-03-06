using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Data.SqlClient;

namespace Smart_Office_API.Customs
{
    static public class DatabaseContext
    {
        static private string databaseName;
        static private string getConnectionString()
        {
            string returnValue = null;

            ConnectionStringSettings settings = ConfigurationManager.ConnectionStrings[databaseName];
            if (settings != null)
            {
                returnValue = settings.ConnectionString;
                SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(returnValue)
                {
                    DataSource = "smartofficeapp.database.windows.net",
                    InitialCatalog = "Smart Office - " + databaseName,
                    UserID = "smartofficeadmin",
                    Password = "Par0la01"
                };
                return builder.ConnectionString;
            } else
            {
                return null;
            }
        }

        static public SqlConnection GetConnection(String name)
        {
            databaseName = name;
            try
            {
                SqlConnection conn = new SqlConnection(getConnectionString());
                return conn;
            } 
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}