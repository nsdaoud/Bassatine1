using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Net.Mail;
using System.IO;

namespace DBBassatine.Business
{
    [Serializable]
    public class EmailInfo
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="EmailInfo"/> class.
        /// </summary>
        public EmailInfo()
        {
            this.TO = new List<string>();
            this.CC = new List<string>();
            this.BCC = new List<string>();
        }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets to.
        /// </summary>
        /// <value>
        /// To.
        /// </value>
        public List<string> TO { get; set; }

        /// <summary>
        /// Gets or sets the cc.
        /// </summary>
        /// <value>
        /// The cc.
        /// </value>
        public List<string> CC { get; set; }

        /// <summary>
        /// Gets or sets the BCC.
        /// </summary>
        /// <value>
        /// The BCC.
        /// </value>
        public List<string> BCC { get; set; }

        /// <summary>
        /// Gets or sets the subject.
        /// </summary>
        /// <value>
        /// The subject.
        /// </value>
        public string Subject { get; set; }

        /// <summary>
        /// Gets or sets the body.
        /// </summary>
        /// <value>
        /// The body.
        /// </value>
        public string Body { get; set; }

        /// <summary>
        /// Gets or sets the retry number.
        /// </summary>
        /// <value>
        /// The retry number.
        /// </value>
        public int RetryNumber { get; set; }

        /// <summary>
        /// Gets or sets the sent on.
        /// </summary>
        /// <value>
        /// The sent on.
        /// </value>
        public DateTime SentOn { get; set; }

        /// <summary>
        /// Gets or sets the error.
        /// </summary>
        /// <value>
        /// The error.
        /// </value>
        public string Error { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is delivered.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is delivered; otherwise, <c>false</c>.
        /// </value>
        public bool IsDelivered { get; set; }

        /// <summary>
        /// Gets or sets the name of the attachment file.
        /// </summary>
        /// <value>
        /// The name of the attachment file.
        /// </value>
        public string AttachmentFileName { get; set; }

        /// <summary>
        /// Gets or sets the attachment.
        /// </summary>
        /// <value>
        /// The attachment.
        /// </value>
        public byte[] Attachment { get; set; }
    }
}
