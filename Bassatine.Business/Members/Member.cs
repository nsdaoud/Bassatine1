using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
    [Serializable]
    [DataContract]
    public  class Member
    {
        [DataMember]
        public String Id { get; set; }

        [DataMember]
        public String Email { get; set; }

        [DataMember]
        public String PhoneNumber { get; set; }
        [DataMember]
        public String VendorCode { get; set; }

        [DataMember]
        public Boolean userisAdmin { get; set; }

        [DataMember]
        public Boolean PasswordChanged { get; set; }

        [DataMember]
        public Boolean isActive { get; set; }

    }
}
