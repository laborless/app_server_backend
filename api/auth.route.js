import express from "express"
import AuthCtrl from "./auth.controller.js"

const router = express.Router()


router.route("/test").get(AuthCtrl.apiGetTest)
router.route("/protected").get(AuthCtrl.AuthToken, AuthCtrl.apiGetProtected)
router.route("/session").post(AuthCtrl.apiPostSession)
                        .delete(AuthCtrl.apiDeleteSession)
router.route("/refresh").post(AuthCtrl.apiPostRefresh)



// router.route("/:host")
//     .get(UdpechoCtrl.apiGetMessage)
//     .put(UdpechoCtrl.apiUpdaeMessage)
//     .delete(UdpechoCtrl.apiDeleteMessage)

export default router