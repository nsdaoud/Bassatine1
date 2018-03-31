    using DBBassatine.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Bassatine.Controllers
{
    [RoutePrefix("api/accounts")]
    public class AccountServicesController : ApiController
    {
        [Route("bassatineusers")]
        [HttpGet]
        public List<BassatineUsers> GetListOfTAEmployees()
        {
            if(ContextInfo.Current.LoggedInUser.VendorCode == "Naji") { }


            BassatineUsersManager _UsersManager = new BassatineUsersManager();
            List<BassatineUsers> LstUsers = new List<BassatineUsers>();

            LstUsers = _UsersManager.LoadUsers();


            return LstUsers;
        }

        [Route("updateuserinfo")]
        [HttpPost]
        public BassatineUsers IpdateUserInfo(BassatineUsers _User)
        {
            BassatineUsersManager _BassatineUsersManager = new BassatineUsersManager();

            _BassatineUsersManager.UpdateVendorcodeBassatineUsers(_User.Id , _User.VendorCode  , _User.userisAdmin, _User.isActive, _User.PasswordChanged);

            return _User;
        }
    }
}
