using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace DBBassatine.Business
{
    public class EmailManager
    {
        /// <summary>
        /// Sends the generic email.
        /// </summary>
        /// <param name="to">To.</param>
        /// <param name="cc">The cc.</param>
        /// <param name="bcc">The BCC.</param>
        /// <param name="subject">The subject.</param>
        /// <param name="message">The message.</param>
        /// <param name="attachmentName">Name of the attachment.</param>
        /// <param name="attachment">The attachment.</param>
        //public static void SendGenericEmail(string emailto, string subject, string message, string attachmentName = null, byte[] attachment = null)
        //{
        //    //List<Member> toMembers = GetUsers(to);
        //    //List<Member> ccMembers = GetUsers(cc);
        //    //List<Member> bccMembers = GetUsers(bcc);
        //    SendGenericEmail(toMembers,  subject, message, attachmentName, attachment);
        //}


        public  Task SendGenericEmail(string emailto, string emailfrom, string subject, string message)
        {
            sendMail( emailto, emailfrom, subject,  message);
               return Task.FromResult(0);


        }
        void sendMail(string emailto, string emailfrom, string subject, string message)
        {
            try
            {
                string templatePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory.Replace(@"\Services\", @"\"), @"Content\emailTemplates\Generic.htm");




                if (File.Exists(templatePath))
                {




                    string body = File.ReadAllText(templatePath).Replace("<# Members />", emailto).Replace("<# Message />", message);



                    SmtpClient smtpClient = new SmtpClient(ConfigManager.Current.SMTPServer);
                    smtpClient.EnableSsl = ConfigManager.Current.SMTPSSL;
                    smtpClient.UseDefaultCredentials = ConfigManager.Current.SMTPRequirePassword;
                    smtpClient.Credentials = new System.Net.NetworkCredential(ConfigManager.Current.SMTPFrom, ConfigManager.Current.SMTPPassword);
                    smtpClient.Port = ConfigManager.Current.SMTPPort;

                    MailMessage mail = new MailMessage();
                    mail.From = new MailAddress(emailfrom);
                    mail.Subject = subject;
                    mail.Body = body;
                    mail.IsBodyHtml = true;
                    mail.SubjectEncoding = Encoding.UTF8;
                    mail.BodyEncoding = Encoding.UTF8;
                    mail.To.Add(emailto);

                    object userState = mail;




                    if (!string.IsNullOrEmpty(ConfigManager.Current.SMTPReplyTo))
                        mail.ReplyToList.Add(ConfigManager.Current.SMTPReplyTo);

                    smtpClient.Send(mail);
                }
            }
            catch (Exception ex)
            {
            }

        }

    }
}
