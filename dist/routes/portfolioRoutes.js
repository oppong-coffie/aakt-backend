"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const portfolioController2_1 = require("../controllers/portfolioController2");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticateToken);
// ==================== PORTFOLIO OPERATIONS ====================
/**
 * @swagger
 * /portfolio:
 *   post:
 *     summary: Create a new portfolio
 *     tags: [Portfolio]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessName
 *               - bizConcept
 *             properties:
 *               businessName:
 *                 type: string
 *               bizConcept:
 *                 type: object
 *               agents:
 *                 type: array
 */
router.post('/', portfolioController2_1.createPortfolio);




// ==================== AGENT OPERATIONS ====================
/**
 * @swagger
 * /portfolio/{portfolioId}/agent:
 *   post:
 *     summary: Add agent to portfolio
 *     tags: [Agent]
 *     parameters:
 *       - in: path
 *         name: portfolioId
 *         required: true
 *         schema:
 *           type: string
 */
router.post('/:portfolioId/agent', portfolioController2_1.addAgent);
/**
 * @swagger
 * /portfolio/{portfolioId}/agent/{agentId}:
 *   delete:
 *     summary: Remove agent from portfolio
 *     tags: [Agent]
 *     parameters:
 *       - in: path
 *         name: portfolioId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: agentId
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:portfolioId/agent/:agentId', portfolioController2_1.removeAgent);
// ==================== TREE NODE OPERATIONS ====================
/**
 * @swagger
 * /portfolio/{portfolioId}/folder:
 *   post:
 *     summary: Add folder to portfolio
 *     tags: [Tree]
 */
router.post('/:portfolioId/folder', portfolioController2_1.addFolder);
/**
 * @swagger
 * /portfolio/{portfolioId}/project:
 *   post:
 *     summary: Add project to portfolio
 *     tags: [Tree]
 */
router.post('/:portfolioId/project', portfolioController2_1.addProject);
/**
 * @swagger
 * /portfolio/{portfolioId}/block:
 *   post:
 *     summary: Add block to portfolio
 *     tags: [Tree]
 */
router.post('/:portfolioId/block', portfolioController2_1.addBlock);
/**
 * @swagger
 * /portfolio/{portfolioId}/node/{nodeId}/permissions:
 *   put:
 *     summary: Update node permissions
 *     tags: [Tree]
 */
router.put('/:portfolioId/node/:nodeId/permissions', portfolioController2_1.updateNodePermissions);
// ==================== LEGACY OPERATIONS ====================
router.patch('/reorder', portfolioController2_1.reorderPortfolioItems);
router.post('/:category', portfolioController2_1.createPortfolioItem);
router.get('/:category/:itemType', portfolioController2_1.getPortfolioItems);
router.put('/:id', portfolioController2_1.updatePortfolioItem);
router.delete('/:id', portfolioController2_1.deletePortfolioItem);
exports.default = router;
//# sourceMappingURL=portfolioRoutes.js.map