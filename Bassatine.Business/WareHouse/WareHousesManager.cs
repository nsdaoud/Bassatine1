using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
    public class WareHousesManager : IWareHousesManager

    {
        public List<clsWareHouses> LoadWareHouses()
        {
            using (CustomSqlConnection connection = new CustomSqlConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetWareHouses", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    DataSet ds = new DataSet();
                    adapter.Fill(ds);
                    List<clsWareHouses> all = Load(ds.Tables[0]);
                    return all;
                }
            }
        }

        private static List<clsWareHouses> Load(DataTable dt)
        {
            List<clsWareHouses> retVal = new List<clsWareHouses>();
            if (dt != null)
            {
                foreach (DataRow dr in dt.Rows)
                    retVal.Add(Load(dr));
            }
            return retVal;
        }

        private static clsWareHouses Load(DataRow dr)
        {
            clsWareHouses retVal = new clsWareHouses
            {
                id_WareHouse = dr["id_WareHouse"].EnsureGuid(),
                WareHouseCode  = dr["WareHouseCode"].EnsureString()

            };
            return retVal;
        }
    }
}
