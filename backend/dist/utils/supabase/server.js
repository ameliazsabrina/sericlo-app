"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = createClient;
const supabase_js_1 = require("@supabase/supabase-js");
function createClient(token) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
        global: {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        },
    });
}
