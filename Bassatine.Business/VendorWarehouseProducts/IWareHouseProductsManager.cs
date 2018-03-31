using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
    public interface IWareHouseProducts
    {
        List<WareHouseProducts> LoadWareHouseProducts(String _VendorCode);

        WareHouseProducts LoadWareHouseProductsById(Guid _Id);

        List<WareHouseProducts> Find(string criteria);
    }
}
