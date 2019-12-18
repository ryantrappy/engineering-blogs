const fs = require('fs');
const request = require('request-promise-native');
const xmlToJS = require('xml2js');

let text = fs.readFileSync( './engineering_blogs.opml', 'utf8');
// console.log(text);
xmlToJS.parseString(text.toString(), function (err, result) {
	if(err) {
		console.error(err);
		process.exit(1);
	}
	const blogArray = result.opml.body[0].outline[0].outline;
	for(let i = 0; i < blogArray.length; i++) {
		const cur = blogArray[i].$;
		validateLinks(cur.title, cur.htmlUrl);
		validateLinks(cur.title, cur.xmlUrl);
	}
});

/**
 * @param title
 * @param url
 */
async function validateLinks(title, url) {
	const options = {
		method: 'GET',
		uri: url,
		resolveWithFullResponse: true,
		simple: false
	};
	request(options).then( (response) => {
		const responseCode = response.statusCode;
		// console.log(title + " response code was " + responseCode);
		if(responseCode !== 200) {
			console.error(title + " has a response code of " + responseCode + ' with url: ' + url);
		}

	}).catch( (err) => {
		// console.error(err);
	});
}
