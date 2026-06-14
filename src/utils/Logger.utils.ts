import { appendFile, unlink, stat } from 'fs';
import { join } from 'path';

/**
 * Formats the current date and time for logging.
 * Uses 'en-US' locale with 'Asia/Jakarta' timezone.
 */
const getFormattedDate = (): string => {
	const date = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
	return '[' +
		date.getDate().toString().padStart(2, '0') + '/' +
		(date.getMonth() + 1).toString().padStart(2, '0') + '/' +
		date.getHours().toString().padStart(2, '0') + ':' +
		date.getMinutes().toString().padStart(2, '0') + ':' +
		date.getSeconds().toString().padStart(2, '0') +
		']';
};

/**
 * Cleans logs older than 7 days.
 */
function cleanOldLogs(): void {
	const logDir = join(process.cwd(), 'storage', 'logs');
	const logFile = join(logDir, 'Server.log');

	stat(logFile, (err: NodeJS.ErrnoException | null, stats) => {
		if (err) {
			// File doesn't exist, nothing to clean
			return;
		}

		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		if (stats.mtime < sevenDaysAgo) {
			// Log file is older than 7 days, delete it
			unlink(logFile, (unlinkErr: NodeJS.ErrnoException | null) => {
				if (unlinkErr) {
					console.error('Error deleting old log file:', unlinkErr);
				} else {
					console.log('Old log file deleted successfully');
				}
			});
		}
	});
}

/**
 * Logger utility function.
 * Logs messages to the console and appends them to 'storage/Server.log'.
 * Also triggers a cleanup of old logs.
 * 
 * @param args - Arguments to log.
 */
export default (...args: any[]): void => {
	const currentDate = getFormattedDate();

	console.log(`\n${currentDate} (${process.pid}):`, ...args);

	const logMessage = args.map(arg => {
		if (typeof arg === 'object') {
			return JSON.stringify(arg, null, 2);
		}
		return String(arg);
	}).join(' ');

	const logFilePath = join(process.cwd(), 'storage', 'logs', 'Server.log');
	const logEntry = `\n${currentDate} (${process.pid}): ${logMessage}\n`;

	appendFile(logFilePath, logEntry, (err: NodeJS.ErrnoException | null) => {
		if (err) {
			console.error('Error writing to log file:', err);
		}
	});

	cleanOldLogs();

	return;
};