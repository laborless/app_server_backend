import jwt from "jsonwebtoken"

const members = [
	{
		id: 3,
		name: "stsecurity",
		username: "stsecurity",
		password: "merda"
	},
	{
		id: 4,
		name: "tyrion",
		username: "tyrion",
		password: "bravo"
	},
]

export default class AuthController {
	static async apiGetTest(req, res, next) {
		res.json("test")
	}

	static async apiGetProtected(req, res, next) {
		res.json("This is protected")
	}

	static async apiPostSession(req, res, next) {
		const username = req.body.username;
		const password = req.body.password;

		const member = members.find((member) => { return member.username === username && member.password === password })

		if (member) {
			const user = {
				id: member.id,
				name: member.name,
				username: member.username,
			}
			try {
				const accessToken = jwt.sign({ user }, "goodj_access_key", { expiresIn: '15m', issuer: 'you know nothing' })
				const refreshToken = jwt.sign({ user }, "goodj_refresh_key", { expiresIn: '24h', issuer: 'you know nothing' })
				res.cookie("accessToken", accessToken);
				res.cookie("refreshToken", refreshToken);
				res.send()

			} catch (error) {
				res.sendStatus(500)
			}


		} else {
			res.sendStatus(404)
		}
	}

	static async apiDeleteSession(req, res, next) {
		res.cookie("accessToken", "");
		res.cookie("refreshToken", "");
		res.send()
	}

	static async apiPostRefresh(req, res, next) {
		try {
			const refreshToken = req.cookies.refreshToken
			if (typeof refreshToken !== 'undefined') {
				jwt.verify(refreshToken, "goodj_refresh_key", function(err, data) {
					if (err) {
						return res.sendStatus(401)
					} else {
						const username = data.user.username
						const member = members.find((member) => { return member.username === username})
						if (member) {
							const user = {
								id: member.id,
								name: member.name,
								username: member.username,
							}
							try {
								const accessToken = jwt.sign({ user }, "goodj_access_key", { expiresIn: '1m', issuer: 'you know nothing' })
								res.cookie("accessToken", accessToken);
								res.send()
							} catch (error) {
								res.sendStatus(500)
							}
				
						} else {
							res.sendStatus(401)
						}
					}
				})
			} else {
				res.sendStatus(403)
			}
		} catch (error) {
			res.sendStatus(500)
		}
	}

	static async AuthToken(req, res, next) {
		try {
			const accessToken = req.cookies.accessToken
			if (typeof accessToken !== 'undefined') {
				jwt.verify(accessToken, "goodj_access_key", function(err, data) {
					if (err) {
						return res.sendStatus(401) //verification fail 404?
					} else {
						const username = data.user.username
						const member = members.find((member) => { return member.username === username})
						if (member) {
							next()
						} else {
							res.sendStatus(401)	
						}
					}
				})
			} else {
				res.sendStatus(403)
			}
		} catch (error) {
			res.sendStatus(500)
		}

	}
}