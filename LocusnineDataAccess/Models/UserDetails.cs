using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LocusnineDataAccess.Models
{
    public class UserDetails
    {
        public int id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string roleType { get; set; }
        public string mobileNumber { get; set; }
        public string status { get; set; }

    }
}
