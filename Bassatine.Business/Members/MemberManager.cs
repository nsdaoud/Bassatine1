using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
   public class MemberManager
    {
        public static Member GetMemberByLogin(string login)
        {
            using (CustomSqlConnection connection = new CustomSqlConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetUserById", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new CustomSqlParameter("Email", SqlDbType.NVarChar, login));
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    DataSet ds = new DataSet();
                    adapter.Fill(ds);
                    Member all = Load(ds.Tables[0]);
                    return all;
                }
            }
        }

        public void UpdateIfPasswordChanged(string _idMember)
        {
            using (CustomSqlConnection connection = new CustomSqlConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_UpdateIfPasswordChanged", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new CustomSqlParameter("id", SqlDbType.NVarChar, _idMember));
                 
                    cmd.ExecuteNonQuery();
                }
            }


        }

        private static Member Load(DataTable dt)
        {
            Member retVal = new Member();
            if (dt != null)
            {
                foreach (DataRow dr in dt.Rows)
                    retVal = Load(dr);
            }
            return retVal;
        }

        private static Member Load(DataRow dr)
        {
            Member retVal = new Member
            {
                Id = dr["Id"].EnsureString(),
                Email = dr["Email"].EnsureString(),
                PhoneNumber = dr["PhoneNumber"].EnsureString(),
                VendorCode = dr["VendorCode"].EnsureString(),
                PasswordChanged = dr["PasswordChanged"].EnsureBool(),
                isActive = dr["isActive"].EnsureBool()
            };
            return retVal;
        }



    }
}
