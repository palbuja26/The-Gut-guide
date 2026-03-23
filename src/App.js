import { useState, useEffect, useCallback } from "react";

// ── DATA ────────────────────────────────────────────────────────────────────

const FODMAP_DATA = {
  garlic: { fodmap: "high", gi: "low", bloat: "high", note: "Very high fructans — a top IBS trigger" },
  onion: { fodmap: "high", gi: "low", bloat: "high", note: "High fructans, even cooked" },
  wheat: { fodmap: "high", gi: "high", bloat: "high", note: "Fructans + gluten combo, common trigger" },
  bread: { fodmap: "high", gi: "high", bloat: "high", note: "Unless sourdough or gluten-free" },
  milk: { fodmap: "high", gi: "medium", bloat: "high", note: "High lactose — try lactose-free alternatives" },
  apple: { fodmap: "high", gi: "medium", bloat: "medium", note: "High fructose, best avoided" },
  pear: { fodmap: "high", gi: "medium", bloat: "medium", note: "Very high fructose" },
  mango: { fodmap: "high", gi: "high", bloat: "medium", note: "High fructose, spikes blood sugar too" },
  honey: { fodmap: "high", gi: "high", bloat: "medium", note: "High fructose — use maple syrup instead" },
  lentils: { fodmap: "high", gi: "low", bloat: "high", note: "Canned & rinsed lentils are lower FODMAP" },
  chickpeas: { fodmap: "high", gi: "low", bloat: "high", note: "Canned & rinsed are better tolerated" },
  cauliflower: { fodmap: "high", gi: "low", bloat: "high", note: "High polyols — common bloating culprit" },
  mushrooms: { fodmap: "high", gi: "low", bloat: "medium", note: "High polyols" },
  avocado: { fodmap: "medium", gi: "low", bloat: "low", note: "Portion size matters — ¼ is low FODMAP" },
  chicken: { fodmap: "low", gi: "low", bloat: "low", note: "Excellent IBS-safe protein" },
  salmon: { fodmap: "low", gi: "low", bloat: "low", note: "Anti-inflammatory omega-3s, great for IBS" },
  eggs: { fodmap: "low", gi: "low", bloat: "low", note: "Very well tolerated, stable energy" },
  rice: { fodmap: "low", gi: "medium", bloat: "low", note: "White rice is gentle; brown rice has more fibre" },
  oats: { fodmap: "low", gi: "medium", bloat: "low", note: "Rolled oats (½ cup) are low FODMAP" },
  carrot: { fodmap: "low", gi: "low", bloat: "low", note: "Gut-friendly, good for stable energy" },
  potato: { fodmap: "low", gi: "high", bloat: "low", note: "Low FODMAP but high GI — pair with protein" },
  cucumber: { fodmap: "low", gi: "low", bloat: "low", note: "Very gentle on the gut" },
  spinach: { fodmap: "low", gi: "low", bloat: "low", note: "Great for iron and energy — IBS safe" },
  tomato: { fodmap: "low", gi: "low", bloat: "low", note: "Low FODMAP in normal portions" },
  zucchini: { fodmap: "low", gi: "low", bloat: "low", note: "Very well tolerated courgette" },
  banana: { fodmap: "low", gi: "medium", bloat: "low", note: "Unripe bananas are best — ripe = higher FODMAP" },
  strawberry: { fodmap: "low", gi: "low", bloat: "low", note: "Great low-sugar, low-FODMAP fruit" },
  blueberry: { fodmap: "low", gi: "low", bloat: "low", note: "Antioxidant-rich and gut-friendly" },
  turkey: { fodmap: "low", gi: "low", bloat: "low", note: "Lean protein, great for luteal phase" },
  tofu: { fodmap: "low", gi: "low", bloat: "low", note: "Firm tofu is low FODMAP" },
  quinoa: { fodmap: "low", gi: "medium", bloat: "low", note: "Complete protein, gut-friendly grain" },
  "sweet potato": { fodmap: "low", gi: "medium", bloat: "low", note: "Nutrient-dense, gentle on gut" },
  kale: { fodmap: "low", gi: "low", bloat: "low", note: "Nutrient powerhouse — cook rather than raw" },
  cheddar: { fodmap: "low", gi: "low", bloat: "low", note: "Hard cheeses are low lactose" },
  "greek yogurt": { fodmap: "low", gi: "low", bloat: "low", note: "Lactose-free versions are safest" },
  "lactose-free milk": { fodmap: "low", gi: "low", bloat: "low", note: "Perfect dairy swap" },
  "oat milk": { fodmap: "low", gi: "medium", bloat: "low", note: "IBS-friendly milk alternative" },
  "maple syrup": { fodmap: "low", gi: "medium", bloat: "low", note: "Better than honey for IBS" },
  lemon: { fodmap: "low", gi: "low", bloat: "low", note: "Digestive aid, use freely" },
  ginger: { fodmap: "low", gi: "low", bloat: "low", note: "Anti-nausea, anti-bloat spice" },
  turmeric: { fodmap: "low", gi: "low", bloat: "low", note: "Anti-inflammatory — excellent for IBS" },
};

const SWAP_SUGGESTIONS = {
  garlic: { swap: "garlic-infused oil", reason: "All the flavour, none of the fructans — FODMAPs don't transfer into oil" },
  onion: { swap: "spring onion (green tops only) or chives", reason: "Green parts are low FODMAP; only the bulb is the problem" },
  wheat: { swap: "rice flour or certified oat flour", reason: "Gluten-free flours with no fructans" },
  bread: { swap: "sourdough spelt (small slice) or gluten-free bread", reason: "Long fermentation breaks down fructans significantly" },
  milk: { swap: "lactose-free milk or oat milk", reason: "Same nutrition without the lactose that triggers bloating" },
  apple: { swap: "strawberries or blueberries", reason: "Low fructose fruits that satisfy the same sweet craving" },
  pear: { swap: "kiwi or orange", reason: "Low FODMAP fruits with similar sweetness" },
  mango: { swap: "pineapple (small portion) or papaya", reason: "Lower fructose tropical fruits" },
  honey: { swap: "maple syrup", reason: "Low FODMAP sweetener with similar consistency and sweetness" },
  lentils: { swap: "canned lentils (well rinsed, ½ cup max)", reason: "Rinsing removes most of the oligosaccharides" },
  chickpeas: { swap: "canned chickpeas (well rinsed, ¼ cup max)", reason: "Small rinsed portions are much better tolerated" },
  cauliflower: { swap: "courgette or parsnip", reason: "Lower polyol content, similar texture when roasted" },
  mushrooms: { swap: "courgette or aubergine", reason: "Similar umami texture in cooking, much lower polyols" },
  potato: { swap: "sweet potato or basmati rice", reason: "Lower GI — won't spike blood sugar as sharply" },
  avocado: { swap: "reduce to ¼ avocado per serving", reason: "Smaller portions stay within the low FODMAP threshold" },
};

const RECIPE_LIBRARY = [
  { name: "Lemon Herb Salmon Bowl", ingredients: ["salmon", "rice", "spinach", "lemon", "cucumber"], phase: ["follicular", "ovulatory"], time: "20 min", tags: ["high-protein", "omega-3", "anti-inflammatory"], desc: "A light, energising bowl perfect for high-energy cycle phases.", steps: ["Cook 1 cup of rice according to packet instructions.", "Season salmon with lemon zest, salt and olive oil. Pan-fry 4 min each side.", "Wilt spinach in the same pan for 1 minute.", "Slice cucumber and arrange in a bowl with rice, spinach and salmon.", "Squeeze fresh lemon over everything and serve."], gutTip: "Lemon juice stimulates digestive enzymes and helps reduce bloating after meals." },
  { name: "Ginger Chicken & Rice", ingredients: ["chicken", "rice", "carrot", "ginger", "spinach"], phase: ["menstrual", "luteal"], time: "25 min", tags: ["warming", "iron-rich", "gut-soothing"], desc: "Warming and nourishing — ideal when energy is lower.", steps: ["Cook rice according to packet instructions.", "Dice chicken and fry in olive oil for 6–7 minutes.", "Add grated ginger and sliced carrot, stir-fry 3 more minutes.", "Add a splash of tamari and stir.", "Wilt spinach in for the last minute, serve over rice."], gutTip: "Ginger is one of the most effective natural anti-nausea and anti-bloat remedies." },
  { name: "Turmeric Scrambled Eggs", ingredients: ["eggs", "spinach", "turmeric", "tomato"], phase: ["follicular", "menstrual", "luteal", "ovulatory"], time: "10 min", tags: ["quick", "anti-inflammatory", "blood-sugar stable"], desc: "Fast, satisfying and anti-inflammatory any day of the cycle.", steps: ["Whisk 2–3 eggs with ¼ tsp turmeric, salt and pepper.", "Heat olive oil in a pan over low-medium heat.", "Pour in eggs and gently fold until just set.", "Slice tomato alongside.", "Wilt spinach in the same pan and serve."], gutTip: "Add black pepper to turmeric — it boosts curcumin absorption by up to 2000%." },
  { name: "Sweet Potato & Turkey Hash", ingredients: ["turkey", "sweet potato", "carrot", "spinach", "turmeric"], phase: ["luteal"], time: "30 min", tags: ["luteal-phase", "complex-carbs", "serotonin-boosting"], desc: "Complex carbs help with luteal phase cravings and mood.", steps: ["Dice sweet potato and roast at 200°C for 20 min with olive oil and turmeric.", "Cook minced turkey in a pan until browned.", "Add diced carrot and cook 5 minutes.", "Combine with roasted sweet potato.", "Stir in spinach until wilted, season and serve."], gutTip: "Sweet potato's complex carbs support serotonin — helpful for luteal phase mood dips." },
  { name: "Strawberry Oat Breakfast", ingredients: ["oats", "strawberry", "blueberry", "banana", "maple syrup"], phase: ["follicular", "ovulatory"], time: "10 min", tags: ["fibre", "antioxidants", "energy"], desc: "Gentle fibre and antioxidants to start the day.", steps: ["Add ½ cup rolled oats to a pan with 1 cup oat milk.", "Cook on medium heat for 5 minutes, stirring.", "Slice banana and halve strawberries.", "Top oats with all fruit.", "Drizzle with maple syrup and serve."], gutTip: "Oats contain beta-glucan, a soluble fibre that feeds good gut bacteria." },
  { name: "Quinoa & Roasted Veg", ingredients: ["quinoa", "zucchini", "carrot", "tomato", "lemon", "turmeric"], phase: ["follicular", "ovulatory", "luteal"], time: "35 min", tags: ["plant-based", "complete-protein", "fibre"], desc: "Versatile, filling and IBS-safe plant-based meal.", steps: ["Preheat oven to 200°C. Chop veg, toss with olive oil and turmeric.", "Roast for 25 minutes until tender.", "Rinse quinoa and cook in 2x water for 15 minutes.", "Fluff quinoa and combine with roasted veg.", "Squeeze lemon over, season and serve."], gutTip: "Always rinse quinoa well — it removes saponins which can irritate the gut lining." },
  { name: "Tofu Stir Fry", ingredients: ["tofu", "spinach", "zucchini", "carrot", "ginger", "rice"], phase: ["follicular", "ovulatory"], time: "20 min", tags: ["plant-based", "phytoestrogens", "light"], desc: "Supports oestrogen balance in follicular & ovulatory phases.", steps: ["Press firm tofu for 5 minutes, then cube.", "Fry tofu until golden, about 5 minutes. Set aside.", "Stir-fry carrot and zucchini for 3 minutes.", "Add grated ginger, stir 1 minute.", "Add spinach and tofu back, toss and serve over rice."], gutTip: "Always use firm tofu — soft tofu is much higher in FODMAPs." },
  { name: "Baked Salmon with Kale", ingredients: ["salmon", "kale", "lemon", "sweet potato"], phase: ["menstrual", "luteal"], time: "30 min", tags: ["iron-rich", "omega-3", "magnesium"], desc: "Iron and omega-3 combo ideal during menstruation.", steps: ["Preheat oven to 200°C. Slice sweet potato, drizzle with oil and roast 20 minutes.", "Season salmon with lemon juice, salt and pepper.", "Bake salmon 12–15 minutes until it flakes easily.", "Massage kale with olive oil and lemon for 2 minutes.", "Serve salmon over kale with sweet potato on the side."], gutTip: "Massaging kale breaks down its tough cell walls, making it gentler on an IBS gut." },
];

const CYCLE_PHASES = {
  menstrual: { days: "Days 1–5", color: "#c0392b", emoji: "🌑", label: "Menstrual", advice: "Focus on iron-rich, warming, easy-to-digest foods. Avoid raw foods and cold drinks. Ginger tea can ease cramping.", eat: ["salmon", "spinach", "kale", "eggs", "turkey", "ginger", "turmeric"], avoid: ["raw veg", "caffeine", "alcohol", "high sugar"] },
  follicular: { days: "Days 6–13", color: "#27ae60", emoji: "🌱", label: "Follicular", advice: "Energy is rising — lighter, fresher foods support oestrogen. Great time for new recipes and more variety.", eat: ["eggs", "salmon", "quinoa", "strawberry", "blueberry", "oats", "tofu"], avoid: ["processed foods", "excess sugar"] },
  ovulatory: { days: "Days 14–16", color: "#f39c12", emoji: "☀️", label: "Ovulatory", advice: "Peak energy phase. Anti-inflammatory foods support peak performance. Fibre helps flush excess oestrogen.", eat: ["quinoa", "salmon", "blueberry", "strawberry", "kale", "zucchini"], avoid: ["alcohol", "processed meat", "high FODMAP"] },
  luteal: { days: "Days 17–28", color: "#8e44ad", emoji: "🌙", label: "Luteal", advice: "Progesterone rises — complex carbs ease cravings and support serotonin. Magnesium-rich foods help with PMS.", eat: ["sweet potato", "turkey", "oats", "dark chocolate (85%)", "quinoa", "kale"], avoid: ["caffeine", "salty foods", "refined sugar", "alcohol"] },
};

const SYMPTOMS = [
  { id: "bloating", label: "Bloating", emoji: "🫧" },
  { id: "belly_ache", label: "Belly ache", emoji: "😣" },
  { id: "fatigue", label: "Fatigue", emoji: "😴" },
  { id: "itchiness", label: "Itchiness", emoji: "🤚" },
  { id: "cramps", label: "Cramps", emoji: "⚡" },
  { id: "brain_fog", label: "Brain fog", emoji: "🌫️" },
  { id: "nausea", label: "Nausea", emoji: "🤢" },
  { id: "diarrhoea", label: "Diarrhoea", emoji: "🚨" },
];

const SEVERITY = [
  { id: "mild", label: "Mild", color: "#f39c12" },
  { id: "moderate", label: "Moderate", color: "#e67e22" },
  { id: "severe", label: "Severe", color: "#e74c3c" },
];

const DELAY_OPTIONS = ["Within 30 min", "1–2 hours", "2–4 hours", "Next day"];

// ── HELPERS ─────────────────────────────────────────────────────────────────

function getPhaseFromDay(day) {
  if (day >= 1 && day <= 5) return "menstrual";
  if (day >= 6 && day <= 13) return "follicular";
  if (day >= 14 && day <= 16) return "ovulatory";
  return "luteal";
}

function getRiskColor(item) {
  const d = FODMAP_DATA[item.toLowerCase()];
  if (!d) return "#888";
  if (d.fodmap === "high" || d.bloat === "high") return "#e74c3c";
  if (d.fodmap === "medium" || d.bloat === "medium") return "#f39c12";
  return "#27ae60";
}

function getRiskLabel(item) {
  const d = FODMAP_DATA[item.toLowerCase()];
  if (!d) return "Unknown";
  if (d.fodmap === "high") return "High FODMAP";
  if (d.bloat === "high") return "Bloating risk";
  if (d.gi === "high") return "High GI";
  if (d.fodmap === "medium") return "Moderate";
  return "IBS Safe";
}

function analyzeMeal(foodsRaw) {
  return foodsRaw.map(f => f.trim().toLowerCase()).filter(Boolean).map(food => {
    const d = FODMAP_DATA[food];
    const swap = SWAP_SUGGESTIONS[food];
    if (!d) return { food, status: "unknown", risks: [], swap: null, note: null };
    const risks = [];
    if (d.fodmap === "high") risks.push({ type: "High FODMAP", color: "#e74c3c", icon: "🚨" });
    else if (d.fodmap === "medium") risks.push({ type: "Moderate FODMAP", color: "#f39c12", icon: "⚠️" });
    if (d.gi === "high") risks.push({ type: "High GI / sugar spike", color: "#e67e22", icon: "📈" });
    if (d.bloat === "high") risks.push({ type: "Bloating risk", color: "#c0392b", icon: "💨" });
    const status = risks.length === 0 ? "safe" : risks.some(r => r.color === "#e74c3c" || r.type.includes("Bloating")) ? "danger" : "caution";
    return { food, status, risks, swap: swap || null, note: d.note };
  });
}

function smartRecipe(pantry, phase) {
  const safe = pantry.filter(i => { const d = FODMAP_DATA[i]; return d && d.fodmap === "low"; });
  const moderate = pantry.filter(i => { const d = FODMAP_DATA[i]; return d && d.fodmap === "medium"; });
  const all = [...safe, ...moderate];
  if (all.length < 2) return null;

  // Score library recipes by pantry match + phase match
  const scored = RECIPE_LIBRARY.map(r => {
    const matchCount = r.ingredients.filter(i => all.includes(i)).length;
    const phaseBonus = r.phase.includes(phase) ? 3 : 0;
    return { ...r, score: matchCount + phaseBonus };
  }).filter(r => r.score >= 2).sort((a, b) => b.score - a.score);

  if (scored.length > 0) return { ...scored[0], source: "library" };

  // Build a custom one from whatever safe items they have
  const proteins = all.filter(i => ["chicken", "salmon", "eggs", "turkey", "tofu"].includes(i));
  const grains = all.filter(i => ["rice", "quinoa", "oats", "potato", "sweet potato"].includes(i));
  const veg = all.filter(i => ["spinach", "carrot", "zucchini", "kale", "tomato", "cucumber"].includes(i));
  const flavour = all.filter(i => ["ginger", "turmeric", "lemon"].includes(i));

  if (proteins.length === 0 && grains.length === 0) return null;

  const usedIngredients = [...proteins.slice(0, 1), ...grains.slice(0, 1), ...veg.slice(0, 2), ...flavour.slice(0, 1)];
  const protein = proteins[0] || "eggs";
  const grain = grains[0];
  const hasGrain = !!grain;

  return {
    source: "smart",
    name: `${protein.charAt(0).toUpperCase() + protein.slice(1)} ${hasGrain ? "& " + grain.charAt(0).toUpperCase() + grain.slice(1) : "Bowl"}`,
    time: "20–30 min",
    tags: ["IBS safe", "pantry recipe", CYCLE_PHASES[phase].label.toLowerCase() + " phase"],
    desc: `A simple gut-friendly meal built from what you have, suited to your ${CYCLE_PHASES[phase].label} phase.`,
    ingredients: usedIngredients,
    steps: [
      hasGrain ? `Cook ${grain} according to packet instructions.` : `Prepare your ingredients.`,
      protein === "eggs" ? "Whisk eggs with a pinch of turmeric if available. Cook gently in olive oil." : `Cook ${protein} in olive oil over medium heat until cooked through (${protein === "salmon" ? "4 min each side" : "6–8 minutes"}).`,
      veg.length > 0 ? `Lightly sauté ${veg.slice(0, 2).join(" and ")} in the same pan for 3–4 minutes.` : "Season with salt, pepper and any safe spices you have.",
      flavour.includes("ginger") ? "Add grated ginger in the last minute — it'll reduce bloating." : flavour.includes("turmeric") ? "Add a pinch of turmeric and black pepper for anti-inflammatory benefit." : "Season to taste and plate up.",
      `Serve ${protein}${hasGrain ? " over " + grain : ""} with your veg on the side. Squeeze lemon if you have it.`,
    ],
    gutTip: `All ingredients in this recipe are low FODMAP and suited to your ${CYCLE_PHASES[phase].label} phase. Eat slowly and chew well to support digestion.`,
    phaseNote: CYCLE_PHASES[phase].advice,
  };
}

// ── SHARED COMPONENTS ────────────────────────────────────────────────────────

const dm = { fontFamily: "'DM Sans', sans-serif" };

function Tag({ children, color = "#3d6b47" }) {
  return <span style={{ background: color + "20", color, border: `1px solid ${color}40`, borderRadius: 20, padding: "3px 10px", fontSize: 11, ...dm }}>{children}</span>;
}

function RecipeCard({ recipe, pantry }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
      <div onClick={() => setOpen(o => !o)} style={{ padding: 16, cursor: "pointer", userSelect: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div style={{ fontWeight: 600, fontSize: 15, flex: 1, paddingRight: 8 }}>{recipe.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: "#999", ...dm }}>⏱ {recipe.time}</span>
            <span style={{ fontSize: 11, color: "#bbb" }}>{open ? "▲" : "▼"}</span>
          </div>
        </div>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: "#666", ...dm, lineHeight: 1.5 }}>{recipe.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
          {recipe.tags.map(t => <Tag key={t}>{t}</Tag>)}
        </div>
        <div style={{ fontSize: 12, ...dm }}>
          {recipe.ingredients.map((ing, i) => (
            <span key={ing} style={{ color: pantry.includes(ing) ? "#3d6b47" : "#bbb", fontWeight: pantry.includes(ing) ? 600 : 400 }}>
              {i > 0 ? ", " : ""}{ing}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: "#3d6b47", ...dm, fontWeight: 600 }}>{open ? "▲ Hide recipe" : "▼ See full recipe & method"}</div>
      </div>
      {open && (
        <div style={{ borderTop: "1.5px solid #f0ede6", padding: 16 }}>
          <div style={{ fontSize: 11, ...dm, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Method</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recipe.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ background: "#3d6b47", color: "#fff", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, ...dm, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <p style={{ margin: 0, fontSize: 13, ...dm, lineHeight: 1.65, color: "#444" }}>{step}</p>
              </div>
            ))}
          </div>
          {recipe.gutTip && (
            <div style={{ marginTop: 16, background: "#fffbf5", border: "1.5px solid #e8d5b0", borderRadius: 12, padding: "10px 14px" }}>
              <p style={{ margin: 0, fontSize: 13, ...dm, color: "#7a5c2e", lineHeight: 1.5 }}>💡 <strong>Gut tip:</strong> {recipe.gutTip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MealLogEntry({ entry }) {
  const [open, setOpen] = useState(false);
  const dangerCount = entry.analysis.filter(a => a.status === "danger").length;
  const safeCount = entry.analysis.filter(a => a.status === "safe").length;
  const hasIssues = dangerCount > 0 || entry.analysis.some(a => a.status === "caution");
  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
      <div onClick={() => setOpen(o => !o)} style={{ padding: 14, cursor: "pointer", userSelect: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, ...dm, fontWeight: 700, color: "#3d6b47", textTransform: "uppercase", letterSpacing: 1 }}>{entry.label}</span>
              <span style={{ fontSize: 11, color: "#bbb", ...dm }}>{entry.time}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, textTransform: "capitalize" }}>{entry.foods.join(", ")}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {dangerCount > 0 && <Tag color="#e74c3c">⚠️ {dangerCount} trigger{dangerCount > 1 ? "s" : ""}</Tag>}
              {safeCount > 0 && <Tag color="#27ae60">✓ {safeCount} safe</Tag>}
              {!hasIssues && dangerCount === 0 && <Tag color="#27ae60">✓ All clear</Tag>}
            </div>
          </div>
          <span style={{ fontSize: 11, color: "#bbb", marginLeft: 8 }}>{open ? "▲" : "▼"}</span>
        </div>
        {!open && <div style={{ marginTop: 8, fontSize: 12, color: "#3d6b47", ...dm, fontWeight: 600 }}>▼ See breakdown</div>}
      </div>
      {open && (
        <div style={{ borderTop: "1.5px solid #f0ede6", padding: 14 }}>
          <div style={{ fontSize: 11, ...dm, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Food Breakdown</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {entry.analysis.map((item, i) => {
              const statusColor = item.status === "safe" ? "#27ae60" : item.status === "danger" ? "#e74c3c" : item.status === "caution" ? "#f39c12" : "#888";
              return (
                <div key={i} style={{ borderLeft: `3px solid ${statusColor}`, paddingLeft: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, textTransform: "capitalize" }}>{item.food}</span>
                    <span style={{ fontSize: 11, background: statusColor + "20", color: statusColor, borderRadius: 20, padding: "2px 8px", ...dm }}>
                      {item.status === "safe" ? "✓ Safe" : item.status === "unknown" ? "? Unknown" : item.status === "caution" ? "⚠️ Caution" : "🚨 Trigger"}
                    </span>
                  </div>
                  {item.note && <p style={{ margin: "0 0 6px", fontSize: 12, color: "#666", ...dm, lineHeight: 1.5 }}>{item.note}</p>}
                  {item.risks.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 6 }}>
                      {item.risks.map((r, ri) => <Tag key={ri} color={r.color}>{r.icon} {r.type}</Tag>)}
                    </div>
                  )}
                  {item.swap && (
                    <div style={{ background: "#f0f7f1", border: "1px solid #c8e6c9", borderRadius: 10, padding: "8px 12px", marginTop: 4 }}>
                      <div style={{ fontSize: 11, color: "#2d5235", ...dm, fontWeight: 700, marginBottom: 2 }}>💚 Try instead: {item.swap.swap}</div>
                      <div style={{ fontSize: 11, color: "#555", ...dm }}>{item.swap.reason}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────

export default function GutGuide() {
  const [tab, setTab] = useState("home");
  const [pantry, setPantry] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [cycleStartDate, setCycleStartDate] = useState(null);
  const [mealLog, setMealLog] = useState([]);
  const [mealInput, setMealInput] = useState("");
  const [mealLabel, setMealLabel] = useState("Lunch");
  const [symptomLog, setSymptomLog] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomSeverity, setSymptomSeverity] = useState("moderate");
  const [symptomDelay, setSymptomDelay] = useState("1–2 hours");
  const [symptomNote, setSymptomNote] = useState("");
  const [smartRecipeResult, setSmartRecipeResult] = useState(null);
  const [recipeGenerated, setRecipeGenerated] = useState(false);

  useEffect(() => {
    const load = async () => {
      try { const r = Promise.resolve({value: localStorage.getItem("gg-pantry")}); if (r && r.value) setPantry(JSON.parse(r.value)); } catch {}
      try { const r = Promise.resolve({value: localStorage.getItem("gg-cycle")}); if (r && r.value) setCycleStartDate(r.value); } catch {}
      try { const r = Promise.resolve({value: localStorage.getItem("gg-meals")}); if (r && r.value) setMealLog(JSON.parse(r.value)); } catch {}
      try { const r = Promise.resolve({value: localStorage.getItem("gg-symptoms")}); if (r && r.value) setSymptomLog(JSON.parse(r.value)); } catch {}
    };
    load();
  }, []);

  const cycleDay = useCallback(() => {
    if (!cycleStartDate) return null;
    const diff = Math.floor((new Date() - new Date(cycleStartDate)) / 86400000) + 1;
    return ((diff - 1) % 28) + 1;
  }, [cycleStartDate])();

  const phase = cycleDay ? getPhaseFromDay(cycleDay) : "follicular";
  const phaseData = CYCLE_PHASES[phase];

  function addIngredient() {
    const val = inputVal.trim().toLowerCase();
    if (val && !pantry.includes(val)) {
      const updated = [...pantry, val];
      setPantry(updated);
      localStorage.setItem("gg-pantry", JSON.stringify(updated));
    }
    setInputVal("");
  }

  function removeIngredient(item) {
    const updated = pantry.filter(i => i !== item);
    setPantry(updated);
    localStorage.setItem("gg-pantry", JSON.stringify(updated));
  }

  function logMeal() {
    if (!mealInput.trim()) return;
    const foods = mealInput.split(",").map(f => f.trim().toLowerCase()).filter(Boolean);
    const now = new Date();
    const entry = {
      id: Date.now(),
      label: mealLabel,
      foods,
      time: now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      date: now.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      analysis: analyzeMeal(foods),
    };
    const updated = [entry, ...mealLog];
    setMealLog(updated);
    localStorage.setItem("gg-meals", JSON.stringify(updated));
    setMealInput("");
  }

  function deleteMeal(id) {
    const updated = mealLog.filter(m => m.id !== id);
    setMealLog(updated);
    localStorage.setItem("gg-meals", JSON.stringify(updated));
  }

  function logSymptoms() {
    if (selectedSymptoms.length === 0) return;
    const now = new Date();
    const entry = {
      id: Date.now(),
      symptoms: selectedSymptoms,
      severity: symptomSeverity,
      delay: symptomDelay,
      note: symptomNote,
      time: now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      date: now.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    };
    const updated = [entry, ...symptomLog];
    setSymptomLog(updated);
    localStorage.setItem("gg-symptoms", JSON.stringify(updated));
    setSelectedSymptoms([]);
    setSymptomNote("");
    setSymptomSeverity("moderate");
  }

  function deleteSymptom(id) {
    const updated = symptomLog.filter(s => s.id !== id);
    setSymptomLog(updated);
    localStorage.setItem("gg-symptoms", JSON.stringify(updated));
  }

  function toggleSymptom(id) {
    setSelectedSymptoms(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }

  // ── INSIGHTS ──
  function buildInsights() {
    if (mealLog.length < 2 || symptomLog.length < 1) return null;
    const insights = [];

    // Find trigger foods that appear before symptom entries
    const triggerFoodFreq = {};
    mealLog.forEach(meal => {
      meal.analysis.filter(a => a.status === "danger").forEach(a => {
        triggerFoodFreq[a.food] = (triggerFoodFreq[a.food] || 0) + 1;
      });
    });

    const topTriggers = Object.entries(triggerFoodFreq).sort((a, b) => b[1] - a[1]).slice(0, 3);
    if (topTriggers.length > 0) {
      insights.push({
        icon: "🚨",
        color: "#e74c3c",
        title: "Most frequent trigger foods",
        body: topTriggers.map(([food, count]) => `${food} (${count}x)`).join(", "),
      });
    }

    // Most common symptoms
    const symptomFreq = {};
    symptomLog.forEach(entry => {
      entry.symptoms.forEach(s => {
        symptomFreq[s] = (symptomFreq[s] || 0) + 1;
      });
    });
    const topSymptoms = Object.entries(symptomFreq).sort((a, b) => b[1] - a[1]).slice(0, 3);
    if (topSymptoms.length > 0) {
      const labels = topSymptoms.map(([id, count]) => {
        const s = SYMPTOMS.find(s => s.id === id);
        return `${s ? s.emoji + " " + s.label : id} (${count}x)`;
      });
      insights.push({
        icon: "📊",
        color: "#8e44ad",
        title: "Most common symptoms",
        body: labels.join(", "),
      });
    }

    // Severe symptom days
    const severeDays = symptomLog.filter(s => s.severity === "severe");
    if (severeDays.length > 0) {
      // Find meals logged on same dates as severe symptoms
      const badFoods = new Set();
      severeDays.forEach(symptom => {
        mealLog.filter(m => m.date === symptom.date).forEach(meal => {
          meal.analysis.filter(a => a.status === "danger").forEach(a => badFoods.add(a.food));
        });
      });
      if (badFoods.size > 0) {
        insights.push({
          icon: "⚡",
          color: "#e67e22",
          title: "Foods on your worst symptom days",
          body: [...badFoods].join(", ") + " — consider eliminating these first",
        });
      }
    }

    // Safe streak
    const recentMeals = mealLog.slice(0, 5);
    const cleanMeals = recentMeals.filter(m => m.analysis.every(a => a.status === "safe" || a.status === "unknown")).length;
    if (cleanMeals >= 3) {
      insights.push({
        icon: "🌿",
        color: "#27ae60",
        title: `${cleanMeals} of your last 5 meals were trigger-free`,
        body: "Great consistency — your gut will thank you for it.",
      });
    }

    // Delay pattern
    const delayFreq = {};
    symptomLog.forEach(e => { delayFreq[e.delay] = (delayFreq[e.delay] || 0) + 1; });
    const commonDelay = Object.entries(delayFreq).sort((a, b) => b[1] - a[1])[0];
    if (commonDelay && symptomLog.length >= 3) {
      insights.push({
        icon: "⏱",
        color: "#3498db",
        title: "Your symptoms most often appear " + commonDelay[0].toLowerCase(),
        body: "Knowing your reaction window helps you identify which meal is the culprit.",
      });
    }

    return insights.length > 0 ? insights : null;
  }

  const insights = buildInsights();
  const matchedRecipes = RECIPE_LIBRARY.filter(r =>
    r.ingredients.filter(i => pantry.includes(i)).length >= 2 || r.phase.includes(phase)
  );

  const tabs = [
    { id: "home", label: "Today", emoji: "🌿" },
    { id: "log", label: "Meals", emoji: "🍽️" },
    { id: "symptoms", label: "Symptoms", emoji: "🩺" },
    { id: "insights", label: "Insights", emoji: "📊" },
    { id: "recipes", label: "Recipes", emoji: "🍳" },
    { id: "pantry", label: "Pantry", emoji: "🧺" },
    { id: "cycle", label: "Cycle", emoji: "🌙" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fdf6ec 0%, #f0ede6 100%)", fontFamily: "'Lora', Georgia, serif", color: "#2c1f14" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #3d6b47, #2d5235)", padding: "22px 20px 62px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 10, color: "#a8c9a5", ...dm, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Your gut health companion</div>
          <h1 style={{ margin: 0, fontSize: 28, color: "#fff", fontWeight: 600 }}>Gut Guide 🌿</h1>
          {cycleDay && (
            <div style={{ marginTop: 10 }}>
              <span style={{ background: phaseData.color + "55", border: `1px solid ${phaseData.color}88`, borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#fff", ...dm }}>
                {phaseData.emoji} {phaseData.label} · Day {cycleDay}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nav — scrollable row for 7 tabs */}
      <div style={{ background: "#fff", margin: "-30px 16px 0", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.12)", position: "relative", zIndex: 10, overflowX: "auto", display: "flex" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flexShrink: 0, border: "none", background: tab === t.id ? "#3d6b47" : "transparent", color: tab === t.id ? "#fff" : "#999", padding: "11px 12px", cursor: "pointer", fontSize: 9, ...dm, fontWeight: 600, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, letterSpacing: 0.3, textTransform: "uppercase", minWidth: 56 }}>
            <span style={{ fontSize: 17 }}>{t.emoji}</span>{t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "20px 16px 60px" }}>

        {/* ── TODAY ── */}
        {tab === "home" && (
          <div>
            <h2 style={{ fontSize: 20, margin: "0 0 4px", fontWeight: 600 }}>Good day 👋</h2>
            <p style={{ margin: "0 0 18px", color: "#999", ...dm, fontSize: 14 }}>Here's what your gut needs today</p>
            {!cycleStartDate && (
              <div style={{ background: "#8e44ad12", border: "1.5px solid #8e44ad40", borderRadius: 16, padding: 16, marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>🌙 Set up cycle tracking</div>
                <p style={{ margin: "0 0 12px", fontSize: 13, ...dm, color: "#555", lineHeight: 1.6 }}>Tell me when your last period started and I'll automatically track your phase every day.</p>
                <button onClick={() => setTab("cycle")} style={{ background: "#8e44ad", color: "#fff", border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 13, ...dm, cursor: "pointer", fontWeight: 600 }}>Set my cycle start date →</button>
              </div>
            )}
            {cycleDay && (
              <div style={{ background: `linear-gradient(135deg, ${phaseData.color}20, ${phaseData.color}08)`, border: `1.5px solid ${phaseData.color}40`, borderRadius: 16, padding: 18, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 24 }}>{phaseData.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{phaseData.label} Phase</div>
                    <div style={{ fontSize: 12, color: "#999", ...dm }}>{phaseData.days} · Day {cycleDay} · auto-tracking ✓</div>
                  </div>
                </div>
                <p style={{ margin: "0 0 12px", fontSize: 13, lineHeight: 1.65, ...dm, color: "#444" }}>{phaseData.advice}</p>
                <div style={{ fontSize: 11, ...dm, color: "#aaa", marginBottom: 7, textTransform: "uppercase", letterSpacing: 1 }}>Eat more today</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{phaseData.eat.map(f => <Tag key={f}>{f}</Tag>)}</div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { emoji: "🍽️", value: mealLog.filter(m => m.date === new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" })).length, label: "meals today" },
                { emoji: "🩺", value: symptomLog.filter(s => s.date === new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" })).length, label: "symptoms today" },
              ].map(stat => (
                <div key={stat.label} style={{ background: "#fff", borderRadius: 14, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{stat.emoji}</div>
                  <div style={{ fontSize: 26, fontWeight: 600 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: "#aaa", ...dm }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#fffbf5", border: "1.5px solid #e8d5b0", borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>💡 Gut tip for today</div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, ...dm, color: "#555" }}>
                {phase === "menstrual" && "Warm ginger and turmeric drinks can ease cramping and reduce gut inflammation. Avoid cold foods today."}
                {phase === "follicular" && "Your gut microbiome responds well to variety in the follicular phase. Try fermented foods like lactose-free yogurt."}
                {phase === "ovulatory" && "Peak oestrogen can increase gut motility. Fibre from low-FODMAP veg helps regulate this and flushes excess hormones."}
                {phase === "luteal" && "Progesterone slows gut motility which causes bloating. Complex carbs boost serotonin and magnesium-rich foods ease PMS."}
              </p>
            </div>
          </div>
        )}

        {/* ── MEAL LOG ── */}
        {tab === "log" && (
          <div>
            <h2 style={{ fontSize: 20, margin: "0 0 4px", fontWeight: 600 }}>Meal Log 🍽️</h2>
            <p style={{ margin: "0 0 18px", color: "#999", ...dm, fontSize: 14 }}>Log what you eat — get an instant IBS & sugar spike breakdown</p>
            <div style={{ background: "#fff", borderRadius: 16, padding: 18, marginBottom: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>What are you eating?</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                {["Breakfast", "Lunch", "Dinner", "Snack"].map(label => (
                  <button key={label} onClick={() => setMealLabel(label)} style={{ background: mealLabel === label ? "#3d6b47" : "#f5f0ea", color: mealLabel === label ? "#fff" : "#666", border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 12, ...dm, cursor: "pointer", fontWeight: 600 }}>{label}</button>
                ))}
              </div>
              <input value={mealInput} onChange={e => setMealInput(e.target.value)} onKeyDown={e => e.key === "Enter" && logMeal()} placeholder="e.g. chicken, rice, garlic, spinach" style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e0d8ce", fontSize: 14, ...dm, background: "#fafaf8", outline: "none", boxSizing: "border-box", marginBottom: 6 }} />
              <p style={{ margin: "0 0 12px", fontSize: 12, color: "#bbb", ...dm }}>Separate ingredients with commas</p>
              <button onClick={logMeal} disabled={!mealInput.trim()} style={{ background: mealInput.trim() ? "#3d6b47" : "#e0d8ce", color: "#fff", border: "none", borderRadius: 12, padding: "12px 22px", fontSize: 13, ...dm, fontWeight: 700, cursor: mealInput.trim() ? "pointer" : "not-allowed", width: "100%" }}>Analyse & Log Meal</button>
            </div>
            {mealLog.length === 0
              ? <div style={{ textAlign: "center", padding: "40px 20px", color: "#bbb", ...dm }}><div style={{ fontSize: 40, marginBottom: 10 }}>🥗</div>Log your first meal above</div>
              : <div>
                  <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 12, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.5, ...dm }}>Meal History</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {mealLog.map(entry => (
                      <div key={entry.id}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                          <span style={{ fontSize: 11, color: "#bbb", ...dm }}>{entry.date}</span>
                          <button onClick={() => deleteMeal(entry.id)} style={{ background: "none", border: "none", color: "#ddd", cursor: "pointer", fontSize: 12, ...dm }}>Remove</button>
                        </div>
                        <MealLogEntry entry={entry} />
                      </div>
                    ))}
                  </div>
                </div>
            }
          </div>
        )}

        {/* ── SYMPTOMS ── */}
        {tab === "symptoms" && (
          <div>
            <h2 style={{ fontSize: 20, margin: "0 0 4px", fontWeight: 600 }}>Symptom Tracker 🩺</h2>
            <p style={{ margin: "0 0 18px", color: "#999", ...dm, fontSize: 14 }}>Log how you're feeling — tap everything that applies right now</p>

            {/* Symptom selector */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 18, marginBottom: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>How are you feeling?</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {SYMPTOMS.map(s => {
                  const active = selectedSymptoms.includes(s.id);
                  return (
                    <button key={s.id} onClick={() => toggleSymptom(s.id)} style={{ background: active ? "#3d6b47" : "#f5f0ea", color: active ? "#fff" : "#555", border: `2px solid ${active ? "#3d6b47" : "transparent"}`, borderRadius: 12, padding: "10px 12px", cursor: "pointer", fontSize: 13, ...dm, fontWeight: 500, display: "flex", alignItems: "center", gap: 8, textAlign: "left" }}>
                      <span style={{ fontSize: 18 }}>{s.emoji}</span>{s.label}
                    </button>
                  );
                })}
              </div>

              {selectedSymptoms.length > 0 && (
                <>
                  {/* Severity */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, ...dm, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Severity</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {SEVERITY.map(sv => (
                        <button key={sv.id} onClick={() => setSymptomSeverity(sv.id)} style={{ flex: 1, background: symptomSeverity === sv.id ? sv.color : "#f5f0ea", color: symptomSeverity === sv.id ? "#fff" : "#666", border: "none", borderRadius: 10, padding: "8px 4px", fontSize: 12, ...dm, fontWeight: 600, cursor: "pointer" }}>{sv.label}</button>
                      ))}
                    </div>
                  </div>

                  {/* Delay */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, ...dm, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>When did this start after eating?</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {DELAY_OPTIONS.map(d => (
                        <button key={d} onClick={() => setSymptomDelay(d)} style={{ background: symptomDelay === d ? "#2d5235" : "#f5f0ea", color: symptomDelay === d ? "#fff" : "#666", border: "none", borderRadius: 20, padding: "6px 12px", fontSize: 12, ...dm, cursor: "pointer", fontWeight: symptomDelay === d ? 600 : 400 }}>{d}</button>
                      ))}
                    </div>
                  </div>

                  {/* Optional note */}
                  <input value={symptomNote} onChange={e => setSymptomNote(e.target.value)} placeholder="Optional note (e.g. had garlic bread for lunch)" style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #e0d8ce", fontSize: 13, ...dm, background: "#fafaf8", outline: "none", boxSizing: "border-box", marginBottom: 14 }} />

                  <button onClick={logSymptoms} style={{ background: "#3d6b47", color: "#fff", border: "none", borderRadius: 12, padding: "12px 22px", fontSize: 13, ...dm, fontWeight: 700, cursor: "pointer", width: "100%" }}>Log Symptoms</button>
                </>
              )}

              {selectedSymptoms.length === 0 && (
                <p style={{ margin: 0, fontSize: 13, color: "#bbb", ...dm, textAlign: "center" }}>Tap one or more symptoms above to continue</p>
              )}
            </div>

            {/* Symptom history */}
            {symptomLog.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 12, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.5, ...dm }}>Symptom History</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {symptomLog.map(entry => {
                    const sevColor = entry.severity === "severe" ? "#e74c3c" : entry.severity === "moderate" ? "#e67e22" : "#f39c12";
                    return (
                      <div key={entry.id} style={{ background: "#fff", borderRadius: 14, padding: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderLeft: `4px solid ${sevColor}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                              <span style={{ fontSize: 11, background: sevColor + "20", color: sevColor, borderRadius: 20, padding: "2px 10px", ...dm, fontWeight: 600, textTransform: "capitalize" }}>{entry.severity}</span>
                              <span style={{ fontSize: 11, color: "#bbb", ...dm }}>{entry.date} · {entry.time}</span>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
                              {entry.symptoms.map(sid => {
                                const s = SYMPTOMS.find(s => s.id === sid);
                                return s ? <span key={sid} style={{ fontSize: 13 }}>{s.emoji} {s.label}</span> : null;
                              })}
                            </div>
                            <div style={{ fontSize: 12, color: "#aaa", ...dm }}>Started: {entry.delay}</div>
                            {entry.note && <div style={{ fontSize: 12, color: "#888", ...dm, marginTop: 4, fontStyle: "italic" }}>"{entry.note}"</div>}
                          </div>
                          <button onClick={() => deleteSymptom(entry.id)} style={{ background: "none", border: "none", color: "#ddd", cursor: "pointer", fontSize: 12, ...dm, marginLeft: 8 }}>Remove</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── INSIGHTS ── */}
        {tab === "insights" && (
          <div>
            <h2 style={{ fontSize: 20, margin: "0 0 4px", fontWeight: 600 }}>Insights 📊</h2>
            <p style={{ margin: "0 0 18px", color: "#999", ...dm, fontSize: 14 }}>Patterns found across your meals and symptoms</p>

            {!insights ? (
              <div style={{ background: "#fff", borderRadius: 16, padding: 28, textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Not enough data yet</div>
                <p style={{ margin: 0, fontSize: 13, color: "#888", ...dm, lineHeight: 1.7 }}>
                  Log at least <strong>2 meals</strong> and <strong>1 symptom entry</strong> to start seeing patterns. The more you log, the more accurate your insights become.
                </p>
                <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "center" }}>
                  <button onClick={() => setTab("log")} style={{ background: "#3d6b47", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontSize: 12, ...dm, cursor: "pointer", fontWeight: 600 }}>Log a meal</button>
                  <button onClick={() => setTab("symptoms")} style={{ background: "#f5f0ea", color: "#555", border: "none", borderRadius: 10, padding: "9px 16px", fontSize: 12, ...dm, cursor: "pointer", fontWeight: 600 }}>Log symptoms</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {insights.map((insight, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 18, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", borderLeft: `4px solid ${insight.color}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 20 }}>{insight.icon}</span>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{insight.title}</div>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: "#555", ...dm, lineHeight: 1.6 }}>{insight.body}</p>
                  </div>
                ))}
                <div style={{ background: "#fffbf5", border: "1.5px solid #e8d5b0", borderRadius: 14, padding: 14, marginTop: 4 }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#888", ...dm, lineHeight: 1.7 }}>
                    💡 Insights improve as you log more. Try to log meals and symptoms for at least a week to spot reliable patterns. Consider sharing this data with your GP or dietitian.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── RECIPES ── */}
        {tab === "recipes" && (
          <div>
            <h2 style={{ fontSize: 20, margin: "0 0 4px", fontWeight: 600 }}>Recipes 🍳</h2>
            <p style={{ margin: "0 0 18px", color: "#999", ...dm, fontSize: 14 }}>Matched to your pantry & {phaseData.label} phase</p>

            <div style={{ background: "linear-gradient(135deg, #2d5235, #3d6b47)", borderRadius: 16, padding: 18, marginBottom: 22, color: "#fff" }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>🌿 Smart Recipe Builder</div>
              <p style={{ margin: "0 0 14px", fontSize: 13, ...dm, opacity: 0.85, lineHeight: 1.6 }}>
                Builds a personalised IBS-safe recipe from your safe pantry items, suited to your {phaseData.label} phase. No internet needed.
              </p>
              <button onClick={() => { setSmartRecipeResult(smartRecipe(pantry, phase)); setRecipeGenerated(true); }} disabled={pantry.length < 2} style={{ background: pantry.length < 2 ? "rgba(255,255,255,0.2)" : "#fff", color: pantry.length < 2 ? "#fff" : "#3d6b47", border: "none", borderRadius: 10, padding: "11px 22px", fontSize: 13, fontWeight: 700, cursor: pantry.length < 2 ? "not-allowed" : "pointer", ...dm, opacity: pantry.length < 2 ? 0.5 : 1 }}>
                {pantry.length < 2 ? "Add 2+ pantry items first" : "🌿 Build My Recipe"}
              </button>

              {recipeGenerated && !smartRecipeResult && (
                <div style={{ marginTop: 12, background: "rgba(255,80,80,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: 13, ...dm }}>
                  Not enough safe pantry items to build a recipe. Try adding more green-flagged ingredients.
                </div>
              )}

              {smartRecipeResult && (
                <div style={{ marginTop: 16, background: "rgba(255,255,255,0.12)", borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 2 }}>{smartRecipeResult.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.75, ...dm, color: "#fff", marginBottom: 8 }}>⏱ {smartRecipeResult.time}</div>
                    {smartRecipeResult.phaseNote && <p style={{ margin: "0 0 10px", fontSize: 12, ...dm, opacity: 0.85, fontStyle: "italic", color: "#fff" }}>🌙 {smartRecipeResult.phaseNote}</p>}
                    <p style={{ margin: "0 0 10px", fontSize: 12, ...dm, opacity: 0.85, color: "#fff" }}><strong>Ingredients:</strong> {smartRecipeResult.ingredients.join(", ")}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {smartRecipeResult.steps.map((step, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, ...dm, flexShrink: 0, marginTop: 1, color: "#fff" }}>{i + 1}</span>
                          <p style={{ margin: 0, fontSize: 13, ...dm, opacity: 0.9, lineHeight: 1.6, color: "#fff" }}>{step}</p>
                        </div>
                      ))}
                    </div>
                    {smartRecipeResult.gutTip && (
                      <div style={{ marginTop: 14, background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 12px" }}>
                        <p style={{ margin: 0, fontSize: 12, ...dm, color: "#fff" }}>💡 {smartRecipeResult.gutTip}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 12, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.5, ...dm }}>Recipe Library</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {matchedRecipes.length === 0
                ? <div style={{ textAlign: "center", padding: 40, color: "#bbb", ...dm }}><div style={{ fontSize: 32, marginBottom: 8 }}>🍽️</div>Add pantry items to see matched recipes</div>
                : matchedRecipes.map(recipe => <RecipeCard key={recipe.name} recipe={recipe} pantry={pantry} />)
              }
            </div>
          </div>
        )}

        {/* ── PANTRY ── */}
        {tab === "pantry" && (
          <div>
            <h2 style={{ fontSize: 20, margin: "0 0 4px", fontWeight: 600 }}>My Pantry 🧺</h2>
            <p style={{ margin: "0 0 16px", color: "#999", ...dm, fontSize: 14 }}>Add ingredients — I'll flag IBS and FODMAP risks instantly</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <input value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === "Enter" && addIngredient()} placeholder="e.g. chicken, oats, spinach..." style={{ flex: 1, padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e0d8ce", fontSize: 14, ...dm, background: "#fff", outline: "none" }} />
              <button onClick={addIngredient} style={{ background: "#3d6b47", color: "#fff", border: "none", borderRadius: 12, padding: "12px 20px", fontSize: 18, cursor: "pointer", fontWeight: 700 }}>+</button>
            </div>
            {pantry.length === 0
              ? <div style={{ textAlign: "center", padding: "50px 20px", color: "#bbb", ...dm }}><div style={{ fontSize: 40, marginBottom: 10 }}>🥦</div>Add your first ingredient above</div>
              : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {pantry.map(item => {
                    const d = FODMAP_DATA[item];
                    const color = getRiskColor(item);
                    return (
                      <div key={item} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderLeft: `4px solid ${color}` }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 15, textTransform: "capitalize" }}>{item}</div>
                          {d && <div style={{ fontSize: 12, color: "#999", ...dm, marginTop: 2 }}>{d.note}</div>}
                        </div>
                        <Tag color={color}>{getRiskLabel(item)}</Tag>
                        <button onClick={() => removeIngredient(item)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: "0 4px" }}>×</button>
                      </div>
                    );
                  })}
                </div>
            }
          </div>
        )}

        {/* ── CYCLE ── */}
        {tab === "cycle" && (
          <div>
            <h2 style={{ fontSize: 20, margin: "0 0 4px", fontWeight: 600 }}>Cycle Tracker 🌙</h2>
            <p style={{ margin: "0 0 18px", color: "#999", ...dm, fontSize: 14 }}>Set your start date once — the app updates your phase automatically every day</p>
            <div style={{ background: "#fff", borderRadius: 16, padding: 18, marginBottom: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
              <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 15 }}>📅 When did your last period start?</div>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "#888", ...dm, lineHeight: 1.5 }}>This is Day 1. The app calculates today's day automatically and advances it each morning.</p>
              <input type="date" max={new Date().toISOString().split("T")[0]} defaultValue={cycleStartDate || ""} onChange={async e => { const val = e.target.value; setCycleStartDate(val); localStorage.setItem("gg-cycle", val); }} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e0d8ce", fontSize: 15, ...dm, background: "#fafaf8", outline: "none", boxSizing: "border-box" }} />
              {cycleDay && (
                <div style={{ marginTop: 12, background: "#f0f7f1", borderRadius: 10, padding: "10px 14px", fontSize: 13, ...dm, color: "#2d5235" }}>
                  ✅ You're on <strong>Day {cycleDay}</strong> today — <strong>{phaseData.label} phase</strong> {phaseData.emoji}
                </div>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {Object.entries(CYCLE_PHASES).map(([key, p]) => (
                <div key={key} style={{ background: key === phase ? p.color + "18" : "#fff", border: `2px solid ${key === phase ? p.color : "#eee"}`, borderRadius: 14, padding: 14 }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{p.emoji}</div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{p.label}</div>
                  <div style={{ fontSize: 11, color: "#999", ...dm }}>{p.days}</div>
                  {key === phase && <div style={{ fontSize: 11, color: p.color, ...dm, marginTop: 5, fontWeight: 700 }}>← You are here</div>}
                </div>
              ))}
            </div>
            <div style={{ background: phaseData.color + "12", border: `1.5px solid ${phaseData.color}40`, borderRadius: 16, padding: 18 }}>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{phaseData.emoji} {phaseData.label} Phase</div>
              <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.7, ...dm, color: "#444" }}>{phaseData.advice}</p>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, ...dm, color: "#aaa", marginBottom: 7, textTransform: "uppercase", letterSpacing: 1 }}>✅ Prioritise</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{phaseData.eat.map(f => <Tag key={f}>{f}</Tag>)}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, ...dm, color: "#aaa", marginBottom: 7, textTransform: "uppercase", letterSpacing: 1 }}>❌ Limit</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{phaseData.avoid.map(f => <Tag key={f} color="#c0392b">{f}</Tag>)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
