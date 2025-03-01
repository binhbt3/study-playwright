import fs from 'fs';
import path from 'path';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

const logDir = path.join(__dirname, '../../logs');
const logFilePath = path.join(logDir, `logs_${new Date().toISOString().split('T')[0]}.txt`);

/**
 * Create log file if it doesn't exist
 */
export function createLogFile(): void {
    console.log(`222: "${logDir}"`)
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    console.log(` debug: "${logFilePath}"`);
    console.log(fs.existsSync(logFilePath));
    if (!fs.existsSync(logFilePath)) {
        console.log(` debug2: "${logFilePath}"`);
        fs.writeFileSync(logFilePath, ''); // Create empty log file
    }
}

/**
 * Save log messages to a file with log level and timestamp
 * @param message - The log message
 * @param level - Log level (INFO, WARN, ERROR, DEBUG) [Default: INFO]
 * @param silent - If true, logs won't be printed to the console (for CI/CD)
 */
export function saveLog(message: string | number, level: LogLevel = 'INFO', silent: boolean = false): void {
    // createLogFile(); // Ensure log file exists

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;

    // Append log to file
    fs.appendFileSync(logFilePath, logMessage, { encoding: 'utf8' });

    // Print log to console unless silent mode is enabled
    if (!silent) {
        const consoleColors = {
            INFO: '\x1b[32m',   // Green
            WARN: '\x1b[33m',   // Yellow
            ERROR: '\x1b[31m',  // Red
            DEBUG: '\x1b[36m',  // Cyan
        };
        console.log(`${consoleColors[level]}${logMessage}\x1b[0m`);
    }
}
