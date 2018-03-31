using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
    public class Config
    {
        public Config()
        {
            SMTPServer = System.Configuration.ConfigurationSettings.AppSettings["SMTPServer"].EnsureString();
            SMTPPort = System.Configuration.ConfigurationSettings.AppSettings["SMTPPort"].EnsureInt();
            SMTPSSL = System.Configuration.ConfigurationSettings.AppSettings["SMTPSSL"].EnsureBool();
            SMTPRequirePassword = System.Configuration.ConfigurationSettings.AppSettings["SMTPRequirePassword"].EnsureBool();
            SMTPFrom = System.Configuration.ConfigurationSettings.AppSettings["SMTPFrom"].EnsureString();
            SMTPPassword = System.Configuration.ConfigurationSettings.AppSettings["SMTPPassword"].EnsureString();
            FromName = System.Configuration.ConfigurationSettings.AppSettings["FromName"].EnsureString();
            FromNameForCommunication = System.Configuration.ConfigurationSettings.AppSettings["FromNameForCommunication"].EnsureString();
            SMTPReplyTo = System.Configuration.ConfigurationSettings.AppSettings["SMTPReplyTo"].EnsureString();
        }
        #region Email
        public string SMTPServer { get; set; }
        public int SMTPPort { get; set; }
        public bool SMTPSSL { get; set; }
        public bool SMTPRequirePassword { get; set; }
        public string SMTPFrom { get; set; }
        public string SMTPPassword { get; set; }
        public string FromName { get; set; }

        public string FromNameForCommunication { get; set; }
        public string SMTPReplyTo { get; set; }
        #endregion
    }
}
