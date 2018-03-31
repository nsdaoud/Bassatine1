using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace DBBassatine.Business
{
    public class ContextInfo
    {
        private const string ContextInfoPropertyName = "Custom Module Info";

        public static ContextInfo Current
        {   
            get
            {
                ContextInfo retVal = HttpContext.Current.Items[ContextInfo.ContextInfoPropertyName] as ContextInfo;
                if (retVal == null)
                {
                    //string simulationUser = System.Configuration.ConfigurationSettings.AppSettings["SimulationUser"];
                    //if (string.IsNullOrEmpty(simulationUser))
                        InitiateContext(HttpContext.Current.User.Identity.Name);
                    //else
                    //    InitiateContext(simulationUser);

                    retVal = HttpContext.Current.Items[ContextInfo.ContextInfoPropertyName] as ContextInfo;
                }

                return retVal;
            }
        }

        public Member LoggedInUser { get; private set; }

        private ContextInfo()
        {
        }
        private static void InitiateContext(string loginName)
        {
            Member member = null;
            try
            {
                member = MemberManager.GetMemberByLogin(loginName);
            }
            catch (NotFoundException)
            {
                member = null;
            }

            InitiateContext(member);
        }
        private static void InitiateContext(Member member)
        {
            ContextInfo context = new ContextInfo()
            {
                LoggedInUser = member
            };

            HttpContext.Current.Items.Add(ContextInfo.ContextInfoPropertyName, context);
        }
    }
}
