
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
   public  interface IWareHousesManager
    {
        List<clsWareHouses> LoadWareHouses();
    }
}
