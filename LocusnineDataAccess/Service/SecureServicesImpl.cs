using LocusnineDataAccess.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace LocusnineDataAccess.Service
{
    public class SecureServicesImpl : SecureServices
    {             //created by Gaurav Srivastava


        string SecureServices.getDemandStringFromJson(string demandString)
        {
            string resultString = "";
            try
            {
                var builder = new ConfigurationBuilder()
                       .SetBasePath(Directory.GetCurrentDirectory())
                       .AddJsonFile("appsettings.json");
                var config = builder.Build();
                resultString =  config.GetConnectionString(demandString);
                return resultString;
            } 
            catch (Exception e)
            {
                Console.Write(e.Message);
            }
            return resultString;
        }

    }
}
