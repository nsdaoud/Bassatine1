using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
   public class VendorPO
    {
        public Guid id_PurchOrder { get; set; }

        public Guid id_WareHouse { get; set; }

        public String PurchOrderCode { get; set; }

        public String VendCode { get; set; }

        public String IdVendor { get; set; }

        public DateTime PurchDate { get; set; }

        public String WarehouseCode { get; set; }

        public String PurchOrderStatus { get; set; }

        public int PurchOrdersequential { get; set; }

        public string VendorEmail { get; set; }

        public DateTime PODeliveryDate { get; set; }


    }
}
