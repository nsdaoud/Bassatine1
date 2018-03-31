using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
    public class NotFoundException : ApplicationException

    {
        public NotFoundException()
           : base()
        {
        }
        public NotFoundException(string message)
            : base(message)
        {
        }
        public NotFoundException(string message, params object[] param)
            : base(string.Format(message, param))
        {
        }
    }
}
