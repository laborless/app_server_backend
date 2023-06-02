import UdpechoDAO from "../dao/udpechoDAO.js"

export default class UdpechoController {
	static async apiGetMessages(req, res, next) {
		try {
      const result = await UdpechoDAO.getMessages()
      res.json(result)
		} catch (e) {
			res.status(500).json({ error: e.message })
		}
	}
}