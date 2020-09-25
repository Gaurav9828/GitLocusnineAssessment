using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LocusnineDataAccess.Models;
using LocusnineDataAccess.Service;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace LocusnineDataAccess.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoucsnineHomeController : ControllerBase
    {
        private UserService userService;
        private SecureServices secureServices;
        public LoucsnineHomeController(SecureServices _secureServices, UserService _userService)
        {
            userService = _userService;
            secureServices = _secureServices;
        }
        [HttpGet]
        public IEnumerable<UserDetails> getAllUserDetailsList()
        { 
            try
            {
                var userDetailsList = userService.getAllUserDetailsList();
                return userDetailsList.ToList();
            }
            catch (Exception e)
            {
                Console.Write(e.Message);
            }
            return null;
        }
        [Route("add/new/user/details")]
        [HttpPost]
        public bool saveUserDetails([FromBody] UserDetails userDetails)
        {
            try
            {
                return userService.saveUserDetails(userDetails);

            }
            catch (Exception e)
            {
                Console.Write(e.Message);
            }
            return false;
        }

        [Route("update/user/details")]
        [HttpPost]
        public bool updateUserDetails([FromBody] UserDetails userDetails)
        {
            try
            {
                return userService.updateUserDetails(userDetails);
            }
            catch (Exception e)
            {
                Console.Write(e.Message);
            }
            return false;
        }

        [Route("delete/user/details")]
        [HttpPost]
        public bool deleteUserDetailsByUserId([FromBody]  int id)
        {
            try
            {
                return userService.deleteUserDetailsByUserId(id);
            }
            catch (Exception e)
            {
                Console.Write(e.Message);
            }
            return false;
        }








        // GET: api/<LoucsnineHomeController>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<LoucsnineHomeController>/5
        
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<LoucsnineHomeController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<LoucsnineHomeController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<LoucsnineHomeController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
