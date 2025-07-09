"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.onReviewCreate = exports.onUserCreate = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const admin = __importStar(require("firebase-admin"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importStar(require("./users"));
Object.defineProperty(exports, "onUserCreate", { enumerable: true, get: function () { return users_1.onUserCreate; } });
const servers_1 = __importDefault(require("./servers"));
const reviews_1 = __importStar(require("./reviews"));
Object.defineProperty(exports, "onReviewCreate", { enumerable: true, get: function () { return reviews_1.onReviewCreate; } });
if (admin.apps.length === 0) {
    admin.initializeApp();
    admin.firestore().settings({ ignoreUndefinedProperties: true });
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    logger.info("Hello from the backend!", { structuredData: true });
    res.status(200).send({
        message: "Hello from the backend api!",
    });
});
app.use("/users", users_1.default);
app.use("/servers", servers_1.default);
app.use("/reviews", reviews_1.default);
exports.api = (0, https_1.onRequest)(app);
//# sourceMappingURL=index.js.map