using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
   public class PurchOrderLines
    {

        public Guid id_PurchLine { get; set; }

        public Guid id_PurchOrder { get; set; }

        public string PurchLineCode { get; set; }

        public int PurchLineSequence { get; set; }

        public double UnitPrice { get; set; }

        public double Quantity { get; set; }
        public double Amount { get; set; }

        public string ProdCode { get; set; }

        public string ProdDesc { get; set; }
    }
}
