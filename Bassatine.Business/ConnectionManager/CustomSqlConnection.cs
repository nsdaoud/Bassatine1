using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
  public  class CustomSqlConnection : IDisposable
    {
        private SqlConnection sqlConn;

        public CustomSqlConnection()
        {
            string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["DefaultConnection"].ToString();
            if (string.IsNullOrEmpty(connectionString))
                throw new Exception(string.Format("Connection string was not found in config file '{0}'", AppDomain.CurrentDomain.SetupInformation.ConfigurationFile));

            this.sqlConn = new SqlConnection(connectionString);
            this.sqlConn.Open();
        }

        public static implicit operator SqlConnection(CustomSqlConnection connection)
        {
            return connection.sqlConn;
        }

        public void Dispose()
        {
            this.sqlConn.Close();
            this.sqlConn.Dispose();
        }
    }
}
