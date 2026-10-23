// Interactive project simulations (framework-free DOM/SVG/canvas, mounted from React effects).
// Each init* returns a dispose function that stops timers, loops and observers.
/* eslint-disable */
// @ts-nocheck

let _cur = [];
const onDispose = fn => _cur.push(fn);
const NS = "http://www.w3.org/2000/svg";
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
};
const svgEl = (tag, attrs = {}) => {
    const n = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    return n;
};
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sleep = ms => new Promise(r => setTimeout(r, ms));

// tracks whether a panel is on screen so loops can pause
function watch(node) {
    const state = { visible: false };
    const io = new IntersectionObserver(([e]) => { state.visible = e.isIntersecting; });
    io.observe(node);
    onDispose(() => io.disconnect());
    return state;
}

// shared panel scaffold: header (title + live dot + controls), body, footer note
function scaffold(root, note) {
    root.innerHTML = "";
    const head = el("div", "sim-head");
    head.append(el("span", "sim-title", root.dataset.title), el("span", "sim-live", "LIVE"));
    const body = el("div", "sim-body");
    const foot = el("div", "sim-note", `<span>${note}</span>`);
    root.append(head, body, foot);
    return { head, body, foot };
}

const btn = (label, cls = "sim-btn") => { const b = el("button", cls, label); b.type = "button"; return b; };

// ------------------------------------------------------------
// 1. PondFix: live telemetry, forecast, escalating alerts
// ------------------------------------------------------------
function initPond(root) {
    const { head, body, foot } = scaffold(root, "Illustrative simulation of the live telemetry stream");
    const pond = el("select");
    for (let i = 1; i <= 17; i++) pond.append(new Option(`Pond ${i}`, i));
    const go = btn("Inject anomaly");
    head.insertBefore(pond, head.children[1]);
    head.insertBefore(go, head.children[2]);

    const rows = [
        { k: "pH",   base: 7.4, min: 6.5, max: 8.5, amp: 0.1, unit: "" },
        { k: "DO",   base: 6.5, min: 2,   max: 9,   amp: 0.3, unit: " mg/L" },
        { k: "Temp", base: 28,  min: 24,  max: 34,  amp: 0.3, unit: " °C" },
    ];
    const N = 56, W = 480, H = 124, RH = 41, X0 = 92;
    rows.forEach(r => { r.data = Array(N).fill(r.base); });

    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}` });
    rows.forEach((r, i) => {
        r.path = svgEl("polyline", { fill: "none", stroke: "#d5af4d", "stroke-width": 1.8, "stroke-linejoin": "round" });
        r.fore = svgEl("polyline", { fill: "none", stroke: "#7cd9a2", "stroke-width": 1.4, "stroke-dasharray": "4 3", opacity: 0 });
        r.label = svgEl("text", { x: 2, y: i * RH + 15, fill: "#e3c986", "font-size": 11, "font-weight": 600 });
        r.val = svgEl("text", { x: 2, y: i * RH + 31, fill: "#d1d1d1", "font-size": 11 });
        svg.append(svgEl("line", { x1: X0, x2: W, y1: i * RH + RH - 2, y2: i * RH + RH - 2, stroke: "rgba(255,255,255,.07)" }), r.path, r.fore, r.label, r.val);
    });
    const fcLabel = svgEl("text", { x: W - 4, y: RH + 10, fill: "#7cd9a2", "font-size": 9, "text-anchor": "end", opacity: 0 });
    fcLabel.textContent = "forecast +3h";
    svg.append(fcLabel);
    body.append(svg);

    const chips = el("div", "chips");
    const stages = ["Dashboard alert", "App push", "Voice call"].map(t => { const c = el("span", "chip bad", t); chips.append(c); return c; });
    const status = el("span", "chip ok on", "All ponds normal");
    chips.prepend(status);
    body.parentNode.insertBefore(chips, foot);
    chips.style.marginTop = "6px";

    let tick = 0, anomaly = -1, alertAt = -1;
    const ptsFor = (d, r, i, offset = 0) => d.map((v, j) => {
        const x = X0 + ((j + offset) / (N + 10)) * (W - X0 - 6);
        const y = i * RH + RH - 6 - ((clamp(v, r.min, r.max) - r.min) / (r.max - r.min)) * (RH - 16);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

    go.onclick = () => { if (anomaly < 0) { anomaly = 0; alertAt = -1; } };
    pond.onchange = () => { rows.forEach(r => r.data.fill(r.base)); anomaly = -1; alertAt = -1; };

    function step() {
        tick++;
        let doDrop = 0;
        if (anomaly >= 0) {
            anomaly++;
            doDrop = anomaly < 16 ? anomaly * 0.24 : Math.max(0, (16 + 10 - anomaly) * 0.37);
            if (anomaly > 26) anomaly = -1;
        }
        rows.forEach((r, i) => {
            const noise = Math.sin(tick / (5 + i * 2)) * r.amp * 2 + (Math.random() - 0.5) * r.amp * 2;
            let v = r.base + noise;
            if (r.k === "DO") v -= doDrop;
            if (r.k === "pH") v -= doDrop * 0.05;
            r.data.push(v); r.data.shift();
            r.path.setAttribute("points", ptsFor(r.data, r, i));
            r.label.textContent = r.k;
            r.val.textContent = v.toFixed(r.k === "Temp" ? 1 : 2) + r.unit;
        });
        // forecast for DO: extrapolate recent slope
        const d = rows[1].data, slope = (d[N - 1] - d[N - 7]) / 6;
        const fc = []; for (let j = 1; j <= 8; j++) fc.push(d[N - 1] + slope * j * 1.2);
        const show = anomaly >= 0 && slope < -0.03;
        rows[1].fore.setAttribute("points", ptsFor([d[N - 1], ...fc], rows[1], 1, N - 1));
        rows[1].fore.setAttribute("opacity", show ? 1 : 0);
        fcLabel.setAttribute("opacity", show ? 1 : 0);

        // escalation: alert fires when DO crosses a threshold, then escalates
        const low = d[N - 1] < 4.6;
        if (low && alertAt < 0) alertAt = tick;
        if (!low && alertAt >= 0 && anomaly < 0) alertAt = -1;
        const since = alertAt < 0 ? -1 : tick - alertAt;
        stages.forEach((c, i) => c.classList.toggle("on", since >= i * 4));
        status.className = "chip " + (since >= 0 ? "bad on" : "ok on");
        status.textContent = since >= 0 ? `Pond ${pond.value}: low DO` : "All ponds normal";
    }
    const vis = watch(root);
    const timer = setInterval(() => { if (vis.visible) step(); }, 330);
    onDispose(() => clearInterval(timer));
    step();
}

// ------------------------------------------------------------
// 2. Privacy agent: local PII redaction + 5-stage pipeline
// ------------------------------------------------------------
function initPrivacy(root) {
    const { head, body, foot } = scaffold(root, "Illustrative simulation. PII never leaves the browser");
    const run = btn("Run agent");
    head.insertBefore(run, head.children[1]);

    const parts = [
        { t: "Hi, I'm " }, { p: "Priya Nair", tag: "NAME" }, { t: ". Mail " }, { p: "priya.nair@mail.com", tag: "EMAIL" },
        { t: ", call " }, { p: "+91 98765 43210", tag: "PHONE" }, { t: ", card " }, { p: "4111 1111 1111 1111", tag: "CARD" }, { t: "." },
    ];
    const raw = el("div", "txt-row", "<small>Screen text (stays local)</small>");
    const rawT = el("div"); raw.append(rawT);
    const out = el("div", "txt-row", "<small>Sent to LLM (sanitized)</small>");
    const outT = el("div", null, "<span style='color:#8f8f8f'>waiting for run…</span>"); out.append(outT);
    const draw = (target, n) => {
        target.innerHTML = parts.slice(0, n).map(s => s.p ? `<span class="pii">${s.p}</span>` : s.t).join("");
    };
    const drawOut = n => {
        outT.innerHTML = parts.slice(0, n).map(s => s.p ? `<span class="tag">[${s.tag}]</span>` : s.t).join("");
    };
    draw(rawT, parts.length);

    const chips = el("div", "chips");
    const names = ["Parse task", "Plan", "Browser actions", "Verify", "Recover"];
    const stageEls = names.map(n => { const c = el("span", "chip", n); chips.append(c); return c; });
    body.append(raw, out, chips);

    let busy = false;
    run.onclick = async () => {
        if (busy) return; busy = true;
        stageEls.forEach(c => c.classList.remove("on"));
        outT.innerHTML = "";
        for (let i = 1; i <= parts.length; i++) { drawOut(i); await sleep(i % 2 ? 90 : 230); }
        for (const c of stageEls) { c.classList.add("on"); await sleep(520); }
        busy = false;
    };
}

// ------------------------------------------------------------
// 3. Traffic: fixed timing vs adaptive timing (+10s / -11s)
// ------------------------------------------------------------
function initTraffic(root) {
    const { head, body, foot } = scaffold(root, "Illustrative model. The 29.89% figure comes from the SUMO study");
    const bFixed = btn("Fixed", "sim-btn on"), bAI = btn("AI timing", "sim-btn");
    head.insertBefore(bFixed, head.children[1]);
    head.insertBefore(bAI, head.children[2]);

    const cv = el("canvas"); cv.width = 480; cv.height = 200;
    body.append(cv);
    const kp = el("div", "kpis", "<div><b id='k-wait'>0.0s</b><span>avg wait (live)</span></div><div><b id='k-fixed'>--</b><span>Fixed result</span></div><div><b id='k-ai'>--</b><span>AI result</span></div>");
    body.parentNode.insertBefore(kp, foot);
    const kWait = $("#k-wait", kp), kFixed = $("#k-fixed", kp), kAI = $("#k-ai", kp);
    const ctx = cv.getContext("2d");

    const K = 3;                // sim seconds per real second
    const BASE = 15, GAP = 13, SPEED = 15;
    const approaches = [
        { axis: "EW", stop: 228, arm: 228, out: 270 },  // moving right (from west)
        { axis: "EW", stop: 252, arm: 228, out: 270 },  // moving left (from east)
        { axis: "NS", stop: 88,  arm: 80,  out: 122 },  // moving down (from north)
        { axis: "NS", stop: 112, arm: 80,  out: 122 },  // moving up (from south)
    ];
    let sim, mode = "fixed";
    const results = {};

    function rng(seed) { return () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

    function reset() {
        sim = { t: 0, rand: rng(7), cars: approaches.map(() => []), axis: "EW", phase: "green", pt: 0, dur: BASE, wait: 0, n: 0 };
    }
    function rate(axis) { return 0.2 + (axis === "EW" ? 1 : -1) * 0.12 * Math.sin(sim.t / 70); }

    function queue(axis) {
        let live = 0;
        approaches.forEach((a, i) => { if (a.axis === axis) live += sim.cars[i].filter(c => c.d > 0 && c.d < 100).length; });
        return 0.7 * (rate(axis) * 45) + 0.3 * live;      // 70% predicted, 30% live
    }
    function nextDur(nextAxis, prevAxis) {
        if (mode === "fixed") return BASE;
        return clamp(Math.round(BASE + 1.5 * (queue(nextAxis) - queue(prevAxis))), BASE - 11, BASE + 10);
    }

    function update(dt) {
        dt *= K; sim.t += dt; sim.pt += dt;
        if (sim.phase === "green" && sim.pt >= sim.dur) { sim.phase = "clear"; sim.pt = 0; }
        else if (sim.phase === "clear" && sim.pt >= 2) {
            const prev = sim.axis; sim.axis = prev === "EW" ? "NS" : "EW";
            sim.phase = "green"; sim.pt = 0; sim.dur = nextDur(sim.axis, prev);
        }
        approaches.forEach((a, i) => {
            const list = sim.cars[i];
            // spawn at the far end of the arm
            if (sim.rand() < rate(a.axis) * dt * 0.5) {
                const last = list[list.length - 1];
                if (!last || last.d < a.arm - GAP) list.push({ d: a.arm, wait: 0, counted: false, moving: true });
            }
            const green = sim.phase === "green" && sim.axis === a.axis;
            for (let j = 0; j < list.length; j++) {          // list[0] is the front car
                const c = list[j];
                let min = -1e9;
                if (c.d >= 0 && !green) min = 0;              // wait at the stop line
                if (j > 0) min = Math.max(min, list[j - 1].d + GAP);
                const nd = Math.max(c.d - SPEED * dt, min);
                c.moving = c.d - nd > 0.01;
                c.d = nd;
                if (!c.counted && !c.moving) c.wait += dt;
                if (c.d < -0.01 && !c.counted) { c.counted = true; sim.wait += c.wait; sim.n++; }
            }
            while (list.length && list[0].d < -a.out) list.shift();
        });
        const avg = sim.n ? sim.wait / sim.n : 0;
        kWait.textContent = avg.toFixed(1) + "s";
        if (sim.n >= 40) results[mode] = avg;
        kFixed.textContent = results.fixed != null ? results.fixed.toFixed(1) + "s" : "--";
        kAI.textContent = results.ai != null ? results.ai.toFixed(1) + "s" : "--";
    }

    function drawScene() {
        ctx.clearRect(0, 0, 480, 200);
        ctx.fillStyle = "#121315"; ctx.fillRect(0, 88, 480, 24); ctx.fillRect(228, 0, 24, 200);
        ctx.setLineDash([8, 8]); ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, 100); ctx.lineTo(228, 100); ctx.moveTo(252, 100); ctx.lineTo(480, 100);
        ctx.moveTo(240, 0); ctx.lineTo(240, 88); ctx.moveTo(240, 112); ctx.lineTo(240, 200); ctx.stroke(); ctx.setLineDash([]);
        approaches.forEach((a, i) => {
            const green = sim.phase === "green" && sim.axis === a.axis;
            ctx.fillStyle = green ? "#7cd9a2" : "#d5af4d";
            ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 8;
            const pos = [[222, 109], [258, 91], [231, 82], [249, 118]][i];
            ctx.beginPath(); ctx.arc(pos[0], pos[1], 3.5, 0, 7); ctx.fill();
            ctx.shadowBlur = 0;
            sim.cars[i].forEach(c => {
                ctx.fillStyle = c.moving || c.d <= 0 ? "#e3c986" : "#d5af4d";
                if (i === 0) ctx.fillRect(a.stop - c.d - 10, 103, 10, 6);
                if (i === 1) ctx.fillRect(a.stop + c.d, 91, 10, 6);
                if (i === 2) ctx.fillRect(231, a.stop - c.d - 10, 6, 10);
                if (i === 3) ctx.fillRect(243, a.stop + c.d, 6, 10);
            });
        });
    }

    function setMode(m) {
        mode = m; reset();
        bFixed.classList.toggle("on", m === "fixed");
        bAI.classList.toggle("on", m === "ai");
    }
    bFixed.onclick = () => setMode("fixed");
    bAI.onclick = () => setMode("ai");
    reset();

    const vis = watch(root);
    let last = performance.now();
    let raf = 0, alive = true;
    (function loop(now) {
        if (!alive) return;
        const dt = Math.min((now - last) / 1000, 0.05); last = now;
        if (vis.visible) { update(dt); drawScene(); }
        raf = requestAnimationFrame(loop);
    })(last);
    onDispose(() => { alive = false; cancelAnimationFrame(raf); });
}

// ------------------------------------------------------------
// 4. Civix: GPS-tagged report + AI validation
// ------------------------------------------------------------
function initCivix(root) {
    const { head, body, foot } = scaffold(root, "Illustrative: reports must land on a public road to validate");
    const cat = el("select");
    ["Pothole", "Garbage", "Streetlight"].forEach(c => cat.append(new Option(c, c)));
    head.insertBefore(cat, head.children[1]);

    const W = 480, H = 130;
    const roads = [[0, 70, 480, 70], [150, 0, 150, 130], [300, 130, 420, 0], [0, 20, 150, 20]];
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}` });
    svg.style.cursor = "crosshair";
    svg.append(svgEl("rect", { width: W, height: H, fill: "rgba(0,0,0,.25)" }));
    roads.forEach(r => svg.append(svgEl("line", { x1: r[0], y1: r[1], x2: r[2], y2: r[3], stroke: "#212326", "stroke-width": 14, "stroke-linecap": "round" }),
        svgEl("line", { x1: r[0], y1: r[1], x2: r[2], y2: r[3], stroke: "rgba(255,255,255,.14)", "stroke-width": 1, "stroke-dasharray": "5 5" })));
    const hint = svgEl("text", { x: W / 2, y: 120, fill: "#8f8f8f", "font-size": 10, "text-anchor": "middle" });
    hint.textContent = "Click the map to file a report";
    svg.append(hint);
    const pins = svgEl("g"); svg.append(pins);
    body.append(svg);

    const info = el("div", "kpis", "<div><b id='c-st'>--</b><span>AI validation</span></div><div><b id='c-gps' style='font-size:11px;line-height:1.7'>--</b><span>GPS tag</span></div><div><b id='c-n'>0 / 0</b><span>valid / filed</span></div>");
    body.parentNode.insertBefore(info, foot);
    const cSt = $("#c-st", info), cGps = $("#c-gps", info), cN = $("#c-n", info);

    const dist = (px, py, [x1, y1, x2, y2]) => {
        const dx = x2 - x1, dy = y2 - y1, t = clamp(((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy), 0, 1);
        return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
    };
    let valid = 0, total = 0;
    svg.addEventListener("click", async e => {
        hint.remove();
        const r = svg.getBoundingClientRect(), s = Math.min(r.width / W, r.height / H);
        const x = (e.clientX - r.left - (r.width - W * s) / 2) / s, y = (e.clientY - r.top - (r.height - H * s) / 2) / s;
        if (x < 0 || y < 0 || x > W || y > H) return;
        const lat = (17.43 - (y / H) * 0.05).toFixed(4), lng = (78.43 + (x / W) * 0.08).toFixed(4);
        cGps.textContent = `${lat}°N ${lng}°E`;
        cSt.textContent = "checking…"; cSt.style.color = "#e3c986";
        const pin = svgEl("circle", { cx: x, cy: y, r: 5, fill: "#e3c986", stroke: "#fff", "stroke-width": 1 });
        pins.append(pin); total++;
        await sleep(750);
        const ok = roads.some(rd => dist(x, y, rd) <= 11);
        pin.setAttribute("fill", ok ? "#7cd9a2" : "#d5af4d");
        if (ok) valid++;
        cSt.textContent = ok ? `✓ ${cat.value}` : "✕ Not on road";
        cSt.style.color = ok ? "#7cd9a2" : "#d5af4d";
        cN.textContent = `${valid} / ${total}`;
        while (pins.children.length > 12) pins.firstChild.remove();
    });
}

// ------------------------------------------------------------
// 5. Railway: shortest-route finder on a small network
// ------------------------------------------------------------
function initRail(root) {
    const { head, body, foot } = scaffold(root, "Illustrative network. The real system solves time-expanded graphs with CP-SAT");
    const nodes = {
        DEL: [250, 16], BPL: [235, 52], BOM: [110, 78], NGP: [290, 78], KOL: [430, 58],
        HYD: [255, 108], BLR: [200, 124], MAS: [335, 122],
    };
    const edges = [["DEL","BPL",9],["BPL","NGP",6],["BPL","BOM",12],["NGP","HYD",7],["NGP","KOL",17],["HYD","BLR",11],["HYD","MAS",12],["BLR","MAS",6],["BOM","HYD",14],["BOM","BLR",20],["MAS","KOL",26]];
    const from = el("select"), to = el("select");
    Object.keys(nodes).forEach(n => { from.append(new Option(n, n)); to.append(new Option(n, n)); });
    from.value = "HYD"; to.value = "DEL";
    const find = btn("Find route");
    head.insertBefore(from, head.children[1]); head.insertBefore(to, head.children[2]); head.insertBefore(find, head.children[3]);

    const W = 480, H = 140;
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}` });
    const edgeEls = edges.map(([a, b, w]) => {
        const [x1, y1] = nodes[a], [x2, y2] = nodes[b];
        const l = svgEl("line", { x1, y1, x2, y2, stroke: "rgba(255,255,255,.18)", "stroke-width": 1.4 });
        const t = svgEl("text", { x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 3, fill: "#8f8f8f", "font-size": 8, "text-anchor": "middle" });
        t.textContent = w + "h";
        svg.append(l, t);
        return { a, b, w, l };
    });
    const nodeEls = {};
    Object.entries(nodes).forEach(([n, [x, y]]) => {
        const c = svgEl("circle", { cx: x, cy: y, r: 6, fill: "#0c0d0e", stroke: "#d5af4d", "stroke-width": 1.5 });
        const t = svgEl("text", { x, y: y - 10, fill: "#e3c986", "font-size": 9, "text-anchor": "middle", "font-weight": 600 });
        t.textContent = n;
        svg.append(c, t); nodeEls[n] = c;
    });
    const train = svgEl("circle", { r: 4.5, fill: "#7cd9a2", opacity: 0 });
    svg.append(train);
    body.append(svg);
    const out = el("div", "kpis", "<div><b id='r-route' style='font-size:11px;line-height:1.7'>--</b><span>route</span></div><div><b id='r-time'>--</b><span>travel time</span></div>");
    body.parentNode.insertBefore(out, foot);
    const rRoute = $("#r-route", out), rTime = $("#r-time", out);

    function dijkstra(s, t) {
        const dist = {}, prev = {}, todo = new Set(Object.keys(nodes));
        todo.forEach(n => dist[n] = Infinity); dist[s] = 0;
        while (todo.size) {
            let u = null; todo.forEach(n => { if (u === null || dist[n] < dist[u]) u = n; });
            if (dist[u] === Infinity) break;
            todo.delete(u); if (u === t) break;
            edges.forEach(([a, b, w]) => {
                const v = a === u ? b : b === u ? a : null;
                if (v && todo.has(v) && dist[u] + w < dist[v]) { dist[v] = dist[u] + w; prev[v] = u; }
            });
        }
        const path = []; for (let n = t; n; n = prev[n]) path.unshift(n);
        return dist[t] === Infinity ? null : { path, cost: dist[t] };
    }

    let anim = 0;
    function route() {
        const res = dijkstra(from.value, to.value);
        edgeEls.forEach(e => { e.l.setAttribute("stroke", "rgba(255,255,255,.18)"); e.l.setAttribute("stroke-width", 1.4); });
        Object.values(nodeEls).forEach(c => c.setAttribute("fill", "#0c0d0e"));
        cancelAnimationFrame(anim); train.setAttribute("opacity", 0);
        if (!res || res.path.length < 2) { rRoute.textContent = "no trip"; rTime.textContent = "--"; return; }
        rRoute.textContent = res.path.join(" → "); rTime.textContent = res.cost + " h";
        const pts = res.path.map(n => nodes[n]);
        const legs = pts.slice(1).map((p, i) => ({ a: pts[i], b: p, len: Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]) }));
        const total = legs.reduce((s, l) => s + l.len, 0);
        res.path.forEach(n => nodeEls[n].setAttribute("fill", "#5f4a20"));
        res.path.slice(1).forEach((n, i) => {
            const e = edgeEls.find(e => (e.a === res.path[i] && e.b === n) || (e.b === res.path[i] && e.a === n));
            e.l.setAttribute("stroke", "#d5af4d"); e.l.setAttribute("stroke-width", 3);
        });
        train.setAttribute("opacity", 1);
        const t0 = performance.now(), dur = 600 + total * 9;
        (function frame(now) {
            let d = clamp((now - t0) / dur, 0, 1) * total;
            for (const l of legs) {
                if (d <= l.len) { const f = d / l.len; train.setAttribute("cx", l.a[0] + (l.b[0] - l.a[0]) * f); train.setAttribute("cy", l.a[1] + (l.b[1] - l.a[1]) * f); break; }
                d -= l.len;
            }
            if (now - t0 < dur) anim = requestAnimationFrame(frame);
        })(t0);
    }
    find.onclick = route; from.onchange = route; to.onchange = route;
    route();
}

// ------------------------------------------------------------
// 6. Recoverix: shipment exception -> piggyback assignment
// ------------------------------------------------------------
function initRecover(root) {
    const { head, body, foot } = scaffold(root, "Illustrative. The real system searches a 91-hub, 143-edge Telangana graph");
    const bNew = btn("New exception"), bRun = btn("Recover", "sim-btn on");
    head.insertBefore(bNew, head.children[1]);
    head.insertBefore(bRun, head.children[2]);

    const hubs = { NZB: [150, 24], KNR: [275, 22], WGL: [385, 38], SRD: [120, 78], HYD: [250, 72], KMM: [395, 96], MBN: [185, 112], NLG: [320, 112] };
    const edges = [["NZB","KNR"],["KNR","WGL"],["KNR","HYD"],["NZB","SRD"],["SRD","HYD"],["HYD","WGL"],["HYD","MBN"],["HYD","NLG"],["NLG","KMM"],["WGL","KMM"]];
    const trucks = [
        { id: "T1", color: "#e3c986", route: ["NZB", "KNR", "HYD", "NLG", "KMM"], free: 40 },
        { id: "T2", color: "#7cd9a2", route: ["SRD", "HYD", "WGL"], free: 15 },
        { id: "T3", color: "#ffd479", route: ["MBN", "HYD", "NLG"], free: 60 },
    ];
    const spots = ["WGL", "MBN", "KNR", "KMM", "NLG"];
    const weight = 25;

    const W = 480, H = 130;
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}` });
    edges.forEach(([a, b]) => svg.append(svgEl("line", { x1: hubs[a][0], y1: hubs[a][1], x2: hubs[b][0], y2: hubs[b][1], stroke: "rgba(255,255,255,.16)", "stroke-width": 1.4 })));
    Object.entries(hubs).forEach(([n, [x, y]]) => {
        svg.append(svgEl("circle", { cx: x, cy: y, r: 4, fill: "#0c0d0e", stroke: "#8f8f8f" }));
        const t = svgEl("text", { x, y: y + 13, fill: "#8f8f8f", "font-size": 8, "text-anchor": "middle" }); t.textContent = n; svg.append(t);
    });
    const link = svgEl("line", { stroke: "#7cd9a2", "stroke-width": 1.6, "stroke-dasharray": "4 3", opacity: 0 });
    const pin = svgEl("circle", { r: 6, fill: "#d5af4d", stroke: "#fff", "stroke-width": 1.2 });
    svg.append(link, pin);
    const dots = trucks.map(t => { const c = svgEl("circle", { r: 4, fill: t.color }); svg.append(c); return c; });
    body.append(svg);

    const out = el("div", "chips"); out.style.margin = "6px 0 4px";
    const voice = el("span", "chip ok", "Sarvam voice call (Telugu)"), app = el("span", "chip ok", "Driver app notified");
    const kp = el("div", "kpis", "<div><b class='r-win'>--</b><span>assigned truck</span></div><div><b class='r-type' style='font-size:12px;line-height:1.6'>--</b><span>piggyback type</span></div><div><b class='r-score'>--</b><span>score</span></div>");
    body.parentNode.insertBefore(out, foot); body.parentNode.insertBefore(kp, foot);
    const kWin = $(".r-win", kp), kType = $(".r-type", kp), kScore = $(".r-score", kp);

    let spot = 0, winner = null, running = false;
    const hubXY = n => hubs[n];
    const neighbours = (a, b) => edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
    function place() {
        const [x, y] = hubXY(spots[spot]);
        pin.setAttribute("cx", x); pin.setAttribute("cy", y);
        link.setAttribute("opacity", 0); winner = null; out.innerHTML = ""; kWin.textContent = kType.textContent = kScore.textContent = "--";
    }
    function evaluate(hub) {
        return trucks.map(t => {
            if (t.free < weight) return { t, ok: false, type: "no capacity", score: 0 };
            if (t.route.includes(hub)) return { t, ok: true, type: "at_node", score: 0.95 - (t.free - weight) / 400, via: hub };
            const near = t.route.find(n => neighbours(n, hub));
            if (near) return { t, ok: true, type: "pass_through", score: 0.82 - (t.free - weight) / 500, via: near };
            let best = null, bd = 1e9;
            t.route.forEach(n => { const d = Math.hypot(hubs[n][0] - hubs[hub][0], hubs[n][1] - hubs[hub][1]); if (d < bd) { bd = d; best = n; } });
            return bd < 130 ? { t, ok: true, type: "detour", score: 0.66 - bd / 500, via: best } : { t, ok: false, type: "unreachable", score: 0 };
        }).sort((a, b) => b.score - a.score);
    }
    async function recover() {
        if (running) return; running = true;
        const hub = spots[spot], ranked = evaluate(hub);
        out.innerHTML = "";
        ranked.forEach(r => out.append(el("span", "chip" + (r.ok ? "" : " bad"), `${r.t.id} · ${r.type}${r.ok ? " · " + r.score.toFixed(2) : ""}`)));
        const best = ranked[0];
        await sleep(600);
        out.firstChild.classList.add("on"); winner = best;
        kWin.textContent = best.t.id; kType.textContent = best.type; kScore.textContent = best.score.toFixed(2);
        const [vx, vy] = hubs[best.via], [px, py] = hubs[hub];
        link.setAttribute("x1", vx); link.setAttribute("y1", vy); link.setAttribute("x2", px); link.setAttribute("y2", py); link.setAttribute("opacity", best.via === hub ? 0 : 1);
        await sleep(700); out.append(voice); voice.classList.add("on");
        await sleep(800); out.append(app); app.classList.add("on");
        running = false;
    }
    bNew.onclick = () => { if (running) return; voice.classList.remove("on"); app.classList.remove("on"); spot = (spot + 1) % spots.length; place(); };
    bRun.onclick = recover;
    place();

    const vis = watch(root);
    let last = performance.now(), prog = trucks.map((_, i) => i * 0.3), raf = 0, alive = true;
    (function loop(now) {
        if (!alive) return;
        const dt = Math.min((now - last) / 1000, 0.05); last = now;
        if (vis.visible) trucks.forEach((t, i) => {
            prog[i] = (prog[i] + dt * 0.07) % 1;
            const pts = t.route.map(n => hubs[n]), seg = prog[i] * (pts.length - 1), k = Math.min(Math.floor(seg), pts.length - 2), f = seg - k;
            dots[i].setAttribute("cx", pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f);
            dots[i].setAttribute("cy", pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f);
            dots[i].setAttribute("r", winner && winner.t === t ? 5.5 : 4);
        });
        raf = requestAnimationFrame(loop);
    })(last);
    onDispose(() => { alive = false; cancelAnimationFrame(raf); });
}

function mount(fn) {
    return root => {
        const list = [];
        _cur = list;
        fn(root);
        _cur = [];
        return () => list.forEach(f => f());
    };
}
const _pond = mount(initPond), _privacy = mount(initPrivacy), _traffic = mount(initTraffic), _civix = mount(initCivix), _rail = mount(initRail), _recover = mount(initRecover);
export { _pond as initPond, _privacy as initPrivacy, _traffic as initTraffic, _civix as initCivix, _rail as initRail, _recover as initRecover };
