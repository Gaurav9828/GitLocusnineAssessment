using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LocusnineDataAccess.Service
{
    interface ConnectionProvider
    {
        public OracleConnection createNewOracleConnection();
    }
}
