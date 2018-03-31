using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
    public class BassatineUsersManager : IBassatineUsersManager
    {
        public void Delete(Guid _Id)
        {
            throw new NotImplementedException();
        }

        public List<BassatineUsers> Find(string criteria)
        {
            throw new NotImplementedException();
        }

        public List<BassatineUsers> LoadUsers()
        {
            using (CustomSqlConnection connection = new CustomSqlConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetAllUsers", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    DataSet ds = new DataSet();
                    adapter.Fill(ds);
                    List<BassatineUsers> all = Load(ds.Tables[0]);
                    return all;
                }
            }
        }

        public BassatineUsers LoadUsersById(Guid _Id)
        {
            throw new NotImplementedException();
        }

        public void UpdateVendorcodeBassatineUsers(String Id,String _VendorCode,Boolean _userisAdmin, Boolean _userisActive, Boolean _PasswordChanged)
        {
            using (CustomSqlConnection connection = new CustomSqlConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_UpdateVendorUsers", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new CustomSqlParameter("Id", SqlDbType.NVarChar, Id));
                    cmd.Parameters.Add(new CustomSqlParameter("VendorCode", SqlDbType.NVarChar, _VendorCode));
                    cmd.Parameters.Add(new CustomSqlParameter("userisAdmin", SqlDbType.Bit, _userisAdmin));
                    cmd.Parameters.Add(new CustomSqlParameter("isActive", SqlDbType.Bit, _userisActive));
                    cmd.Parameters.Add(new CustomSqlParameter("PasswordChanged", SqlDbType.Bit, _PasswordChanged));


                    cmd.ExecuteNonQuery();
                }
            }
        }



        private static List<BassatineUsers> Load(DataTable dt)
        {
            List<BassatineUsers> retVal = new List<BassatineUsers>();
            if (dt != null)
            {
                foreach (DataRow dr in dt.Rows)
                    retVal.Add(Load(dr));
            }
            return retVal;
        }

        private static BassatineUsers LoadOneRecord(DataTable dt)
        {
            BassatineUsers retVal = new BassatineUsers();
            if (dt != null)
            {
                foreach (DataRow dr in dt.Rows)
                    retVal = (Load(dr));
            }
            return retVal;
        }

        private static BassatineUsers Load(DataRow dr)
        {
            BassatineUsers retVal = new BassatineUsers
            {
                Id = dr["Id"].EnsureString(),
                Email= dr["Email"].EnsureString(),
                VendorCode = dr["VendorCode"].EnsureString(),
                PasswordChanged = dr["PasswordChanged"].EnsureBool (),
                userisAdmin = dr["userisAdmin"].EnsureBool(),
                isActive = dr["isActive"].EnsureBool()

            };
            return retVal;
        }

        public static bool IsCurrentUserInRole(string roleName)
        {
            return true;
        }
    }
}
