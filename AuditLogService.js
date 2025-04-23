// Audit logging service for the hybrid mental health platform
// Implements comprehensive logging for compliance and security

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { encryption } = require('../middleware/security');

class AuditLogService {
  constructor() {
    this.logDirectory = process.env.LOG_DIRECTORY || path.join(__dirname, '../../logs');
    this.ensureLogDirectoryExists();
    
    // Log file paths
    this.accessLogPath = path.join(this.logDirectory, 'access.log');
    this.securityLogPath = path.join(this.logDirectory, 'security.log');
    this.dataLogPath = path.join(this.logDirectory, 'data_access.log');
    this.errorLogPath = path.join(this.logDirectory, 'error.log');
    
    // Maximum log file size before rotation (10MB)
    this.maxLogSize = 10 * 1024 * 1024;
  }
  
  // Ensure log directory exists
  ensureLogDirectoryExists() {
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }
  
  // Rotate log file if it exceeds maximum size
  rotateLogIfNeeded(logPath) {
    try {
      if (fs.existsSync(logPath)) {
        const stats = fs.statSync(logPath);
        
        if (stats.size >= this.maxLogSize) {
          const timestamp = new Date().toISOString().replace(/:/g, '-');
          const rotatedLogPath = `${logPath}.${timestamp}`;
          
          fs.renameSync(logPath, rotatedLogPath);
          console.log(`Rotated log file: ${logPath} -> ${rotatedLogPath}`);
        }
      }
    } catch (error) {
      console.error('Error rotating log file:', error);
    }
  }
  
  // Write to log file
  writeToLog(logPath, logEntry) {
    try {
      this.rotateLogIfNeeded(logPath);
      
      const logString = typeof logEntry === 'string' 
        ? logEntry 
        : JSON.stringify(logEntry);
      
      fs.appendFileSync(logPath, `${logString}\n`);
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
  }
  
  // Log access events (authentication, authorization)
  logAccess(req, action, status, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      requestId: req.requestId || uuidv4(),
      userId: req.user ? req.user.id : 'unauthenticated',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      method: req.method,
      path: req.originalUrl,
      action,
      status,
      ...details
    };
    
    this.writeToLog(this.accessLogPath, logEntry);
  }
  
  // Log security events (login attempts, password changes, etc.)
  logSecurity(req, eventType, status, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      requestId: req.requestId || uuidv4(),
      userId: req.user ? req.user.id : 'unauthenticated',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      eventType,
      status,
      ...details
    };
    
    this.writeToLog(this.securityLogPath, logEntry);
  }
  
  // Log data access events (read, write, update, delete)
  logDataAccess(req, dataType, dataId, action, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      requestId: req.requestId || uuidv4(),
      userId: req.user ? req.user.id : 'unauthenticated',
      ipAddress: req.ip,
      dataType,
      dataId: encryption.encrypt(dataId.toString()), // Encrypt identifiers
      action,
      ...details
    };
    
    this.writeToLog(this.dataLogPath, logEntry);
  }
  
  // Log error events
  logError(req, error, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      requestId: req.requestId || uuidv4(),
      userId: req.user ? req.user.id : 'unauthenticated',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      errorMessage: error.message,
      errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      errorCode: error.code,
      errorName: error.name,
      ...details
    };
    
    this.writeToLog(this.errorLogPath, logEntry);
  }
  
  // Get logs for compliance reporting (with pagination)
  getLogs(logType, startDate, endDate, page = 1, limit = 100) {
    try {
      let logPath;
      
      switch (logType) {
        case 'access':
          logPath = this.accessLogPath;
          break;
        case 'security':
          logPath = this.securityLogPath;
          break;
        case 'data':
          logPath = this.dataLogPath;
          break;
        case 'error':
          logPath = this.errorLogPath;
          break;
        default:
          throw new Error('Invalid log type');
      }
      
      if (!fs.existsSync(logPath)) {
        return { logs: [], total: 0, page, limit };
      }
      
      // Read log file
      const logContent = fs.readFileSync(logPath, 'utf8');
      const logLines = logContent.split('\n').filter(line => line.trim());
      
      // Parse and filter logs
      const parsedLogs = logLines
        .map(line => {
          try {
            return JSON.parse(line);
          } catch (error) {
            return null;
          }
        })
        .filter(log => log !== null);
      
      // Filter by date range if provided
      const filteredLogs = parsedLogs.filter(log => {
        if (!startDate && !endDate) return true;
        
        const logDate = new Date(log.timestamp);
        
        if (startDate && endDate) {
          return logDate >= new Date(startDate) && logDate <= new Date(endDate);
        }
        
        if (startDate) {
          return logDate >= new Date(startDate);
        }
        
        if (endDate) {
          return logDate <= new Date(endDate);
        }
        
        return true;
      });
      
      // Paginate results
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
      
      return {
        logs: paginatedLogs,
        total: filteredLogs.length,
        page,
        limit
      };
    } catch (error) {
      console.error('Error getting logs:', error);
      return { logs: [], total: 0, page, limit, error: error.message };
    }
  }
}

module.exports = new AuditLogService();
