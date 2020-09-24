using LocusnineDataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LocusnineDataAccess.Service
{
    interface UserService
    {
        public List<UserDetails> getAllUserDetailsList();
        public bool saveUserDetails(UserDetails userDetails);
        public bool updateUserDetails(UserDetails userDetails);
        public bool deleteUserDetailsByUserId(int id);
    }
}
