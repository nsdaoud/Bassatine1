using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
  public  class ConfigManager
    {
        public static Config Current { get; private set; }

        static ConfigManager()
        {
            Current = new Config();
        }
    }
}
