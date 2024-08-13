import express from "express"
import UdpechoCtrl from "./udpecho.controller.js"
import AuthCtrl from "./auth.controller.js"

const router = express.Router()

router.route("/db").get(AuthCtrl.AuthToken, function(req, res){
  res.download("./db/udpecho.db", "udpecho.db")
})
// router.route("/log").get(AuthCtrl.AuthToken, UdpechoCtrl.apiGetMessages)
router.route("/latest").get(AuthCtrl.AuthToken, UdpechoCtrl.apiGetLatestMessages)
router.route("/ids").get(AuthCtrl.AuthToken, UdpechoCtrl.apiGetIds)
router.route("/count").get(AuthCtrl.AuthToken, UdpechoCtrl.apiGetCount)
router.route("/message/:id").get(AuthCtrl.AuthToken, UdpechoCtrl.apiGetMessage)
router.route("/page/:num").get(AuthCtrl.AuthToken, UdpechoCtrl.apiGetPage)
// router.route("/test1").get(UdpechoCtrl.apiGetCount)
// router.route("/test2").get(AuthCtrl.AuthToken, UdpechoCtrl.apiGetCount)

// router.route("/:host")
//     .get(UdpechoCtrl.apiGetMessage)
//     .put(UdpechoCtrl.apiUpdaeMessage)
//     .delete(UdpechoCtrl.apiDeleteMessage)

export default router