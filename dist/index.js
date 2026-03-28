"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const mongoose_1 = __importDefault(require("mongoose"));
const PORT = process.env.PORT || 3000;
// connect MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => console.log('SUCCESSFULLY CONNECTED TO MONGODB'))
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
});
server_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map