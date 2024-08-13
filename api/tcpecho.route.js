import express from "express"
import TcpechoCtrl from "./tcpecho.controller.js"
import AuthCtrl from "./auth.controller.js"

const router = express.Router()

router.route("/db").get(AuthCtrl.AuthToken, function(req, res){
  res.download("./db/tcpecho.db", "tcpecho.db")
})
// router.route("/log").get(AuthCtrl.AuthToken, TcpechoCtrl.apiGetMessages)
router.route("/latest").get(AuthCtrl.AuthToken, TcpechoCtrl.apiGetLatestMessages)
router.route("/ids").get(AuthCtrl.AuthToken, TcpechoCtrl.apiGetIds)
router.route("/count").get(AuthCtrl.AuthToken, TcpechoCtrl.apiGetCount)
router.route("/message/:id").get(AuthCtrl.AuthToken, TcpechoCtrl.apiGetMessage)
router.route("/page/:num").get(AuthCtrl.AuthToken, TcpechoCtrl.apiGetPage)
// router.route("/test1").get(TcpechoCtrl.apiGetCount)
// router.route("/test2").get(AuthCtrl.AuthToken, TcpechoCtrl.apiGetCount)

// router.route("/:host")
//     .get(TcpechoCtrl.apiGetMessage)
//     .put(TcpechoCtrl.apiUpdaeMessage)
//     .delete(TcpechoCtrl.apiDeleteMessage)

export default router