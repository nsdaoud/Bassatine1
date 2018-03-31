using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
    public class PurchOrderLinesManager : IPurchOrderLinesManager
    {
        public void Delete(Guid _idPurchLine)
        {
            using (CustomSqlConnection connection = new CustomSqlConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_POLineDelete", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new CustomSqlParameter("id_PurchLine", SqlDbType.UniqueIdentifier, _idPurchLine));
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public List<PurchOrderLines> Find(string criteria)
        {
            throw new NotImplementedException();
        }

        public void InsertPOLines(PurchOrderLines _PurchOrderLines)
        {
            using (CustomSqlConnection connection = new CustomSqlConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_InsertVendorPOLines", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new CustomSqlParameter("id_PurchLine", SqlDbType.UniqueIdentifier, _PurchOrderLines.id_PurchLine));
                    cmd.Parameters.Add(new CustomSqlParameter("id_PurchOrder", SqlDbType.UniqueIdentifier, _PurchOrderLines.id_PurchOrder ));
                    cmd.Parameters.Add(new CustomSqlParameter("UnitPrice", SqlDbType.Float, _PurchOrderLines.UnitPrice));
                    cmd.Parameters.Add(new CustomSqlParameter("Quantity", SqlDbType.Float, _PurchOrderLines.Quantity));
                    cmd.Parameters.Add(new CustomSqlParameter("Amount", SqlDbType.Float, _PurchOrderLines.Amount));
                    cmd.Parameters.Add(new CustomSqlParameter("ProdCode", SqlDbType.NVarChar, _PurchOrderLines.ProdCode));
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public List<PurchOrderLines> LoadVendorPOLines(Guid idPo)
        {
            using (CustomSqlConnection connection = new CustomSqlConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetVendorPOLines", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new CustomSqlParameter("id_PurchOrder", SqlDbType.UniqueIdentifier, idPo));
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    DataSet ds = new DataSet();
                    adapter.Fill(ds);
                    List<PurchOrderLines> all = Load(ds.Tables[0]);
                    return all;
                }
            }
        }

        public void UpdatePOLines(PurchOrderLines _PurchOrderLines)
        {
            using (CustomSqlConnection connection = new CustomSqlConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_UpdateVendorPOLines", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new CustomSqlParameter("id_PurchLine", SqlDbType.UniqueIdentifier, _PurchOrderLines.id_PurchLine));
                    cmd.Parameters.Add(new CustomSqlParameter("UnitPrice", SqlDbType.Float, _PurchOrderLines.UnitPrice));
                    cmd.Parameters.Add(new CustomSqlParameter("Quantity", SqlDbType.Float, _PurchOrderLines.Quantity));
                    cmd.Parameters.Add(new CustomSqlParameter("Amount", SqlDbType.Float, _PurchOrderLines.Amount));
                    cmd.Parameters.Add(new CustomSqlParameter("ProdCode", SqlDbType.NVarChar, _PurchOrderLines.ProdCode));
                    cmd.ExecuteNonQuery();
                }
            }
        }

        private static List<PurchOrderLines> Load(DataTable dt)
        {
            List<PurchOrderLines> retVal = new List<PurchOrderLines>();
            if (dt != null)
            {
                foreach (DataRow dr in dt.Rows)
                    retVal.Add(Load(dr));
            }
            return retVal;
        }

        private static PurchOrderLines LoadOneRecord(DataTable dt)
        {
            PurchOrderLines retVal = new PurchOrderLines();
            if (dt != null)
            {
                foreach (DataRow dr in dt.Rows)
                    retVal = (Load(dr));
            }
            return retVal;
        }

        private static PurchOrderLines Load(DataRow dr)
        {
            PurchOrderLines retVal = new PurchOrderLines
            {
                id_PurchOrder = dr["id_PurchOrder"].EnsureGuid(),
                id_PurchLine  = dr["id_PurchLine"].EnsureGuid(),
                Amount = dr["Amount"].EnsureDouble(),
                PurchLineCode = dr["PurchLineCode"].EnsureString(),
                UnitPrice = dr["UnitPrice"].EnsureDouble(),
                Quantity = dr["Quantity"].EnsureDouble(),
                ProdCode = dr["ProdCode"].EnsureString(),
                ProdDesc = dr["ProdDesc"].EnsureString()

            };
            return retVal;
        }
    }
}
