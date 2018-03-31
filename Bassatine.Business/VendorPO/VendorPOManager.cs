using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
    public class VendorPOManager : IVendorPOManager
    {
        public void Delete(Guid _idVendorPO)
        {
            throw new NotImplementedException();
        }

        public List<VendorPO> Find(string criteria)
        {
            throw new NotImplementedException();
        }

        public void InsertVendorPO(VendorPO _VendorPO)
        {
            using (CustomSqlConnection connection = new CustomSqlConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_InsertVendorPO", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new CustomSqlParameter("id_PurchOrder", SqlDbType.UniqueIdentifier, _VendorPO.id_PurchOrder));
                    cmd.Parameters.Add(new CustomSqlParameter("PurchOrderStatus", SqlDbType.NVarChar, _VendorPO.PurchOrderStatus));
                    cmd.Parameters.Add(new CustomSqlParameter("VendCode", SqlDbType.NVarChar, _VendorPO.VendCode));
                    cmd.Parameters.Add(new CustomSqlParameter("PurchDate", SqlDbType.DateTime, _VendorPO.PurchDate));
                    cmd.Parameters.Add(new CustomSqlParameter("id_WareHouse", SqlDbType.UniqueIdentifier, _VendorPO.id_WareHouse));
                    cmd.Parameters.Add(new CustomSqlParameter("PODeliveryDate", SqlDbType.DateTime, _VendorPO.PODeliveryDate));

                    cmd.Parameters.Add(new CustomSqlParameter("Id", SqlDbType.NVarChar, _VendorPO.IdVendor));
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public List<VendorPO> LoadVendorPO(String _VendorCode)
        {
            using (CustomSqlConnection connection = new CustomSqlConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetVendorPO", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new CustomSqlParameter("VendorCode", SqlDbType.NVarChar, _VendorCode));
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    DataSet ds = new DataSet();
                    adapter.Fill(ds);
                    List<VendorPO> all = Load(ds.Tables[0]);
                    return all;
                }
            }
        }



        public VendorPO LoadVendorPOById(Guid _idVendorPO)
        {
            using (CustomSqlConnection connection = new CustomSqlConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetVendorByPOId", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new CustomSqlParameter("id_PurchOrder", SqlDbType.UniqueIdentifier, _idVendorPO));
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    DataSet ds = new DataSet();
                    adapter.Fill(ds);
                    List<VendorPO> all = Load(ds.Tables[0]);

                                        return all[0];
                }
            }
        }

        public void UpdateVendorPO(VendorPO _VendorPO)
        {
            using (CustomSqlConnection connection = new CustomSqlConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_UpdateVendorPO", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new CustomSqlParameter("id_PurchOrder", SqlDbType.UniqueIdentifier, _VendorPO.id_PurchOrder));
                    cmd.Parameters.Add(new CustomSqlParameter("PurchOrderStatus", SqlDbType.NVarChar, _VendorPO.PurchOrderStatus));
                    cmd.Parameters.Add(new CustomSqlParameter("PurchDate", SqlDbType.DateTime, _VendorPO.PurchDate));
                    cmd.Parameters.Add(new CustomSqlParameter("PODeliveryDate", SqlDbType.DateTime, _VendorPO.PODeliveryDate));

                    cmd.ExecuteNonQuery();
                }
            }
              

        }

        private static List<VendorPO> Load(DataTable dt)
        {
            List<VendorPO> retVal = new List<VendorPO>();
            if (dt != null)
            {
                foreach (DataRow dr in dt.Rows)
                    retVal.Add(Load(dr));
            }
            return retVal;
        }

        private static VendorPO LoadOneRecord(DataTable dt)
        {
            VendorPO retVal = new VendorPO();
            if (dt != null)
            {
                foreach (DataRow dr in dt.Rows)
                    retVal = (Load(dr));
            }
            return retVal;
        }

        private static VendorPO Load(DataRow dr)
        {
            VendorPO retVal = new VendorPO
            {
                id_PurchOrder = dr["id_PurchOrder"].EnsureGuid(),
                PurchOrderCode = dr["PurchOrderCode"].EnsureString(),
                VendCode = dr["VendCode"].EnsureString(),
                PurchDate = dr["PurchDate"].EnsureDate(),
                WarehouseCode = dr["WarehouseCode"].EnsureString(),
                PurchOrdersequential = dr["PurchOrdersequential"].EnsureInt(),
                PurchOrderStatus = dr["PurchOrderStatus"].EnsureString(),
                VendorEmail = dr["VendorEmail"].EnsureString()


            };
            return retVal;
        }

        public List<VendorPO> LoadAllPO()
        {
            using (CustomSqlConnection connection = new CustomSqlConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetVendorPOInProcess", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    DataSet ds = new DataSet();
                    adapter.Fill(ds);
                    List<VendorPO> all = Load(ds.Tables[0]);
                    return all;
                }
            }
        }
    }
}
