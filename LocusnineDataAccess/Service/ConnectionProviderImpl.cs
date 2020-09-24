using Microsoft.Extensions.Configuration;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace LocusnineDataAccess.Service
{
    public class ConnectionProviderImpl: ConnectionProvider
    {
        public OracleConnection createNewOracleConnection()
        {
            OracleConnection con = new OracleConnection();
            try
            {
                SecureServices secureServices = new SecureServicesImpl();
                var connectionString = secureServices.getDemandStringFromJson("LocusnineOracleDBConnectionString");
                con = new OracleConnection(connectionString);
                return con;
            }
            catch (Exception e)
            {
                Console.Write(e.Message);
            }
            return con;
        }
    }
}
