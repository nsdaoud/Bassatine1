using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
    public class CustomSqlParameter
    {
        private SqlParameter parameter;

        public CustomSqlParameter(string paramterName, SqlDbType type, object value, object valueInCaseNull)
            : this(paramterName, type, value ?? valueInCaseNull)
        {
        }

        public CustomSqlParameter(string paramterName, SqlDbType type, object value)
        {
            this.parameter = new SqlParameter(paramterName, type);

            if (value == null)
            {
                this.parameter.SqlValue = DBNull.Value;
            }
            else if (type == SqlDbType.UniqueIdentifier && value.EnsureGuid() == Guid.Empty)
            {
                this.parameter.SqlValue = DBNull.Value;
            }
            else if (type == SqlDbType.DateTime && ((DateTime)value) == DateTime.MinValue)
            {
                this.parameter.SqlValue = DBNull.Value;
            }
            else
            {
                this.parameter.Value = value;
            }
        }

        public static implicit operator SqlParameter(CustomSqlParameter parameter)
        {
            return parameter.parameter;
        }

    }
}

