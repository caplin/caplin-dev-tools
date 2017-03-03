
module.exports = (application) => {
	application.post('/servlet/Poll', (req, res) => {
		res
			.send(`keep alive ${new Date().toUTCString()}`);
	});
};
