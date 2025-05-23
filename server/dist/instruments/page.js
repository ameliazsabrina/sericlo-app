"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Instruments;
const jsx_runtime_1 = require("react/jsx-runtime");
const server_1 = require("../utils/supabase/server");
async function Instruments() {
    const supabase = await (0, server_1.createClient)();
    const { data: instruments } = await supabase.from("instruments").select();
    return (0, jsx_runtime_1.jsx)("pre", { children: JSON.stringify(instruments, null, 2) });
}
