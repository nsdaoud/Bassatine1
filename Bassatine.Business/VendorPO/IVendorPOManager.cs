using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
  public   interface IVendorPOManager
    {
        List<VendorPO> LoadVendorPO(String _VendorCode);

        List<VendorPO> LoadAllPO();

        VendorPO LoadVendorPOById(Guid _idVendorPO);

        /// <summary>
        /// Search for a Job by criteria
        /// </summary>
        /// <param name="criteria"></param>
        /// <returns>345</returns>
        List<VendorPO> Find(string criteria);

        void Delete(Guid _idVendorPO);
        void InsertVendorPO(VendorPO _VendorPO);

        void UpdateVendorPO(VendorPO _VendorPO);
    }
}
