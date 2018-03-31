using DBBassatine.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Bassatine.Controllers
{
    [RoutePrefix("api/vendor")]
    public class vendorPOServicesController : ApiController
    {
        [Route("vendorProducts")]
        [HttpGet]
        public List<VendorProducts> GetListOfVendorProducts()
        {
           
            VendorProductsManager _VendorProductsManager = new VendorProductsManager();
            List<VendorProducts> LstVendorProducts = new List<VendorProducts>();

            LstVendorProducts = _VendorProductsManager.LoadVendorProducts(ContextInfo.Current.LoggedInUser.VendorCode);


            return LstVendorProducts;
        }

        [Route("wareHouses")]
        [HttpGet]
        public List<clsWareHouses> GetListOfWareHouses()
        {

            WareHousesManager _WareHousesManager = new WareHousesManager();
            List<clsWareHouses> LstWareHouses = new List<clsWareHouses>();

            LstWareHouses = _WareHousesManager.LoadWareHouses();


            return LstWareHouses;
        }



        [Route("WareHouseProducts")]
        [HttpGet]
        public List<WareHouseProducts> GetListOfWareHouseProducts()
        {

            WareHouseProductsManager _WareHouseProductsManager = new WareHouseProductsManager();
            List<WareHouseProducts> LstVendorProducts = new List<WareHouseProducts>();

            LstVendorProducts = _WareHouseProductsManager.LoadWareHouseProducts(ContextInfo.Current.LoggedInUser.VendorCode);


            return LstVendorProducts;
        }

        [Route("vendorPO")]
        [HttpGet]
        public List<VendorPO> GetListOfVendorPO()
        {

            VendorPOManager _WareHouseProductsManager = new VendorPOManager();
            List<VendorPO> LstVendorPO = new List<VendorPO>();

            LstVendorPO = _WareHouseProductsManager.LoadVendorPO(ContextInfo.Current.LoggedInUser.VendorCode);


            return LstVendorPO;
        }

        [Route("AllPO")]
        [HttpGet]
        public List<VendorPO> GetListOfAllPO()
        {

            VendorPOManager _WareHouseProductsManager = new VendorPOManager();
            List<VendorPO> LstAllPO = new List<VendorPO>();

            LstAllPO = _WareHouseProductsManager.LoadAllPO();


            return LstAllPO;
        }

        [Route("vendorPOLines")]
        [HttpGet]
        public List<PurchOrderLines> GetListOfVendorPOLines(Guid id)
        {

            PurchOrderLinesManager _PurchOrderLinesManager = new PurchOrderLinesManager();
            List<PurchOrderLines> LstVendorPO = new List<PurchOrderLines>();

            LstVendorPO = _PurchOrderLinesManager.LoadVendorPOLines(id);


            return LstVendorPO;
        }

        [Route("vendorPOById")]
        [HttpGet]
        public VendorPO GetListOfVendorPO(Guid id)
        {

            VendorPOManager _VendorPOManager = new VendorPOManager();
            VendorPO _VendorPO = new VendorPO();

            _VendorPO = _VendorPOManager.LoadVendorPOById(id);


            return _VendorPO;
        }

        [Route("SaveNewVendorPO")]
        [HttpPost]
        public VendorPO SaveNewVendorPO(VendorPO _VendorPO)
        {
            VendorPOManager _VendorPOManager = new VendorPOManager();

            _VendorPO.id_PurchOrder = Guid.NewGuid();
            _VendorPO.VendCode = ContextInfo.Current.LoggedInUser.VendorCode;
            _VendorPO.PurchDate = DateTime.Now;
            _VendorPO.IdVendor = ContextInfo.Current.LoggedInUser.Id;
            _VendorPO.PurchOrderStatus = "In Preparation";
            _VendorPOManager.InsertVendorPO(_VendorPO);

            return _VendorPO;
        }

        [Route("SaveNewVendorPOLines")]
        [HttpPost]
        public PurchOrderLines SaveNewVendorPOLines(PurchOrderLines _PurchOrderLines)
        {
            PurchOrderLinesManager _PurchOrderLinesManager = new PurchOrderLinesManager();

            _PurchOrderLines.id_PurchLine = Guid.NewGuid();

            _PurchOrderLinesManager.InsertPOLines(_PurchOrderLines);

            return _PurchOrderLines;
        }

        [Route("UpdateVendorPO")]
        [HttpPost]
        public VendorPO UpdateVendorPO(VendorPO _VendorPO)
        {
            VendorPOManager _VendorPOManager = new VendorPOManager();

            _VendorPOManager.UpdateVendorPO (_VendorPO);
            EmailManager _emailmanager = new EmailManager();

            string emailfrom = ContextInfo.Current.LoggedInUser.Email;
            string emailto = ConfigManager.Current.SMTPFrom;

            _emailmanager.SendGenericEmail(emailfrom, emailto, "Welcone","a new PO has been create");


            return _VendorPO;
        }

        [Route("UpdatePOSendToVendor")]
        [HttpPost]
        public VendorPO UpdatePOSendToVendor(VendorPO _VendorPO)
        {
            VendorPOManager _VendorPOManager = new VendorPOManager();

            _VendorPOManager.UpdateVendorPO(_VendorPO);
            EmailManager _emailmanager = new EmailManager();

            string emailfrom = ConfigManager.Current.SMTPFrom;
            string emailto = _VendorPO.VendorEmail;


            _emailmanager.SendGenericEmail(emailto, emailfrom, "Welcone", "a new PO has been create");


            return _VendorPO;
        }

        [Route("UpdateVendorPOLines")]
        [HttpPost]
        public PurchOrderLines UpdateVendorPOLines(PurchOrderLines _VendorPOLines)
        {
            PurchOrderLinesManager _PurchOrderLinesManager = new PurchOrderLinesManager();

            _PurchOrderLinesManager.UpdatePOLines(_VendorPOLines);

            return _VendorPOLines;
        }

        [Route("deletePOLine")]
        [HttpPost]
        public PurchOrderLines deletePOLine(PurchOrderLines _PurchOrderLines)
        {
            PurchOrderLinesManager _PurchOrderLinesManager = new PurchOrderLinesManager();
            _PurchOrderLinesManager.Delete(_PurchOrderLines.id_PurchLine);

            return _PurchOrderLines;
        }

    }
}
