using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
    [Serializable]
    [DataContract]
    public  class WareHouseProducts
    {
        [DataMember]
        public String ProdCode { get; set; }

        [DataMember]
        public String ProdDesc { get; set; }

        [DataMember]
        public String VendCode { get; set; }
        [DataMember]
        public String WarehouseCode { get; set; }

        [DataMember]
        public double OnHandQty { get; set; }
    }
}
