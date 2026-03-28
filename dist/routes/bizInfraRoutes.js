"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const bizInfraController_1 = require("../controllers/bizInfraController");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticateToken);
router.post('/:category', bizInfraController_1.createBizInfraItem);
router.get('/:category', bizInfraController_1.getBizInfraItems);
router.put('/:id', bizInfraController_1.updateBizInfraItem);
router.delete('/:id', bizInfraController_1.deleteBizInfraItem);
exports.default = router;
//# sourceMappingURL=bizInfraRoutes.js.map