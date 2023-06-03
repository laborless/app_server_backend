import express from "express"
import UdpechoCtrl from "./udpecho.controller.js"

const router = express.Router()

// router.route("/db").get(function(req, res){
//   res.download("./db/udpecho.db", "udpecho.db")
// })
router.route("/log").get(UdpechoCtrl.apiGetMessages)
router.route("/latest").get(UdpechoCtrl.apiGetLatestMessages)
router.route("/ids").get(UdpechoCtrl.apiGetIds)
router.route("/count").get(UdpechoCtrl.apiGetCount)
router.route("/message/:id").get(UdpechoCtrl.apiGetMessage)
router.route("/page/:num").get(UdpechoCtrl.apiGetPage)

// router.route("/:host")
//     .get(UdpechoCtrl.apiGetMessage)
//     .put(UdpechoCtrl.apiUpdaeMessage)
//     .delete(UdpechoCtrl.apiDeleteMessage)

export default router