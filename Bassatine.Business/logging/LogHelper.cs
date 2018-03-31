using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web;


namespace DBBassatine.Business
{
    public static class LogHelper
    {
        #region Conversions
        public static string AppendQueryString(this string url, string queryString)
        {
            if (url.Contains("?"))
                return url + "&" + queryString;
            else
                return url + "?" + queryString;
        }
        public static string ToConcatinatedStringString(this List<Guid> ids)
        {
            StringBuilder str = new StringBuilder();
            if (ids != null)
            {
                foreach (Guid item in ids)
                {
                    if (item != Guid.Empty)
                    {
                        str.Append(item + ";");
                    }
                }
            }

            return str.ToString();
        }
        public static string ToConcatinatedStringString(this List<string> ids)
        {
            StringBuilder str = new StringBuilder();
            if (ids != null)
            {
                foreach (string item in ids)
                {
                    if (item != string.Empty)
                    {
                        str.Append(item + ";");
                    }
                }
            }

            return str.ToString();
        }
        public static List<string> ToStringList(this string concatinatedString)
        {
            List<string> retVal = new List<string>();
            if (concatinatedString != null)
            {
                string[] arrStrings = concatinatedString.Split(";".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);

                foreach (string item in arrStrings)
                {
                    retVal.Add(item.EnsureString());
                }
            }

            return retVal;
        }
        public static string EnsureString(this object obj)
        {
            if (obj == null)
                return string.Empty;
            else
                return obj.ToString();
        }
        public static int EnsureInt(this object obj)
        {
            if (obj == null)
                return 0;

            if (obj == System.DBNull.Value)
                return 0;

            try
            {
                int retVal = Convert.ToInt32(obj);
                return retVal;
            }
            catch
            {
                return 0;
            }
        }
        public static bool EnsureBool(this object obj)
        {
            bool retVal;

            if (obj.EnsureString().ToLower() == "yes")
                return true;
            else if (obj.EnsureString().ToLower() == "no")
                return false;
            else if (bool.TryParse(obj.EnsureString(), out retVal))
                return retVal;
            else
                return false;
        }
        public static double EnsureDouble(this object obj)
        {
            if (obj == null)
                return 0;

            if (obj == System.DBNull.Value)
                return 0;

            try
            {
                double retVal = Convert.ToDouble(obj);
                return retVal;
            }
            catch
            {
                return 0;
            }
        }
        public static DateTime EnsureDate(this object obj)
        {
            DateTime retVal;
            if (DateTime.TryParse(obj.EnsureString(), out retVal))
                return retVal;
            else
                return DateTime.Now;
        }
        public static Guid EnsureGuid(this object obj)
        {
            Guid retVal;
            if (Guid.TryParse(obj.EnsureString(), out retVal))
                return retVal;
            else
                return Guid.Empty;
        }
        public static decimal EnsureDecimal(this object obj)
        {
            decimal retVal;
            if (decimal.TryParse(obj.EnsureString(), out retVal))
                return retVal;
            else
                return 0;
        }
        public static float EnsureFloat(this object obj)
        {
            float retVal;
            if (float.TryParse(obj.EnsureString(), out retVal))
                return retVal;
            else
                return 0f;
        }
        public static T EnsureEnum<T>(this object obj) where T : struct
        {
            if (!typeof(T).IsEnum)
                throw new ArgumentException("T must be an enumerated type");

            string str = obj.EnsureString();
            str = str.Replace(" ", string.Empty);
            T retVal = (T)Enum.Parse(typeof(T), str, true);
            return retVal;
        }
        public static T EnsureEnum<T>(this object obj, T defaultValue) where T : struct
        {
            try
            {
                T retVal = EnsureEnum<T>(obj);
                return retVal;
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }
        #endregion

        #region Translation
        public static TimeSpan ToTimeSpan(this DateTime date)
        {
            return new TimeSpan(date.Hour, date.Minute, 0);
        }
        public static string ToUnixTime(this DateTime date)
        {
            TimeSpan span = (date - new DateTime(1970, 1, 1, 0, 0, 0, 0).ToLocalTime());
            return (span.TotalSeconds * 1000).ToString();
        }
        #endregion

        #region Helpers
        public static string SpaceOnCapital(this string str)
        {
            char[] letters = str.EnsureString().ToCharArray();
            string retVal = string.Empty;

            foreach (char letter in letters)
            {
                if (char.IsLower(letter))
                    retVal = retVal + letter;
                else
                    retVal = retVal + " " + letter;
            }

            return retVal;
        }
        public static byte[] GetBytes(this Stream stream)
        {
            long originalPosition = 0;

            if (stream.CanSeek)
            {
                originalPosition = stream.Position;
                stream.Position = 0;
            }

            try
            {
                byte[] readBuffer = new byte[4096];

                int totalBytesRead = 0;
                int bytesRead;

                while ((bytesRead = stream.Read(readBuffer, totalBytesRead, readBuffer.Length - totalBytesRead)) > 0)
                {
                    totalBytesRead += bytesRead;

                    if (totalBytesRead == readBuffer.Length)
                    {
                        int nextByte = stream.ReadByte();
                        if (nextByte != -1)
                        {
                            byte[] temp = new byte[readBuffer.Length * 2];
                            Buffer.BlockCopy(readBuffer, 0, temp, 0, readBuffer.Length);
                            Buffer.SetByte(temp, totalBytesRead, (byte)nextByte);
                            readBuffer = temp;
                            totalBytesRead++;
                        }
                    }
                }

                byte[] buffer = readBuffer;
                if (readBuffer.Length != totalBytesRead)
                {
                    buffer = new byte[totalBytesRead];
                    Buffer.BlockCopy(readBuffer, 0, buffer, 0, totalBytesRead);
                }
                return buffer;
            }
            finally
            {
                if (stream.CanSeek)
                {
                    stream.Position = originalPosition;
                }
            }
        }
        #endregion

        #region Web Helper
        public static string GetIPFromHttpContext()
        {

            //foreach (IPAddress ipa in Dns.GetHostAddresses(HttpContext.Current.Request.UserHostAddress))
            //    if (ipa.AddressFamily.ToString() == "InterNetwork")
            //        return ipa.ToString();

            //foreach (IPAddress ipa in Dns.GetHostAddresses(Dns.GetHostName()))
            //    if (ipa.AddressFamily.ToString() == "InterNetwork")
            //        return ipa.ToString();

            return string.Empty;
        }
        #endregion

        #region ReflectionHelper
        public static T GetCustomAttribute<T>(this MemberInfo member)
        {
            Type attributeType = typeof(T);
            object[] allAttributes = member.GetCustomAttributes(attributeType, false);
            if (allAttributes != null && allAttributes.Length > 0)
            {
                return (T)allAttributes[0];
            }
            else
            {
                return default(T);
            }
        }
        public static T GetCustomAttribute<T>(this MethodInfo method) where T : Attribute
        {
            foreach (object attr in method.GetCustomAttributes(typeof(T), false))
            {
                T retVal = attr as T;
                if (retVal != null)
                    return retVal;
            }
            return default(T);
        }
        #endregion
    }
}
