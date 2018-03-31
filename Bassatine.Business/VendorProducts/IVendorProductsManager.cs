using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
   public interface IVendorProductsManager
    {
            List<VendorProducts> LoadVendorProducts(String  _VendorCode);

            VendorProducts LoadVendorProductsById(Guid _Id);
        
            List<VendorProducts> Find(string _VendorCode,string criteria);
    }
}
