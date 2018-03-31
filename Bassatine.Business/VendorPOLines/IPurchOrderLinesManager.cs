using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
   public  interface IPurchOrderLinesManager
    {
        List<PurchOrderLines > LoadVendorPOLines(Guid  idPo);

     

        List<PurchOrderLines> Find(string criteria);

        void Delete(Guid _idPurchLine);
        void InsertPOLines(PurchOrderLines _PurchOrderLines);

        void UpdatePOLines(PurchOrderLines _PurchOrderLines);
    }
}
