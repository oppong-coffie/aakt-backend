"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
const utils_1 = require("../utils");
function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }
    res.status(500).json({
        error: {
            message: (0, utils_1.getErrorMessage)(error)
        }
    });
    next(error);
}
//# sourceMappingURL=errorHandler.js.map