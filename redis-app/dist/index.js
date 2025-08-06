"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const ws_1 = require("ws");
const jwt_1 = require("next-auth/jwt");
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
    database: parseInt(process.env.REDIS_DB || "0")
};
let client;
function initializeRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            client = (0, redis_1.createClient)({
                socket: {
                    host: redisConfig.host,
                    port: redisConfig.port,
                },
                password: redisConfig.password,
                username: redisConfig.username,
                database: redisConfig.database
            });
            client.on("connect", () => {
                console.log('The client is Connectedt to the Redis Application');
            });
            yield client.connect();
        }
        catch (err) {
            console.log(err);
        }
    });
}
initializeRedis().then(() => {
    ServerHandeling();
});
var Socket_Sending_type;
(function (Socket_Sending_type) {
    Socket_Sending_type[Socket_Sending_type["Create_Stream"] = 0] = "Create_Stream";
    Socket_Sending_type[Socket_Sending_type["Stream_Man"] = 1] = "Stream_Man";
    Socket_Sending_type[Socket_Sending_type["Next_Stream"] = 2] = "Next_Stream";
})(Socket_Sending_type || (Socket_Sending_type = {}));
function verifyAuthentication(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get the token using NextAuth's getToken function
            const token = yield (0, jwt_1.getToken)({
                req,
                secret: process.env.AUTH_SECRET,
                cookieName: 'next-auth.session-token'
            });
            console.log("What's in my token?", token);
            return token;
        }
        catch (err) {
            console.error('Error verifying NextAuth session:', err);
            return null;
        }
    });
}
function getUserId() {
}
function ServerHandeling() {
    const wss = new ws_1.WebSocketServer({
        port: 8080,
        verifyClient: (info) => __awaiter(this, void 0, void 0, function* () {
            console.log("Headers received:", info.req.headers);
            console.log("Cookies received:", info.req.headers.cookie);
            try {
                const session = yield verifyAuthentication(info.req);
                if (!session) {
                    console.log('No valid NextAuth session found');
                    return false;
                }
                info.req.session = session;
                console.log(`User ${session.email} authenticated for WebSocket`);
                return true;
            }
            catch (err) {
                console.log('bad-thing-happends');
            }
        })
    });
    wss.on("connection", (socket) => {
        socket.send("Hello this is my application");
        socket.on("messege", (messege) => {
            // Messege can be only string so parsing to json
            const messegeJson = JSON.parse(messege);
            function mesegeHandling() {
                return __awaiter(this, void 0, void 0, function* () {
                    switch (messegeJson.type) {
                        case Socket_Sending_type.Create_Stream:
                            yield client.lPush("stream", JSON.stringify({
                                type: Socket_Sending_type.Create_Stream,
                                url: messegeJson.url,
                                useremail: 'lamichhaneaaditya01@gmail.com'
                            }));
                    }
                });
            }
        });
        //  client.lPush("submission",JSON.stringify({problemid , code , language , userId })) 
    });
}
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Shutting down gracefully...');
    yield client.quit();
    process.exit(0);
}));
