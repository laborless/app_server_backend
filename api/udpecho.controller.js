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
  
  static async apiGetLatestMessages(req, res, next) {
		try {
      const result = await UdpechoDAO.getLatestMessages()
      res.json(result)
		} catch (e) {
			res.status(500).json({ error: e.message })
		}
	}

  static async apiGetPage(req, res, next) {
		try {
      const pageNum = req.params.num || {}
      const result = await UdpechoDAO.getPage(pageNum)
      res.json(result)
		} catch (e) {
			res.status(500).json({ error: e.message })
		}
	}

  static async apiGetIds(req, res, next) {
		try {
      const result = await UdpechoDAO.getIds()
      res.json(result)
		} catch (e) {
			res.status(500).json({ error: e.message })
		}
	}

  static async apiGetCount(req, res, next) {
		try {
      const result = await UdpechoDAO.getCount()
      res.json(result)
		} catch (e) {
			res.status(500).json({ error: e.message })
		}
	}

  static async apiGetMessage(req, res, next) {
		try {
      const messageId = req.params.id || {}
      const result = await UdpechoDAO.getMessage(messageId)
      res.json(result)
		} catch (e) {
			res.status(500).json({ error: e.message })
		}
	}
}