"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const portfolioController_1 = require("../controllers/portfolioController");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticateToken);
// Reorder must come before /:id so it doesn't match as an ID
router.patch('/reorder', portfolioController_1.reorderPortfolioItems);
router.post('/:category', portfolioController_1.createPortfolioItem);
router.get('/:category/:itemType', portfolioController_1.getPortfolioItems); // e.g. /saas/department
router.put('/:id', portfolioController_1.updatePortfolioItem);
router.delete('/:id', portfolioController_1.deletePortfolioItem);
exports.default = router;
//# sourceMappingURL=portfolioRoutes.js.map