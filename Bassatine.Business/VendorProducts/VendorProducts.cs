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
    public   class VendorProducts
    {
       
        public String ProdCode { get; set; }

        public String ProdDesc { get; set; }

        public String VendCode { get; set; }

        public String IdVendor { get; set; }
    }
}
