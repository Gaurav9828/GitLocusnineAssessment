using LocusnineDataAccess.Models;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LocusnineDataAccess.Service
{
    public class UserServiceImpl : UserService
    {
        //created by Gaurav Srivastava

        private ConnectionProvider connectionProvider;
        private OracleConnection oracleConnection;
        private OracleCommand oracleCommand;
        OracleParameter oracleParameter;
        SecureServices secureServices;

        public UserServiceImpl(ConnectionProvider _connectionProvider, SecureServices _secureServices)
        {
            connectionProvider = _connectionProvider;
            oracleConnection = connectionProvider.createNewOracleConnection();
            oracleCommand = oracleConnection.CreateCommand();
            oracleParameter = new OracleParameter();
            secureServices = _secureServices;
        }
        bool UserService.deleteUserDetailsByUserId(int id)
        {
            bool result = false;
            try
            {
                oracleConnection.Open();
                string sqlDelete = secureServices.getDemandStringFromJson("sqlDeleteUserString");
                oracleCommand.CommandText = sqlDelete;
                oracleCommand.Connection = oracleConnection;

                oracleParameter.DbType = DbType.Decimal;
                oracleParameter.Value = id;
                oracleParameter.ParameterName = "ID";

                oracleCommand.Parameters.Add(oracleParameter);
                oracleCommand.ExecuteNonQuery();
                oracleCommand.Dispose();
                result = true;
            }
            catch (Exception e)
            {
                Console.Write(e.Message);
            }
            finally
            {
                oracleConnection.Close();
                oracleConnection.Dispose();
                oracleConnection = null;
            }
            return result;
        }

        List<UserDetails> UserService.getAllUserDetailsList()
        {
            List<UserDetails> userDetailsList = new List<UserDetails>();
            try
            {
                oracleConnection.Open();
                string sqlDelete = secureServices.getDemandStringFromJson("sqlSelectUserDetailsString");
                oracleCommand.CommandText = sqlDelete;
                oracleCommand.Connection = oracleConnection;

                OracleDataReader oracleDataReader = oracleCommand.ExecuteReader();
                while (oracleDataReader.Read())
                {
                    UserDetails userDetails = new UserDetails();
                    userDetails.id = (int)(decimal)oracleDataReader["ID"];
                    userDetails.name = oracleDataReader["NAME"].ToString();
                    userDetails.email = oracleDataReader["EMAIL"].ToString();
                    userDetails.roleType = oracleDataReader["ROLE_TYPE"].ToString();
                    userDetails.mobileNumber = oracleDataReader["MOBILE_NUMBER"].ToString();
                    userDetails.status = oracleDataReader["STATUS"].ToString();
                    userDetailsList.Add(userDetails);
                }
                return userDetailsList;
            }
            catch (Exception e)
            {
                Console.Write(e.Message);
            }
            finally
            {
                oracleConnection.Close();
                oracleConnection.Dispose();
                oracleConnection = null;
            }
            return userDetailsList;
        }

        bool UserService.saveUserDetails(UserDetails userDetails)
        {
            bool result = false;
            try
            {
                oracleConnection.Open();
                string sqlInsert = secureServices.getDemandStringFromJson("sqlInsertUserString");
                oracleCommand.CommandText = sqlInsert;
                oracleCommand.Connection = oracleConnection;

                oracleCommand.Parameters.Add(new OracleParameter("id", userDetails.id));
                oracleCommand.Parameters.Add(new OracleParameter("name", userDetails.name));
                oracleCommand.Parameters.Add(new OracleParameter("email", userDetails.email));
                oracleCommand.Parameters.Add(new OracleParameter("roleType", userDetails.roleType));
                oracleCommand.Parameters.Add(new OracleParameter("mobileNumber", userDetails.mobileNumber));
                oracleCommand.Parameters.Add(new OracleParameter("status", userDetails.status));

                oracleCommand.ExecuteNonQuery();
                result = true;
            }
            catch (Exception e)
            {
                Console.Write(e.Message);
            }
            finally
            {
                oracleConnection.Close();
                oracleConnection.Dispose();
                oracleConnection = null;
            }
            return result;
        }

        bool UserService.updateUserDetails(UserDetails userDetails)
        {
            bool result = false;
            try
            {
                oracleConnection.Open();
                string sqlDelete = secureServices.getDemandStringFromJson("sqlUpdateUserString");

                oracleCommand.CommandText = sqlDelete;
                oracleCommand.Connection = oracleConnection;

                oracleCommand.Parameters.Add(new OracleParameter("id", userDetails.id));
                oracleCommand.Parameters.Add(new OracleParameter("name", userDetails.name));
                oracleCommand.Parameters.Add(new OracleParameter("email", userDetails.email));
                oracleCommand.Parameters.Add(new OracleParameter("roleType", userDetails.roleType));
                oracleCommand.Parameters.Add(new OracleParameter("mobileNumber", userDetails.mobileNumber));
                oracleCommand.Parameters.Add(new OracleParameter("status", userDetails.status));

                oracleCommand.ExecuteNonQuery();
                result = true;
            }
            catch (Exception e)
            {
                Console.Write(e.Message);
            }
            finally
            {
                oracleConnection.Close();
                oracleConnection.Dispose();
                oracleConnection = null;
            }
            return result;
        }
    }
}
