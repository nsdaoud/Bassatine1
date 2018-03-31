using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
    public class WareHouseProductsManager : IWareHouseProducts

    {
        public List<WareHouseProducts> Find(string criteria)
        {
            throw new NotImplementedException();
        }

        public List<WareHouseProducts> LoadWareHouseProducts(string _VendorCode)
        {
            using (CustomSqlConnection connection = new CustomSqlConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetVendorProducts", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new CustomSqlParameter("VendorCode", SqlDbType.NVarChar, _VendorCode));
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    DataSet ds = new DataSet();
                    adapter.Fill(ds);
                    List<WareHouseProducts> all = Load(ds.Tables[0]);
                    return all;
                }
            }
        }

        public WareHouseProducts LoadWareHouseProductsById(Guid _Id)
        {
            throw new NotImplementedException();
        }

        private static List<WareHouseProducts> Load(DataTable dt)
        {
            List<WareHouseProducts> retVal = new List<WareHouseProducts>();
            if (dt != null)
            {
                foreach (DataRow dr in dt.Rows)
                    retVal.Add(Load(dr));
            }
            return retVal;
        }

        private static WareHouseProducts Load(DataRow dr)
        {
            WareHouseProducts retVal = new WareHouseProducts
            {
                ProdCode = dr["ProdCode"].EnsureString(),
                ProdDesc = dr["ProdDesc"].EnsureString(),
                VendCode = dr["VendCode"].EnsureString(),
                OnHandQty = dr["VendCode"].EnsureDouble(),
                WarehouseCode = dr["WarehouseCode"].EnsureString()

            };
            return retVal;
        }
    }
}
