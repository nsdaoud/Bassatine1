using DBBassatine.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Bassatine.Controllers
{
    public class VendorPOController : Controller
    {
        // GET: VendorPO
        public ActionResult vendorProducts()
        {
            return View();
        }
        // GET: VendorPO
        public ActionResult WareHouseProducts()
        {
            return View();
        }

        public ActionResult purchaseOrder()
        {
            return View();
        }

        public ActionResult POLines()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetListOfProducts(string st, int pageSize, int pageNumber)
        {


            List<VendorProducts> retVal = new List<VendorProducts>();
            try
            {
                VendorProductsManager s = new VendorProductsManager();

                retVal = s.Find(ContextInfo.Current.LoggedInUser.VendorCode,st);
                /*retVa*/
                //l.success = true;
            }
            catch (Exception ex)
            {
                //retVal.success = false;
                //retVal.message = ex.Message;
            }

            return Json(retVal, JsonRequestBehavior.AllowGet);
        }
    }
}