using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
  public  interface IBassatineUsersManager
    {
        List<BassatineUsers> LoadUsers();

        BassatineUsers LoadUsersById(Guid _Id);


        /// <summary>
        /// Search for a Job by criteria
        /// </summary>
        /// <param name="criteria"></param>
        /// <returns>345</returns>
        List<BassatineUsers> Find(string criteria);

        void Delete(Guid _Id);
        void UpdateVendorcodeBassatineUsers(String Id, String _VendorCode, Boolean _userisAdmin, Boolean _userisActive, Boolean _PasswordChanged);
    }
}
