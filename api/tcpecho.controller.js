import TcpechoDAO from "../dao/tcpechoDAO.js"

export default class TcpechoController {
	static async apiGetMessages(req, res, next) {
		try {
      const result = await TcpechoDAO.getMessages()
      res.json(result)
		} catch (e) {
			res.status(500).json({ error: e.message })
		}
	}
  
  static async apiGetLatestMessages(req, res, next) {
		try {
      const result = await TcpechoDAO.getLatestMessages()
      res.json(result)
		} catch (e) {
			res.status(500).json({ error: e.message })
		}
	}

  static async apiGetPage(req, res, next) {
		try {
      const pageNum = req.params.num || {}
      const result = await TcpechoDAO.getPage(pageNum)
      res.json(result)
		} catch (e) {
			res.status(500).json({ error: e.message })
		}
	}

  static async apiGetIds(req, res, next) {
		try {
      const result = await TcpechoDAO.getIds()
      res.json(result)
		} catch (e) {
			res.status(500).json({ error: e.message })
		}
	}

  static async apiGetCount(req, res, next) {
		try {
      const result = await TcpechoDAO.getCount()
      res.json(result)
		} catch (e) {
			res.status(500).json({ error: e.message })
		}
	}

  static async apiGetMessage(req, res, next) {
		try {
      const messageId = req.params.id || {}
      const result = await TcpechoDAO.getMessage(messageId)
      res.json(result)
		} catch (e) {
			res.status(500).json({ error: e.message })
		}
	}
}