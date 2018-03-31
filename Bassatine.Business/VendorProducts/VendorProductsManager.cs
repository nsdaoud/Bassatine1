using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
    public class VendorProductsManager : IVendorProductsManager
    {
        public List<VendorProducts> Find(string _VendorCode,string criteria)
        {
            using (CustomSqlConnection connection = new CustomSqlConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_FindVendorPOByCriteria", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new CustomSqlParameter("VendorCode", SqlDbType.NVarChar, _VendorCode));
                    cmd.Parameters.Add(new CustomSqlParameter("Criteria", SqlDbType.NVarChar, criteria));
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    DataSet ds = new DataSet();
                    adapter.Fill(ds);
                    List<VendorProducts> all = Load(ds.Tables[0]);
                    return all;
                }
            }
        }

        public VendorProducts LoadVendorProductsById(Guid _Id)
        {
            throw new NotImplementedException();
        }

        public List<VendorProducts> LoadVendorProducts(string _VendorCode)
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
                    List<VendorProducts> all = Load(ds.Tables[0]);
                    return all;
                }
            }
        }

        private static List<VendorProducts> Load(DataTable dt)
        {
            List<VendorProducts> retVal = new List<VendorProducts>();
            if (dt != null)
            {
                foreach (DataRow dr in dt.Rows)
                    retVal.Add(Load(dr));
            }
            return retVal;
        }

        private static VendorProducts Load(DataRow dr)
        {
            VendorProducts retVal = new VendorProducts
            {
                ProdCode = dr["ProdCode"].EnsureString(),
                ProdDesc = dr["ProdDesc"].EnsureString(),
                VendCode = dr["VendCode"].EnsureString(),

            };
            return retVal;
        }
    }
}
