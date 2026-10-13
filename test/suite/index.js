const path = require('path');
const Mocha = require('mocha');
const { glob } = require('glob');

async function run() {
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	// 只收集 test/suite 下的集成测试；test/unit 的用例由 npm run test:unit 在纯 Node 下运行
	const testsRoot = path.resolve(__dirname);
	const files = await glob('**/*.test.js', { cwd: testsRoot });

	// Add files to the test suite
	files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

	return new Promise((c, e) => {
		try {
			// Run the mocha test
			mocha.run(failures => {
				if (failures > 0) {
					e(new Error(`${failures} tests failed.`));
				} else {
					c();
				}
			});
		} catch (err) {
			console.error(err);
			e(err);
		}
	});
}

module.exports = {
	run
};
