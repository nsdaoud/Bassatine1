using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Bassatine.Startup))]
namespace Bassatine
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
