import './style.css';

// Global Data variables
let wiki_db = null;
let wiki_items = {};
let wiki_items_detail = {};
let wiki_materials = [];
let wiki_stat_mod_groups = [];
let wiki_stat_mods = [];
let wiki_stat_strings = {};

let currentSave = null;
let simulatedSave = null;

let selectedSlotIndex = null;
let activeModalSocketIndex = null; // index in EnchantData

let activeLanguage = 'en';
let activeModalMode = 'material'; // 'material' or 'gear'

const SLOT_GEAR_TYPES = {
  0: 'BOW',
  1: 'ARROW',
  2: 'HELMET',
  3: 'ARMOR',
  4: 'GLOVES',
  5: 'BOOTS',
  6: 'AMULET',
  7: 'EARING',
  8: 'RING',
  9: 'BRACER'
};

const TRANSLATIONS = {
  en: {
    title: "Save Inspector & Simulator",
    importBtn: "Import SaveFile_Live.es3",
    dropzoneTitle: "Import your Save File to Start",
    dropzoneDesc: "Drag & drop your <code>SaveFile_Live.es3</code> here or click the button above.",
    demoBtn: "Load Demo Save Data",
    charHeader: "Explorer Character",
    inventoryHeader: "Equipment Inventory",
    resetBtn: "Reset Sockets",
    editorHeader: "Socket Editor",
    editorNoSelection: "Select an equipped item to edit its sockets and simulate modifications.",
    itemAttrs: "Item Attributes",
    socketsConfig: "Sockets Configuration",
    filterAll: "All",
    filterDeco: "Decoration (Gems)",
    filterEng: "Engraving",
    filterIns: "Inscription",
    modalSearchPlaceholder: "Search material by name...",
    changeItemBtn: "Change Item",
    attribute: "Attribute",
    original: "Original",
    simulated: "Simulated",
    emptySocket: "Empty Socket",
    empty: "Empty",
    clear: "Clear",
    rolled: "Rolled",
    range: "Range",
    noBaseStats: "No base stats found",
    noSockets: "This item grade does not support sockets.",
    selectMaterialTitle: "Select Socket Material",
    selectGearTitle: "Select Gear to Equip",
    modalSearchGearPlaceholder: "Search gear by name...",
    passiveAllocations: "Passive Tree Allocations",
    detailedStats: "Detailed Stats",
    // Gear slot names
    slot_0: "Weapon",
    slot_1: "Offhand",
    slot_2: "Helmet",
    slot_3: "Armor",
    slot_4: "Gloves",
    slot_5: "Boots",
    slot_6: "Pendant",
    slot_7: "Earring",
    slot_8: "Ring",
    slot_9: "Bracer",
    // Stat labels
    stats_AttackDamage: "Attack Damage",
    stats_BasicAttackDPS: "Basic Attack DPS",
    stats_AttackSpeed: "Attack Speed",
    stats_CastSpeed: "Cast Speed",
    stats_CriticalChance: "Critical Chance",
    stats_CriticalDamage: "Critical Damage",
    stats_MaxHp: "Max HP",
    stats_Armor: "Armor",
    stats_CooldownReduction: "Cooldown Reduction",
    stats_MovementSpeed: "Movement Speed",
    stats_HpLeech: "Life Leech",
    stats_IncreaseProjectileDamage: "Projectile Damage",
    stats_IncreaseAreaOfEffectDamage: "AoE Damage",
    stats_PhysicalDamagePercent: "Physical Damage",
    stats_FireDamagePercent: "Fire Damage",
    stats_ColdDamagePercent: "Cold Damage",
    stats_LightningDamagePercent: "Lightning Damage",
    stats_ChaosDamagePercent: "Chaos Damage",
    stats_HpRegenPerSec: "HP Regen per Second",
    stats_AddHpPerHit: "HP per Hit",
    stats_AddHpPerKill: "HP per Kill",
    stats_DodgeChance: "Dodge Chance",
    stats_ElementalDodgeChance: "Elemental Dodge Chance",
    stats_BlockChance: "Block Chance",
    stats_ElementalBlockChance: "Elemental Block Chance",
    stats_FireResistance: "Fire Resistance",
    stats_ColdResistance: "Cold Resistance",
    stats_LightningResistance: "Lightning Resistance",
    stats_ChaosResistance: "Chaos Resistance",
    stats_DamageReduction: "Damage Reduction",
    stats_AdditionalGold: "Additional Gold Gain",
    stats_AdditionalExp: "Additional Experience Gain",
    // Rarity names
    grade_common: "Common",
    grade_uncommon: "Uncommon",
    grade_rare: "Rare",
    grade_legendary: "Legendary",
    grade_immortal: "Immortal",
    grade_arcana: "Arcana",
    grade_beyond: "Beyond",
    grade_celestial: "Celestial",
    grade_divine: "Divine",
    grade_cosmic: "Cosmic",
    // Sockets labels
    decoration: "Gem Socket",
    engraving: "Engraving Socket",
    inscription: "Inscription Socket",
  },
  pt: {
    title: "Inspetor de Save & Simulador",
    importBtn: "Importar SaveFile_Live.es3",
    dropzoneTitle: "Importe seu arquivo de Save para começar",
    dropzoneDesc: "Arraste e solte seu <code>SaveFile_Live.es3</code> aqui ou clique no botão acima.",
    demoBtn: "Carregar Save de Demonstração",
    charHeader: "Personagem Explorador",
    inventoryHeader: "Inventário de Equipamento",
    resetBtn: "Resetar Soquetes",
    editorHeader: "Editor de Soquetes",
    editorNoSelection: "Selecione um item equipado para editar seus soquetes e simular modificações.",
    itemAttrs: "Atributos do Item",
    socketsConfig: "Configuração de Soquetes",
    filterAll: "Todos",
    filterDeco: "Decoração (Gemas)",
    filterEng: "Gravação",
    filterIns: "Inscrição",
    modalSearchPlaceholder: "Buscar material por nome...",
    changeItemBtn: "Alterar Item",
    attribute: "Atributo",
    original: "Original",
    simulated: "Simulado",
    emptySocket: "Soquete Vazio",
    empty: "Vazio",
    clear: "Limpar",
    rolled: "Rolado",
    range: "Intervalo",
    noBaseStats: "Sem atributos base",
    noSockets: "Este nível de item não suporta soquetes.",
    selectMaterialTitle: "Selecionar Material do Soquete",
    selectGearTitle: "Selecionar Equipamento",
    modalSearchGearPlaceholder: "Buscar equipamento por nome...",
    passiveAllocations: "Distribuição da Árvore Passiva",
    detailedStats: "Status Detalhados",
    // Gear slot names
    slot_0: "Arma",
    slot_1: "Mão Secundária",
    slot_2: "Elmo",
    slot_3: "Armadura",
    slot_4: "Luvas",
    slot_5: "Botas",
    slot_6: "Pingente",
    slot_7: "Brinco",
    slot_8: "Anel",
    slot_9: "Bracelete",
    // Stat labels
    stats_AttackDamage: "Dano de Ataque",
    stats_BasicAttackDPS: "DPS de Ataque Básico",
    stats_AttackSpeed: "Velocidade de Ataque",
    stats_CastSpeed: "Velocidade de Conjuração",
    stats_CriticalChance: "Chance Crítica",
    stats_CriticalDamage: "Dano Crítico",
    stats_MaxHp: "HP Máximo",
    stats_Armor: "Armadura",
    stats_CooldownReduction: "Redução de Cooldown",
    stats_MovementSpeed: "Velocidade de Movimento",
    stats_HpLeech: "Roubo de Vida",
    stats_IncreaseProjectileDamage: "Dano de Projétil",
    stats_IncreaseAreaOfEffectDamage: "Dano de Área",
    stats_PhysicalDamagePercent: "Dano Físico",
    stats_FireDamagePercent: "Dano de Fogo",
    stats_ColdDamagePercent: "Dano de Gelo",
    stats_LightningDamagePercent: "Dano de Raio",
    stats_ChaosDamagePercent: "Dano de Caos",
    stats_HpRegenPerSec: "Regeneração de HP por Segundo",
    stats_AddHpPerHit: "HP por Acerto",
    stats_AddHpPerKill: "HP por Abate",
    stats_DodgeChance: "Chance de Esquiva",
    stats_ElementalDodgeChance: "Chance de Esquiva Elemental",
    stats_BlockChance: "Chance de Bloqueio",
    stats_ElementalBlockChance: "Chance de Bloqueio Elemental",
    stats_FireResistance: "Resistência a Fogo",
    stats_ColdResistance: "Resistência a Gelo",
    stats_LightningResistance: "Resistência a Raio",
    stats_ChaosResistance: "Resistência a Caos",
    stats_DamageReduction: "Redução de Dano",
    stats_AdditionalGold: "Ganho de Ouro Adicional",
    stats_AdditionalExp: "Ganho de Experiência Adicional",
    // Rarity names
    grade_common: "Comum",
    grade_uncommon: "Incomum",
    grade_rare: "Raro",
    grade_legendary: "Lendário",
    grade_immortal: "Imortal",
    grade_arcana: "Arcana",
    grade_beyond: "Além",
    grade_celestial: "Celestial",
    grade_divine: "Divino",
    grade_cosmic: "Cósmico",
    // Sockets labels
    decoration: "Soquete de Gema",
    engraving: "Soquete de Gravação",
    inscription: "Soquete de Inscrição",
  }
};

// Constants
const DECRYPTION_KEY = "emuMqG3bLYJ938ZDCfieWJ";

const GEAR_SLOTS = [
  { id: 0, label: "Weapon" },
  { id: 1, label: "Offhand" },
  { id: 2, label: "Helmet" },
  { id: 3, label: "Armor" },
  { id: 4, label: "Gloves" },
  { id: 5, label: "Boots" },
  { id: 6, label: "Pendant" },
  { id: 7, label: "Earring" },
  { id: 8, label: "Ring" },
  { id: 9, label: "Bracer" }
];

// Helper to absolute wiki image URL
function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return './' + cleanPath;
}

function normalizeStr(str) {
  if (!str) return '';
  return str.normalize("NFD").replace(/[̀-\u036f]/g, "").toLowerCase().trim();
}

// Start App
window.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  updateUILanguage();
  
  try {
    // Load wiki database
    const res = await fetch('./wiki_db.json');
    wiki_db = await res.json();
    
    // Parse database tables
    wiki_materials = wiki_db['/data/t/materials.json'] || [];
    wiki_stat_mod_groups = wiki_db['/data/t/stat_mod_groups.json'] || [];
    wiki_stat_mods = wiki_db['/data/t/stat_mods.json'] || [];
    wiki_stat_strings = wiki_db['/data/stat_strings.json'] || {};
    
    const itemsList = wiki_db['/data/items.json'] || [];
    for (const item of itemsList) {
      wiki_items[item.id] = item;
    }
    
    const detailsDict = wiki_db['/data/items_detail.json'] || {};
    for (const key in detailsDict) {
      wiki_items_detail[key] = detailsDict[key];
    }
    
    console.log("Database loaded successfully!");
  } catch (err) {
    console.error("Failed to load wiki database:", err);
    alert("Failed to load game database! Make sure the server is running.");
  }
});

// Update UI Translation based on activeLanguage
function updateUILanguage() {
  const lang = activeLanguage;
  const dict = TRANSLATIONS[lang];
  if (!dict) return;
  
  document.documentElement.lang = lang;
  
  // Translate elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      if (key === 'dropzoneDesc') {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });
  
  // Translate inputs with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });
}

// Setup event listeners
function setupEventListeners() {
  const fileInput = document.getElementById('save-file-input');
  const btnDemo = document.getElementById('btn-demo-load');
  const btnReset = document.getElementById('btn-reset-gear');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const dropzone = document.getElementById('upload-dropzone');
  const langSelect = document.getElementById('lang-select');
  const btnChangeItem = document.getElementById('btn-change-item');
  
  // Language Select
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      activeLanguage = e.target.value;
      updateUILanguage();
      calculateAndRender();
      if (selectedSlotIndex !== null) {
        selectSlot(selectedSlotIndex);
      }
    });
  }

  // Change Item
  if (btnChangeItem) {
    btnChangeItem.addEventListener('click', () => {
      showGearSelectionModal();
    });
  }
  
  // File picker selection
  fileInput.addEventListener('change', handleFileSelect);
  
  // Demo load click
  btnDemo.addEventListener('click', loadDemoSave);
  
  // Reset gear click
  btnReset.addEventListener('click', () => {
    if (!currentSave) return;
    simulatedSave = JSON.parse(JSON.stringify(currentSave));
    calculateAndRender();
    if (selectedSlotIndex !== null) {
      selectSlot(selectedSlotIndex);
    }
  });

  // Modal close
  btnCloseModal.addEventListener('click', hideModal);
  
  // Drag & drop handlers
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  
  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });
  
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  });

  // Gear slot click and hover delegation
  document.querySelectorAll('.gear-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      const idx = parseInt(slot.dataset.slot);
      selectSlot(idx);
    });
    slot.addEventListener('mouseenter', (e) => {
      const idx = parseInt(slot.dataset.slot);
      showGearTooltip(idx, e);
    });
    slot.addEventListener('mousemove', (e) => {
      moveGearTooltip(e);
    });
    slot.addEventListener('mouseleave', () => {
      hideGearTooltip();
    });
  });

  // Modal filter chips
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const type = chip.dataset.type;
      renderMaterialsGrid(type);
    });
  });

  // Modal search input event
  const searchInput = document.getElementById('modal-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      if (activeModalMode === 'gear') {
        renderGearGrid();
      } else {
        const activeChip = document.querySelector('.filter-chip.active');
        const activeType = activeChip ? activeChip.dataset.type : 'all';
        renderMaterialsGrid(activeType);
      }
    });
  }
}

// File Select handler
function handleFileSelect(e) {
  const files = e.target.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

// Read and decrypt save file
function processFile(file) {
  const reader = new FileReader();
  reader.onload = async (e) => {
    const arrayBuffer = e.target.result;
    try {
      const decryptedText = await decryptES3(arrayBuffer, DECRYPTION_KEY);
      const parsed = JSON.parse(decryptedText);
      const playerSaveVal = parsed.PlayerSaveData.value.replace(/(:\s*|\[\s*|,\s*)(\d{16,20})\b/g, '$1"$2"');
      const playerSave = JSON.parse(playerSaveVal);
      
      // Find Ranger (key 201)
      const ranger = playerSave.heroSaveDatas.find(h => h.heroKey === 201);
      if (!ranger) {
        alert("Ranger character (Key 201) not found in the save file!");
        return;
      }
      
      // Extract equipped items
      const uids = new Set(ranger.equippedItemIds.map(id => String(id)));
      const equippedItems = playerSave.itemSaveDatas.filter(item => uids.has(String(item.UniqueId)));
      
      // Extract Ranger attributes
      const rangerAttrs = playerSave.attributeSaveDatas.filter(attr => strStartsWith(attr.Key, '201'));
      
      // Extract rune levels (global, not per-hero)
      const runeSaveData = playerSave.RuneSaveData || [];
      
      // Extract gold
      const goldObj = playerSave.currenySaveDatas.find(c => c.Key === 100001);
      const gold = goldObj ? goldObj.Quantity : 0;
      
      currentSave = {
        ranger,
        equipped_items: equippedItems,
        attributes: rangerAttrs,
        runes: runeSaveData,
        gold
      };
      
      simulatedSave = JSON.parse(JSON.stringify(currentSave));
      
      // Hide upload zone and show dashboard
      document.getElementById('upload-dropzone').style.display = 'none';
      document.getElementById('dashboard').style.display = 'grid';
      
      calculateAndRender();
      console.log("Save loaded successfully!", currentSave);
    } catch (err) {
      console.error(err);
      alert("Failed to decrypt save file! Ensure it is a valid TaskbarHero SaveFile_Live.es3.");
    }
  };
  reader.readAsArrayBuffer(file);
}

// Load pre-extracted demo save
async function loadDemoSave() {
  try {
    const res = await fetch('./demo_save.json');
    const text = await res.text();
    const sanitizedText = text.replace(/(:\s*|\[\s*|,\s*)(\d{16,20})\b/g, '$1"$2"');
    const demo = JSON.parse(sanitizedText);
    
    currentSave = demo;
    simulatedSave = JSON.parse(JSON.stringify(currentSave));
    
    document.getElementById('upload-dropzone').style.display = 'none';
    document.getElementById('dashboard').style.display = 'grid';
    
    calculateAndRender();
    console.log("Demo save loaded successfully!", currentSave);
  } catch (err) {
    console.error("Failed to load demo save:", err);
    alert("Failed to load demo save file!");
  }
}

// Decrypt using Web Crypto API
async function decryptES3(arrayBuffer, password) {
  const data = new Uint8Array(arrayBuffer);
  const salt = data.subarray(0, 16);
  const ciphertext = data.subarray(16);

  const passwordBytes = new TextEncoder().encode(password);

  // Import key
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    passwordBytes,
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  // Derive AES key
  const aesKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100,
      hash: "SHA-1"
    },
    baseKey,
    {
      name: "AES-CBC",
      length: 128
    },
    false,
    ["decrypt"]
  );

  // Decrypt
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv: salt
    },
    aesKey,
    ciphertext
  );

  return new TextDecoder().decode(decryptedBuffer);
}

// Helper: Starts with string check
function strStartsWith(val, prefix) {
  return String(val).indexOf(prefix) === 0;
}

// Gear socket limits based on grade
function getSocketCapacity(grade) {
  const g = (grade || '').toUpperCase();
  if (wiki_db && wiki_db['/data/grades.json']) {
    const gradeInfo = wiki_db['/data/grades.json'].find(x => x.GRADE === g);
    if (gradeInfo) {
      return {
        decoration: gradeInfo.ExtraSlotAmount_Decoration || 0,
        engraving: gradeInfo.ExtraSlotAmount_Engraving || 0,
        inscription: gradeInfo.ExtraSlotAmount_Inscription || 0
      };
    }
  }
  
  // Fallback matching grades.json exactly
  const fallback = {
    COMMON: { decoration: 0, engraving: 0, inscription: 0 },
    UNCOMMON: { decoration: 0, engraving: 0, inscription: 0 },
    RARE: { decoration: 1, engraving: 0, inscription: 0 },
    LEGENDARY: { decoration: 2, engraving: 0, inscription: 0 },
    IMMORTAL: { decoration: 2, engraving: 1, inscription: 0 },
    ARCANA: { decoration: 2, engraving: 1, inscription: 1 },
    BEYOND: { decoration: 2, engraving: 2, inscription: 1 },
    CELESTIAL: { decoration: 2, engraving: 2, inscription: 2 },
    DIVINE: { decoration: 2, engraving: 2, inscription: 2 },
    COSMIC: { decoration: 2, engraving: 2, inscription: 2 }
  };
  
  return fallback[g] || { decoration: 0, engraving: 0, inscription: 0 };
}

// Maps sockets to indices in EnchantData
function getSocketMapping(grade) {
  const cap = getSocketCapacity(grade);
  const mapping = [];
  
  for (let i = 0; i < cap.decoration; i++) {
    mapping.push({ type: 'DECORATION', label: `Gem Socket #${i+1}`, index: i });
  }
  for (let i = 0; i < cap.engraving; i++) {
    mapping.push({ type: 'ENGRAVING', label: `Engraving Socket #${i+1}`, index: 2 + i });
  }
  for (let i = 0; i < cap.inscription; i++) {
    mapping.push({ type: 'INSCRIPTION', label: `Inscription Socket #${i+1}`, index: 4 + i });
  }
  
  return mapping;
}

// Maps gear types to WEAPON / ARMOR / ACCESSORY group
function getGearGroup(gearType) {
  const gt = (gearType || '').toUpperCase();
  if (['SWORD', 'BOW', 'STAFF', 'SCEPTER', 'CROSSBOW', 'AXE', 'SHIELD', 'ARROW', 'ORB', 'TOME', 'BOLT', 'HATCHET'].includes(gt)) {
    return 'WEAPON';
  }
  if (['HELMET', 'ARMOR', 'GLOVES', 'BOOTS'].includes(gt)) {
    return 'ARMOR';
  }
  if (['AMULET', 'EARING', 'RING', 'BRACER'].includes(gt)) {
    return 'ACCESSORY';
  }
  return 'COMMON';
}

// Select a gear slot for editor
function selectSlot(index) {
  selectedSlotIndex = index;
  const langKey = activeLanguage === 'pt' ? 'pt-BR' : 'en-US';
  
  // Highlight in UI
  document.querySelectorAll('.gear-slot').forEach(slot => slot.classList.remove('active'));
  document.getElementById(`slot-${index}`).classList.add('active');
  
  // Get slot uid
  const uid = simulatedSave.ranger.equippedItemIds[index];
  if (uid === 0 || uid === '0' || !uid) {
    document.getElementById('no-selection-msg').style.display = 'flex';
    document.getElementById('item-detail-view').style.display = 'none';
    return;
  }
  
  const item = simulatedSave.equipped_items.find(it => String(it.UniqueId) === String(uid));
  if (!item) return;
  
  const wItem = wiki_items[item.ItemKey];
  const wDetail = wiki_items_detail[item.ItemKey];
  
  const name = wItem ? (wItem.name[langKey] || wItem.name['en-US']) : `Unknown Item (${item.ItemKey})`;
  const grade = wItem ? wItem.grade : 'COMMON';
  const icon = wItem ? wItem.icon : '';
  
  // Update Sockets editor details header
  document.getElementById('no-selection-msg').style.display = 'none';
  const detailView = document.getElementById('item-detail-view');
  detailView.style.display = 'flex';
  
  // Update header class for border color
  const header = detailView.querySelector('.item-detail-header');
  header.className = `item-detail-header ${grade.toLowerCase()}`;
  
  document.getElementById('detail-item-name').innerText = name;
  const gradeLabel = TRANSLATIONS[activeLanguage][`grade_${grade.toLowerCase()}`] || grade;
  document.getElementById('detail-item-grade').innerText = gradeLabel;
  document.getElementById('detail-item-icon').src = getImageUrl(icon);
  
  // Render Item Stats list (Base and Inherent)
  const statsList = document.getElementById('detail-item-stats');
  statsList.innerHTML = '';
  
  if (wDetail && wDetail.stats) {
    const statsObj = wDetail.stats;
    
    // Base Stats
    const gearType = wItem.gear;
    const gearTypeInfo = (wiki_db['/data/gear_types.json'] || []).find(gt => gt.GearType === gearType);
    
    if (gearTypeInfo) {
      if (statsObj.BaseStat1_Value) {
        const statLabel = formatStatName(gearTypeInfo.BaseStat1_STATTYPE);
        const formatVal = formatStatValue(gearTypeInfo.BaseStat1_STATTYPE, statsObj.BaseStat1_Value, gearTypeInfo.BaseStat1_MODTYPE);
        statsList.innerHTML += `<li><span class="stat-label">Base ${statLabel}</span> <span>${formatVal}</span></li>`;
      }
      if (statsObj.BaseStat2_Value) {
        const statLabel = formatStatName(gearTypeInfo.BaseStat2_STATTYPE);
        const formatVal = formatStatValue(gearTypeInfo.BaseStat2_STATTYPE, statsObj.BaseStat2_Value, gearTypeInfo.BaseStat2_MODTYPE);
        statsList.innerHTML += `<li><span class="stat-label">Base ${statLabel}</span> <span>${formatVal}</span></li>`;
      }
    }
    
    // Inherent Stats
    for (let i = 1; i <= 3; i++) {
      const type = statsObj[`InherentStat${i}_STATTYPE`];
      const val = statsObj[`InherentStat${i}_Value`];
      const mod = statsObj[`InherentStat${i}_MODTYPE`];
      
      if (type && type !== 'NONE' && val) {
        const statLabel = formatStatName(type);
        const formatVal = formatStatValue(type, val, mod);
        statsList.innerHTML += `<li><span class="stat-label">${statLabel}</span> <span>${formatVal}</span></li>`;
      }
    }
  } else {
    statsList.innerHTML = `<li>${TRANSLATIONS[activeLanguage].noBaseStats}</li>`;
  }
  
  // Render Sockets Editor list
  const socketsList = document.getElementById('detail-sockets-list');
  socketsList.innerHTML = '';
  
  const socketsMapping = getSocketMapping(grade);
  if (socketsMapping.length === 0) {
    socketsList.innerHTML = `<div class="no-sockets-msg">${TRANSLATIONS[activeLanguage].noSockets}</div>`;
    return;
  }
  
  socketsMapping.forEach((sock) => {
    const enchant = item.EnchantData[sock.index] || { StatModKey: 0, MaterialKey: 0, Value: 0 };
    const hasGem = enchant.MaterialKey !== 0;
    
    let gemName = TRANSLATIONS[activeLanguage].emptySocket;
    let gemIcon = "";
    
    if (hasGem) {
      const gItem = wiki_items[enchant.MaterialKey];
      gemName = gItem ? (gItem.name[langKey] || gItem.name['en-US']) : `Material Key ${enchant.MaterialKey}`;
      gemIcon = gItem ? getImageUrl(gItem.icon) : '';
    }
    
    const sockItem = document.createElement('div');
    sockItem.className = 'socket-editor-item';
    
    const baseLabel = TRANSLATIONS[activeLanguage][sock.type.toLowerCase()] || sock.type;
    const subIdx = sock.type === 'DECORATION' ? (sock.index + 1) : 
                    sock.type === 'ENGRAVING' ? (sock.index - getSocketCapacity(grade).decoration + 1) :
                    (sock.index - getSocketCapacity(grade).decoration - getSocketCapacity(grade).engraving + 1);
    const socketLabel = `${baseLabel} #${subIdx}`;

    // Socket header
    let tooltipAttr = '';
    let statName = '';
    let displayVal = '';
    
    if (hasGem && enchant.StatModKey !== 0) {
      const modDef = wiki_stat_mods.find(m => m.StatModKey === enchant.StatModKey && m.Tier === enchant.Tier);
      if (modDef) {
        const statLabel = formatStatName(modDef.STATTYPE);
        displayVal = formatStatValue(modDef.STATTYPE, enchant.Value, modDef.MODTYPE);
        tooltipAttr = `title="${gemName}: ${statLabel} ${displayVal}"`;
        statName = statLabel;
      }
    }

    let innerHTML = `
      <div class="socket-row-top">
        <span class="socket-badge ${sock.type.toLowerCase()}">${socketLabel}</span>
        ${hasGem ? `<button class="btn-socket-clear" data-index="${sock.index}">&times; ${TRANSLATIONS[activeLanguage].clear}</button>` : ''}
      </div>
      <div class="socket-controls">
        <button class="socket-btn-select" data-index="${sock.index}" data-type="${sock.type}" ${tooltipAttr}>
          ${gemIcon ? `<img class="socket-gem-icon" src="${gemIcon}" alt="" />` : '⚪'}
          <span>${gemName}</span>
        </button>
      </div>
    `;
    
    // Slider if gem is socketed
    if (hasGem && enchant.StatModKey !== 0) {
      // Find range
      const modDef = wiki_stat_mods.find(m => m.StatModKey === enchant.StatModKey && m.Tier === enchant.Tier);
      if (modDef) {
        const min = modDef.MinValue;
        const max = modDef.MaxValue;
        const interval = modDef.Interval || 1;
        const val = enchant.Value;
        
        const labelRolled = activeLanguage === 'pt' ? 'Rolado' : 'Rolled';
        const labelRange = activeLanguage === 'pt' ? 'Intervalo' : 'Range';
        
        innerHTML += `
          <div class="socket-slider-container">
            <div class="socket-slider-label">
              <span><strong>${statName}</strong> (${labelRolled}: <strong class="roll-value">${displayVal}</strong>)</span>
              <span>${labelRange}: ${formatStatValue(modDef.STATTYPE, min, modDef.MODTYPE)} - ${formatStatValue(modDef.STATTYPE, max, modDef.MODTYPE)}</span>
            </div>
            <input type="range" class="socket-slider" 
              data-index="${sock.index}"
              data-modkey="${enchant.StatModKey}"
              data-tier="${enchant.Tier}"
              min="${min}" 
              max="${max}" 
              step="${interval}" 
              value="${val}" />
          </div>
        `;
      }
    }
    
    sockItem.innerHTML = innerHTML;
    socketsList.appendChild(sockItem);
  });
  
  // Wire up socket buttons
  socketsList.querySelectorAll('.socket-btn-select').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      const type = btn.dataset.type;
      showModal(idx, type);
    });
  });
  
  socketsList.querySelectorAll('.btn-socket-clear').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      clearSocket(idx);
    });
  });
  
  socketsList.querySelectorAll('.socket-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const idx = parseInt(slider.dataset.index);
      const val = parseInt(e.target.value);
      updateSocketValue(idx, val);
    });
  });
}

// Show selection modal
function showModal(socketIndex, socketType) {
  activeModalMode = 'material';
  activeModalSocketIndex = socketIndex;
  
  const filtersEl = document.querySelector('.modal-filters');
  if (filtersEl) {
    filtersEl.style.display = 'flex';
  }
  
  // Set filter chip active
  document.querySelectorAll('.filter-chip').forEach(c => {
    if (c.dataset.type === socketType) {
      c.classList.add('active');
    } else {
      c.classList.remove('active');
    }
  });
  
  document.getElementById('modal-title').innerText = `${TRANSLATIONS[activeLanguage].selectMaterialTitle || "Select Socket Material"} (${socketType})`;
  
  // Clear search box on open
  const searchInput = document.getElementById('modal-search-input');
  if (searchInput) {
    searchInput.value = '';
    searchInput.placeholder = TRANSLATIONS[activeLanguage].modalSearchPlaceholder || "Search material by name...";
  }

  document.getElementById('socket-modal').style.display = 'flex';
  
  renderMaterialsGrid(socketType);
}

function hideModal() {
  document.getElementById('socket-modal').style.display = 'none';
  activeModalSocketIndex = null;
}

// Show gear selection modal
function showGearSelectionModal() {
  if (selectedSlotIndex === null) return;
  activeModalMode = 'gear';
  
  const filtersEl = document.querySelector('.modal-filters');
  if (filtersEl) {
    filtersEl.style.display = 'none';
  }
  
  document.getElementById('modal-title').innerText = TRANSLATIONS[activeLanguage].selectGearTitle || "Select Gear to Equip";
  
  const searchInput = document.getElementById('modal-search-input');
  if (searchInput) {
    searchInput.value = '';
    searchInput.placeholder = TRANSLATIONS[activeLanguage].modalSearchGearPlaceholder || "Search gear by name...";
  }
  
  document.getElementById('socket-modal').style.display = 'flex';
  renderGearGrid();
}

// Render gear items in modal
function renderGearGrid() {
  const grid = document.getElementById('materials-grid');
  grid.innerHTML = '';
  
  const slotGearType = SLOT_GEAR_TYPES[selectedSlotIndex];
  if (!slotGearType) return;
  
  const searchQuery = normalizeStr(document.getElementById('modal-search-input')?.value || '');
  const langKey = activeLanguage === 'pt' ? 'pt-BR' : 'en-US';
  
  // 1. Render Unequip option
  const unequipCard = document.createElement('div');
  unequipCard.className = 'material-card common';
  unequipCard.addEventListener('click', () => equipGearForActiveSlot(null));
  unequipCard.innerHTML = `
    <div class="mat-icon-container" style="font-size: 24px; display: flex; align-items: center; justify-content: center; height: 40px; margin-bottom: 8px;">
      ❌
    </div>
    <span class="mat-name">${activeLanguage === 'pt' ? 'Desequipar' : 'Unequip'}</span>
    <span class="mat-type" style="margin-top: 4px;">EMPTY</span>
  `;
  grid.appendChild(unequipCard);
  
  // 2. Filter items list
  const gearItems = (wiki_db['/data/items.json'] || []).filter(item => {
    if (item.type !== 'GEAR') return false;
    if (item.gear !== slotGearType) return false;
    
    if (searchQuery) {
      const name = normalizeStr(item.name[langKey] || item.name['en-US'] || '');
      if (!name.includes(searchQuery)) return false;
    }
    return true;
  });
  
  // Sort gear items by level descending, then by grade
  gearItems.sort((a, b) => {
    const levelA = a.level || 0;
    const levelB = b.level || 0;
    if (levelA !== levelB) return levelB - levelA;
    const nameA = a.name[langKey] || a.name['en-US'] || '';
    const nameB = b.name[langKey] || b.name['en-US'] || '';
    return nameA.localeCompare(nameB);
  });
  
  // 3. Render cards
  gearItems.forEach(item => {
    const card = document.createElement('div');
    const gradeClass = (item.grade || 'common').toLowerCase();
    card.className = `material-card ${gradeClass}`;
    card.addEventListener('click', () => equipGearForActiveSlot(item));
    
    const name = item.name[langKey] || item.name['en-US'];
    const gradeLabel = TRANSLATIONS[activeLanguage][`grade_${gradeClass}`] || item.grade;
    
    card.innerHTML = `
      <div class="mat-icon-container">
        <img class="mat-icon" src="${getImageUrl(item.icon)}" alt="" style="image-rendering: pixelated;" />
      </div>
      <span class="mat-name">${name}</span>
      <span class="mat-type" style="color: var(--rarity-${gradeClass}); margin-top: 4px;">Lvl ${item.level || 1} ${gradeLabel}</span>
    `;
    grid.appendChild(card);
  });
}

// Equip selected gear
function equipGearForActiveSlot(item) {
  if (selectedSlotIndex === null) return;
  
  if (!item) {
    simulatedSave.ranger.equippedItemIds[selectedSlotIndex] = 0;
  } else {
    const simulatedUniqueId = String(Date.now() + Math.floor(Math.random() * 1000000));
    
    const newGear = {
      ItemKey: item.id,
      UniqueId: simulatedUniqueId,
      IsChaotic: false,
      IsBlocked: true,
      IsServerPendingItem: false,
      EnchantCount: [0, 0, 0],
      EnchantData: Array.from({ length: 6 }, () => ({
        StatModKey: 0,
        Tier: 0,
        Value: 0,
        RecipeType: 0,
        ModType: 0,
        MaterialKey: 0,
        StatType: 0
      })),
      DecorationAppliedTotalCount: 0,
      EngravingAppliedTotalCount: 0,
      InscriptionAppliedTotalCount: 0
    };
    
    simulatedSave.equipped_items.push(newGear);
    simulatedSave.ranger.equippedItemIds[selectedSlotIndex] = simulatedUniqueId;
  }
  
  hideModal();
  calculateAndRender();
  selectSlot(selectedSlotIndex);
}

// Render materials in modal
function renderMaterialsGrid(typeFilter) {
  const grid = document.getElementById('materials-grid');
  grid.innerHTML = '';
  
  const searchQuery = normalizeStr(document.getElementById('modal-search-input')?.value || '');
  const langKey = activeLanguage === 'pt' ? 'pt-BR' : 'en-US';
  
  const filtered = wiki_materials.filter(m => {
    if (typeFilter !== 'all' && m.MATERIALTYPE !== typeFilter) return false;
    if (!['DECORATION', 'ENGRAVING', 'INSCRIPTION'].includes(m.MATERIALTYPE)) return false;
    
    if (searchQuery) {
      const item = wiki_items[m.ItemKey];
      const name = item ? normalizeStr(item.name[langKey] || item.name['en-US'] || '') : '';
      
      // Match by material name
      if (name.includes(searchQuery)) return true;
      
      // Match by possible socketed attributes in currently selected gear slot
      if (selectedSlotIndex !== null) {
        const equippedUid = simulatedSave.ranger.equippedItemIds[selectedSlotIndex];
        const equippedItem = simulatedSave.equipped_items.find(it => String(it.UniqueId) === String(equippedUid));
        if (equippedItem) {
          const wEquipped = wiki_items[equippedItem.ItemKey];
          const gearGroup = getGearGroup(wEquipped ? wEquipped.gear : '');
          const possibleStats = getPossibleStats(m.ItemKey, gearGroup);
          
          const hasMatchingStat = possibleStats.some(st => {
            const statName = normalizeStr(formatStatName(st.STATTYPE));
            return statName.includes(searchQuery);
          });
          
          if (hasMatchingStat) return true;
        }
      }
      
      return false;
    }
    
    return true;
  });
  
  let gearGroup = '';
  if (selectedSlotIndex !== null) {
    const equippedUid = simulatedSave.ranger.equippedItemIds[selectedSlotIndex];
    const equippedItem = simulatedSave.equipped_items.find(it => String(it.UniqueId) === String(equippedUid));
    if (equippedItem) {
      const wEquipped = wiki_items[equippedItem.ItemKey];
      gearGroup = getGearGroup(wEquipped ? wEquipped.gear : '');
    }
  }

  filtered.forEach(mat => {
    const item = wiki_items[mat.ItemKey];
    if (!item) return;
    
    const card = document.createElement('div');
    const gradeClass = (item.grade || 'common').toLowerCase();
    card.className = `material-card ${gradeClass}`;
    card.addEventListener('click', () => selectMaterialForActiveSocket(mat.ItemKey));
    
    const name = item.name[langKey] || item.name['en-US'];
    const typeLabel = TRANSLATIONS[activeLanguage][mat.MATERIALTYPE] || mat.MATERIALTYPE;
    
    const possibleStats = getPossibleStats(mat.ItemKey, gearGroup);
    const descLines = possibleStats.map(st => {
      const statName = formatStatName(st.STATTYPE);
      const minVal = formatStatValue(st.STATTYPE, st.MinValue, st.MODTYPE);
      const maxVal = formatStatValue(st.STATTYPE, st.MaxValue, st.MODTYPE);
      return `${statName} (${minVal} ~ ${maxVal})`;
    });

    const descHtml = descLines.length > 0 
      ? descLines.map(line => `<span class="mat-desc">${line}</span>`).join('') 
      : '';
    const descTitle = descLines.length > 0 ? descLines.join('\n') : '';

    card.setAttribute('title', descTitle ? `${name}\n${descTitle}` : name);

    card.innerHTML = `
      <div class="mat-icon-container">
        <img class="mat-icon" src="${getImageUrl(item.icon)}" alt="" style="image-rendering: pixelated;" />
      </div>
      <span class="mat-name">${name}</span>
      ${descHtml}
      <span class="mat-type">${typeLabel}</span>
    `;
    
    grid.appendChild(card);
  });
}

// Select a gem from modal
function selectMaterialForActiveSocket(materialKey) {
  if (activeModalSocketIndex === null || selectedSlotIndex === null) return;
  
  const uid = simulatedSave.ranger.equippedItemIds[selectedSlotIndex];
  const item = simulatedSave.equipped_items.find(it => String(it.UniqueId) === String(uid));
  if (!item) return;
  
  const wItem = wiki_items[item.ItemKey];
  const gearGroup = getGearGroup(wItem ? wItem.gear : '');
  
  // Look up available stats for this material in the item's gear group
  const possibleStats = getPossibleStats(materialKey, gearGroup);
  if (possibleStats.length === 0) {
    alert(activeLanguage === 'pt' ? "Este material não pode ser engastado neste tipo de equipamento!" : "This material cannot be socketed in this type of equipment!");
    return;
  }
  
  let selectedStat = possibleStats[0];
  
  if (possibleStats.length > 1) {
    const optionsText = possibleStats.map((st, i) => `${i + 1}. ${formatStatName(st.STATTYPE)} (${st.MODTYPE === 'FLAT' ? (activeLanguage === 'pt' ? 'Plano' : 'Flat') : (activeLanguage === 'pt' ? 'Percentual' : 'Additive')})`).join('\n');
    
    const promptTitle = activeLanguage === 'pt' 
      ? `Selecione a modificação de atributo que deseja aplicar:

${optionsText}

Digite o número (1-${possibleStats.length}):`
      : `Select the stat modification you want to apply:

${optionsText}

Enter number (1-${possibleStats.length}):`;
      
    const choice = prompt(promptTitle, "1");
    const choiceIdx = parseInt(choice) - 1;
    if (choiceIdx >= 0 && choiceIdx < possibleStats.length) {
      selectedStat = possibleStats[choiceIdx];
    }
  }
  
  // Socket the material
  const mappedSockets = getSocketMapping(wItem.grade);
  const currentSocketType = mappedSockets.find(s => s.index === activeModalSocketIndex).type;
  
  let recipeType = 3; // Decoration
  if (currentSocketType === 'ENGRAVING') recipeType = 4;
  if (currentSocketType === 'INSCRIPTION') recipeType = 5;
  
  // Find stat type int
  const statTypeEnum = getStatTypeInt(selectedStat.STATTYPE);
  const modTypeEnum = selectedStat.MODTYPE === 'FLAT' ? 0 : 1;
  
  // Value defaults to average
  const avgVal = Math.round((selectedStat.MinValue + selectedStat.MaxValue) / 2);
  
  item.EnchantData[activeModalSocketIndex] = {
    StatModKey: selectedStat.StatModKey,
    Tier: selectedStat.Tier,
    Value: avgVal,
    RecipeType: recipeType,
    ModType: modTypeEnum,
    MaterialKey: materialKey,
    StatType: statTypeEnum
  };
  
  hideModal();
  calculateAndRender();
  selectSlot(selectedSlotIndex); // Refresh Sockets list
}

// Clear socket
function clearSocket(socketIndex) {
  if (selectedSlotIndex === null) return;
  
  const uid = simulatedSave.ranger.equippedItemIds[selectedSlotIndex];
  const item = simulatedSave.equipped_items.find(it => String(it.UniqueId) === String(uid));
  if (!item) return;
  
  item.EnchantData[socketIndex] = {
    StatModKey: 0,
    Tier: 0,
    Value: 0,
    RecipeType: 0,
    ModType: 0,
    MaterialKey: 0,
    StatType: 0
  };
  
  calculateAndRender();
  selectSlot(selectedSlotIndex); // Refresh list
}

// Update socket roll value
function updateSocketValue(socketIndex, newValue) {
  if (selectedSlotIndex === null) return;
  
  const uid = simulatedSave.ranger.equippedItemIds[selectedSlotIndex];
  const item = simulatedSave.equipped_items.find(it => String(it.UniqueId) === String(uid));
  if (!item) return;
  
  item.EnchantData[socketIndex].Value = newValue;
  
  calculateAndRender();
  
  // Update text label on slider without complete list rebuild to avoid layout jump
  const slider = document.querySelector(`.socket-slider[data-index="${socketIndex}"]`);
  if (slider) {
    const label = slider.parentElement.querySelector('.roll-value');
    if (label) {
      const modKey = parseInt(slider.dataset.modkey);
      const tier = parseInt(slider.dataset.tier);
      const modDef = wiki_stat_mods.find(m => m.StatModKey === modKey && m.Tier === tier);
      if (modDef) {
        label.innerText = formatStatValue(modDef.STATTYPE, newValue, modDef.MODTYPE);
        
        // Also update title attribute of button
        const selectBtn = slider.parentElement.parentElement.querySelector('.socket-btn-select');
        if (selectBtn) {
          const statLabel = formatStatName(modDef.STATTYPE);
          const displayVal = formatStatValue(modDef.STATTYPE, newValue, modDef.MODTYPE);
          const gemSpan = selectBtn.querySelector('span');
          const gemName = gemSpan ? gemSpan.innerText : '';
          selectBtn.setAttribute('title', `${gemName}: ${statLabel} ${displayVal}`);
        }
      }
    }
  }
}

// Get possible stats from database for a material
function getPossibleStats(materialKey, gearGroup) {
  const mat = wiki_materials.find(m => m.ItemKey === materialKey);
  if (!mat) return [];
  const groupKey = mat.StatModGroupKey;
  const groupEntries = wiki_stat_mod_groups.filter(g => g.StatModGroupKey === groupKey && g.GearGroup === gearGroup);
  
  const results = [];
  for (const entry of groupEntries) {
    const modKey = entry.StatModKey;
    const tier = entry.MaxTier;
    const modDefs = wiki_stat_mods.filter(m => m.StatModKey === modKey && m.Tier === tier);
    for (const def of modDefs) {
      results.push({
        StatModKey: def.StatModKey,
        Tier: def.Tier,
        STATTYPE: def.STATTYPE,
        MODTYPE: def.MODTYPE,
        MinValue: def.MinValue,
        MaxValue: def.MaxValue,
        Interval: def.Interval
      });
    }
  }
  return results;
}

// Formatting stat helpers
function formatStatName(type) {
  const info = wiki_stat_strings[type];
  const langKey = activeLanguage === 'pt' ? 'pt-BR' : 'en-US';
  if (info) {
    if (info.name && info.name[langKey]) {
      return info.name[langKey];
    }
    if (info.line && info.line[langKey]) {
      return info.line[langKey].replace(/\s*\+?\s*\{\d+\}\%?/, '').trim();
    }
    if (info.name && info.name['en-US']) {
      return info.name['en-US'];
    }
    if (info.line && info.line['en-US']) {
      return info.line['en-US'].replace(/\s*\+?\s*\{\d+\}\%?/, '').trim();
    }
  }
  // fallback word split
  return type.replace(/([A-Z])/g, ' $1').trim();
}

function formatStatValue(type, val, modType) {
  const info = wiki_stat_strings[type];
  const isPercent = type.endsWith('Percent') || 
                    type.indexOf('Chance') !== -1 || 
                    type.indexOf('Speed') !== -1 || 
                    type.indexOf('Leech') !== -1 || 
                    type.indexOf('Reduction') !== -1 ||
                    type.indexOf('Resistance') !== -1 ||
                    type.indexOf('Expansion') !== -1 ||
                    modType === 'ADDITIVE';
  
  if (isPercent) {
    const percentVal = (val / 10).toFixed(1).replace('.0', '');
    return `+${percentVal}%`;
  }
  
  return `+${val}`;
}

// Map string stat types to standard integers in save format
function getStatTypeInt(statType) {
  const mapping = {
    AttackDamage: 1,
    AttackSpeed: 2,
    CastSpeed: 3,
    CriticalChance: 4,
    CriticalDamage: 5,
    MaxHp: 6,
    Armor: 7,
    MovementSpeed: 10,
    HpLeech: 58,
    // Add other keys as needed
  };
  return mapping[statType] || 0;
}

function getStatTypeString(typeInt) {
  const mapping = {
    1: 'AttackDamage',
    2: 'AttackSpeed',
    3: 'CastSpeed',
    4: 'CriticalChance',
    5: 'CriticalDamage',
    6: 'MaxHp',
    7: 'Armor',
    10: 'MovementSpeed',
    58: 'HpLeech'
  };
  return mapping[typeInt] || 'NONE';
}

// Calculate and Render Dashboard
function calculateAndRender() {
  if (!currentSave || !simulatedSave) return;
  const langKey = activeLanguage === 'pt' ? 'pt-BR' : 'en-US';
  
  // 1. Render currencies
  document.getElementById('currency-gold').innerText = simulatedSave.gold.toLocaleString();
  
  // 2. Render gear slots
  GEAR_SLOTS.forEach(slotInfo => {
    const uid = simulatedSave.ranger.equippedItemIds[slotInfo.id];
    const slotEl = document.getElementById(`slot-${slotInfo.id}`);
    
    // Reset classes except standard ones
    slotEl.className = 'gear-slot';
    
    const imgEl = slotEl.querySelector('.slot-icon');
    const nameEl = slotEl.querySelector('.slot-item-name');
    const dotsEl = slotEl.querySelector('.slot-socket-dots');
    const typeLabelEl = slotEl.querySelector('.slot-type-label');
    
    dotsEl.innerHTML = '';
    
    // Translate slot type labels
    if (typeLabelEl) {
      typeLabelEl.innerText = TRANSLATIONS[activeLanguage][`slot_${slotInfo.id}`] || slotInfo.label;
    }
    
    if (uid === 0 || uid === '0' || !uid) {
      imgEl.src = '';
      imgEl.style.display = 'none';
      nameEl.innerText = activeLanguage === 'pt' ? 'Vazio' : 'Empty';
      return;
    }
    
    const item = simulatedSave.equipped_items.find(it => String(it.UniqueId) === String(uid));
    if (!item) return;
    
    const wItem = wiki_items[item.ItemKey];
    const name = wItem ? (wItem.name[langKey] || wItem.name['en-US']) : `Unknown Item (${item.ItemKey})`;
    const grade = wItem ? wItem.grade : 'COMMON';
    const icon = wItem ? wItem.icon : '';
    
    slotEl.classList.add(grade.toLowerCase());
    if (slotInfo.id === selectedSlotIndex) {
      slotEl.classList.add('active');
    }
    
    imgEl.src = getImageUrl(icon);
    imgEl.style.display = 'block';
    nameEl.innerText = name;
    
    // Render socket dots
    const capacity = getSocketCapacity(grade);
    const totalSockets = capacity.decoration + capacity.engraving + capacity.inscription;
    
    for (let s = 0; s < totalSockets; s++) {
      const dot = document.createElement('span');
      dot.className = 'socket-dot';
      
      const enchant = item.EnchantData[s];
      if (enchant && enchant.MaterialKey !== 0) {
        dot.classList.add('filled');
      }
      dotsEl.appendChild(dot);
    }
  });

  // 3. Stats Engine Calculations
  const origStats = calculateFinalStats(currentSave);
  const simStats = calculateFinalStats(simulatedSave);
  
  // Render stats list
  const container = document.getElementById('stats-list-container');
  container.innerHTML = '';
  
  const statsKeys = [
    { key: 'AttackDamage', label: TRANSLATIONS[activeLanguage].stats_AttackDamage || 'Attack Damage', isPercent: false },
    { key: 'BasicAttackDPS', label: TRANSLATIONS[activeLanguage].stats_BasicAttackDPS || 'Basic Attack DPS', isPercent: false },
    { key: 'AttackSpeed', label: TRANSLATIONS[activeLanguage].stats_AttackSpeed || 'Attack Speed', isPercent: true },
    { key: 'CastSpeed', label: TRANSLATIONS[activeLanguage].stats_CastSpeed || 'Cast Speed', isPercent: true },
    { key: 'CriticalChance', label: TRANSLATIONS[activeLanguage].stats_CriticalChance || 'Critical Chance', isPercent: true },
    { key: 'CriticalDamage', label: TRANSLATIONS[activeLanguage].stats_CriticalDamage || 'Critical Damage', isPercent: true },
    { key: 'MaxHp', label: TRANSLATIONS[activeLanguage].stats_MaxHp || 'Max HP', isPercent: false },
    { key: 'Armor', label: TRANSLATIONS[activeLanguage].stats_Armor || 'Armor', isPercent: false },
    { key: 'CooldownReduction', label: TRANSLATIONS[activeLanguage].stats_CooldownReduction || 'Cooldown Reduction', isPercent: true },
    { key: 'MovementSpeed', label: TRANSLATIONS[activeLanguage].stats_MovementSpeed || 'Movement Speed', isPercent: false }
  ];
  
  statsKeys.forEach(stat => {
    const oVal = origStats[stat.key];
    const sVal = simStats[stat.key];
    
    let displayOrig = formatCalcValue(oVal, stat.isPercent);
    let displaySim = formatCalcValue(sVal, stat.isPercent);
    
    const isIncreased = sVal > oVal;
    const isDecreased = sVal < oVal;
    
    let rowClass = 'stat-row';
    if (isIncreased) rowClass += ' increased';
    if (isDecreased) rowClass += ' decreased';
    
    container.innerHTML += `
      <div class="${rowClass}">
        <span>${stat.label}</span>
        <span class="text-right original-val">${displayOrig}</span>
        <span class="text-right simulated-val">${displaySim}</span>
      </div>
    `;
  });
  
  // Render Detailed Stats list
  const detailedContainer = document.getElementById('detailed-stats-list-container');
  detailedContainer.innerHTML = '';

  const detailedStatsKeys = [
    { key: 'HpLeech', label: TRANSLATIONS[activeLanguage].stats_HpLeech || 'Life Leech', isPercent: true },
    { key: 'HpRegenPerSec', label: TRANSLATIONS[activeLanguage].stats_HpRegenPerSec || 'HP Regen/Sec', isPercent: false },
    { key: 'AddHpPerHit', label: TRANSLATIONS[activeLanguage].stats_AddHpPerHit || 'HP per Hit', isPercent: false },
    { key: 'AddHpPerKill', label: TRANSLATIONS[activeLanguage].stats_AddHpPerKill || 'HP per Kill', isPercent: false },
    { key: 'IncreaseProjectileDamage', label: TRANSLATIONS[activeLanguage].stats_IncreaseProjectileDamage || 'Projectile Damage', isPercent: true },
    { key: 'IncreaseAreaOfEffectDamage', label: TRANSLATIONS[activeLanguage].stats_IncreaseAreaOfEffectDamage || 'AoE Damage', isPercent: true },
    { key: 'PhysicalDamagePercent', label: TRANSLATIONS[activeLanguage].stats_PhysicalDamagePercent || 'Physical Damage', isPercent: true },
    { key: 'FireDamagePercent', label: TRANSLATIONS[activeLanguage].stats_FireDamagePercent || 'Fire Damage', isPercent: true },
    { key: 'ColdDamagePercent', label: TRANSLATIONS[activeLanguage].stats_ColdDamagePercent || 'Cold Damage', isPercent: true },
    { key: 'LightningDamagePercent', label: TRANSLATIONS[activeLanguage].stats_LightningDamagePercent || 'Lightning Damage', isPercent: true },
    { key: 'ChaosDamagePercent', label: TRANSLATIONS[activeLanguage].stats_ChaosDamagePercent || 'Chaos Damage', isPercent: true },
    { key: 'DodgeChance', label: TRANSLATIONS[activeLanguage].stats_DodgeChance || 'Dodge Chance', isPercent: true },
    { key: 'ElementalDodgeChance', label: TRANSLATIONS[activeLanguage].stats_ElementalDodgeChance || 'Elemental Dodge', isPercent: true },
    { key: 'BlockChance', label: TRANSLATIONS[activeLanguage].stats_BlockChance || 'Block Chance', isPercent: true },
    { key: 'ElementalBlockChance', label: TRANSLATIONS[activeLanguage].stats_ElementalBlockChance || 'Elemental Block', isPercent: true },
    { key: 'FireResistance', label: TRANSLATIONS[activeLanguage].stats_FireResistance || 'Fire Resistance', isPercent: false },
    { key: 'ColdResistance', label: TRANSLATIONS[activeLanguage].stats_ColdResistance || 'Cold Resistance', isPercent: false },
    { key: 'LightningResistance', label: TRANSLATIONS[activeLanguage].stats_LightningResistance || 'Lightning Resistance', isPercent: false },
    { key: 'ChaosResistance', label: TRANSLATIONS[activeLanguage].stats_ChaosResistance || 'Chaos Resistance', isPercent: false },
    { key: 'DamageReduction', label: TRANSLATIONS[activeLanguage].stats_DamageReduction || 'Damage Reduction', isPercent: true },
    { key: 'AdditionalGold', label: TRANSLATIONS[activeLanguage].stats_AdditionalGold || 'Additional Gold', isPercent: true },
    { key: 'AdditionalExp', label: TRANSLATIONS[activeLanguage].stats_AdditionalExp || 'Additional Exp', isPercent: true }
  ];

  detailedStatsKeys.forEach(stat => {
    const oVal = origStats[stat.key];
    const sVal = simStats[stat.key];
    
    let displayOrig = formatCalcValue(oVal, stat.isPercent);
    let displaySim = formatCalcValue(sVal, stat.isPercent);
    
    const isIncreased = sVal > oVal;
    const isDecreased = sVal < oVal;
    
    let rowClass = 'stat-row';
    if (isIncreased) rowClass += ' increased';
    if (isDecreased) rowClass += ' decreased';
    
    detailedContainer.innerHTML += `
      <div class="${rowClass}">
        <span>${stat.label}</span>
        <span class="text-right original-val">${displayOrig}</span>
        <span class="text-right simulated-val">${displaySim}</span>
      </div>
    `;
  });
}

function formatCalcValue(val, isPercent) {
  if (val === undefined || val === null || isNaN(val)) {
    return '0';
  }
  if (isPercent) {
    return `${val.toFixed(1).replace('.0', '')}%`;
  }
  return Math.round(val).toLocaleString();
}

// Core Stat Calculator Engine
function calculateFinalStats(saveState) {
  const ranger = saveState.ranger;
  const heroInfo = wiki_db && wiki_db['/data/heroes.json'] 
    ? wiki_db['/data/heroes.json'].find(h => h.HeroKey === ranger.heroKey) 
    : null;
  
  // Initialize Stats Map
  // values are stored in standard units: percentages are stored as values * 10 (e.g. 10% = 100).
  const rawStats = {
    AttackDamage: { flat: heroInfo ? heroInfo.AttackDamage : 0, additive: 0 },
    AttackSpeed: { flat: heroInfo ? heroInfo.AttackSpeed : 0, additive: 0 },
    CastSpeed: { flat: heroInfo ? heroInfo.CastSpeed : 0, additive: 0 },
    CriticalChance: { flat: heroInfo ? heroInfo.CriticalChance : 0, additive: 0 },
    CriticalDamage: { flat: heroInfo ? heroInfo.CriticalDamage : 0, additive: 0 },
    MaxHp: { flat: heroInfo ? heroInfo.MaxHp : 0, additive: 0 },
    Armor: { flat: heroInfo ? heroInfo.Armor : 0, additive: 0 },
    CooldownReduction: { flat: heroInfo ? heroInfo.CooldownReduction : 0, additive: 0 },
    MovementSpeed: { flat: heroInfo ? heroInfo.MovementSpeed : 0, additive: 0 },
    HpLeech: { flat: 0, additive: 0 },
    IncreaseProjectileDamage: { flat: 0, additive: 0 },
    IncreaseAreaOfEffectDamage: { flat: 0, additive: 0 },
    
    // Detailed stats
    // Note: PhysicalDamagePercent and elemental damage use FLAT modtype in the wiki
    // so we accumulate both flat and additive and sum them together
    PhysicalDamagePercent: { flat: 0, additive: 0 },
    FireDamagePercent: { flat: 0, additive: 0 },
    ColdDamagePercent: { flat: 0, additive: 0 },
    LightningDamagePercent: { flat: 0, additive: 0 },
    ChaosDamagePercent: { flat: 0, additive: 0 },
    HpRegenPerSec: { flat: 0, additive: 0 },
    AddHpPerHit: { flat: 0, additive: 0 },
    AddHpPerKill: { flat: 0, additive: 0 },
    DodgeChance: { flat: 0, additive: 0 },
    ElementalDodgeChance: { flat: 0, additive: 0 },
    BlockChance: { flat: 0, additive: 0 },
    ElementalBlockChance: { flat: 0, additive: 0 },
    FireResistance: { flat: 0, additive: 0 },
    ColdResistance: { flat: 0, additive: 0 },
    LightningResistance: { flat: 0, additive: 0 },
    ChaosResistance: { flat: 0, additive: 0 },
    DamageReduction: { flat: 0, additive: 0 },
    AdditionalGold: { flat: 0, additive: 0 },
    AdditionalExp: { flat: 0, additive: 0 }
  };
  
  // 1. Process equipped gear items
  saveState.equipped_items.forEach(item => {
    // Make sure we only process items currently mapped in Ranger's equipped slots
    const isEquipped = saveState.ranger.equippedItemIds.some(id => String(id) === String(item.UniqueId));
    if (!isEquipped) return;

    const wItem = wiki_items[item.ItemKey];
    const wDetail = wiki_items_detail[item.ItemKey];
    if (!wItem || !wDetail || !wDetail.stats) return;
    
    const statsObj = wDetail.stats;
    const gearType = wItem.gear;
    const gearTypeInfo = (wiki_db['/data/gear_types.json'] || []).find(gt => gt.GearType === gearType);
    
    // Add BaseStats
    if (gearTypeInfo) {
      if (statsObj.BaseStat1_Value) {
        addStatValue(rawStats, gearTypeInfo.BaseStat1_STATTYPE, statsObj.BaseStat1_Value, gearTypeInfo.BaseStat1_MODTYPE);
      }
      if (statsObj.BaseStat2_Value) {
        addStatValue(rawStats, gearTypeInfo.BaseStat2_STATTYPE, statsObj.BaseStat2_Value, gearTypeInfo.BaseStat2_MODTYPE);
      }
    }
    
    // Add InherentStats
    for (let i = 1; i <= 3; i++) {
      const type = statsObj[`InherentStat${i}_STATTYPE`];
      const val = statsObj[`InherentStat${i}_Value`];
      const mod = statsObj[`InherentStat${i}_MODTYPE`];
      
      if (type && type !== 'NONE' && val) {
        addStatValue(rawStats, type, val, mod);
      }
    }
    
    // Add Sockets EnchantData
    item.EnchantData.forEach(enchant => {
      if (enchant.StatModKey === 0 || enchant.MaterialKey === 0) return;
      
      // Look up mod type
      const modDef = wiki_stat_mods.find(m => m.StatModKey === enchant.StatModKey && m.Tier === enchant.Tier);
      if (!modDef) return;
      
      addStatValue(rawStats, modDef.STATTYPE, enchant.Value, modDef.MODTYPE);
    });
  });
  
  // 2. Process passive attributes levels
  saveState.attributes.forEach(attr => {
    const heroInfo = wiki_db['/data/heroes.json'].find(h => h.HeroKey === 201);
    const attrInfo = heroInfo ? heroInfo.attributes.find(a => a.key === attr.Key) : null;
    
    if (attrInfo && attrInfo.type === 'PASSIVESKILL' && attr.Level > 0) {
      const pass = attrInfo.passive;
      const val = parseInt(pass.value.replace('+', '').replace('-', ''));
      const totalVal = val * attr.Level;
      
      const isPercent = pass.stat.endsWith('Percent') || 
                        pass.stat.indexOf('Chance') !== -1 || 
                        pass.stat.indexOf('Speed') !== -1 || 
                        pass.stat.indexOf('Leech') !== -1 || 
                        pass.stat.indexOf('Reduction') !== -1 ||
                        pass.stat.indexOf('Resistance') !== -1 ||
                        pass.stat.indexOf('Damage') !== -1;
      
      if (pass.stat === 'AttackDamage' && pass.value === '+1') {
        addStatValue(rawStats, 'AttackDamage', totalVal, 'FLAT');
      } else {
        const modType = isPercent ? 'ADDITIVE' : 'FLAT';
        addStatValue(rawStats, pass.stat, totalVal, modType);
      }
    }
  });

  // 3. Process rune tree levels
  // RuneSaveData: [{ RuneKey, Level }]. Each RuneKey maps to a node in rune_tree.nodes.
  // Each node has levels[] with per-level stat/value entries.
  const runeNodes = (wiki_db['/data/rune_tree.json'] || {}).nodes || [];
  const runeSaveData = saveState.runes || [];

  runeSaveData.forEach(runeEntry => {
    const node = runeNodes.find(n => n.key === runeEntry.RuneKey);
    if (!node || !node.levels || runeEntry.Level <= 0) return;

    // Sum the stat value for all invested levels
    // Each level entry gives a fixed value per level tick
    let totalValue = 0;
    for (let lvl = 1; lvl <= runeEntry.Level && lvl <= node.levels.length; lvl++) {
      const levelData = node.levels.find(l => l.level === lvl) || node.levels[lvl - 1];
      if (levelData) totalValue += levelData.value;
    }

    if (totalValue === 0) return;

    const stat = node.stat;
    // Determine mod type: percent stats are ADDITIVE, flat stats are FLAT
    const isPercent = stat.endsWith('Percent') ||
                      stat.includes('Speed') ||
                      stat.includes('Chance') ||
                      stat.includes('Leech') ||
                      stat.includes('Reduction');
    const modType = isPercent ? 'ADDITIVE' : 'FLAT';

    addStatValue(rawStats, stat, totalValue, modType);
  });
  
  // 3. Final calculations combining flat and additive
  const finalStats = {};
  
  // Physical/Elemental damage % uses FLAT modtype in wiki_db.
  // We accumulate both flat+additive and divide by 10 (stored as val*10 = e.g. 500 = 50%)
  const physPct = (rawStats.PhysicalDamagePercent.flat + rawStats.PhysicalDamagePercent.additive) / 10;
  const firePct  = (rawStats.FireDamagePercent.flat  + rawStats.FireDamagePercent.additive)  / 10;
  const coldPct  = (rawStats.ColdDamagePercent.flat  + rawStats.ColdDamagePercent.additive)  / 10;
  const lightPct = (rawStats.LightningDamagePercent.flat + rawStats.LightningDamagePercent.additive) / 10;
  const chaosPct = (rawStats.ChaosDamagePercent.flat + rawStats.ChaosDamagePercent.additive) / 10;
  // Total elemental/physical bonus already folded into AttackDamage.additive by addStatValue.
  // But we expose them individually for the stats panel.
  finalStats.PhysicalDamagePercent   = physPct;
  finalStats.FireDamagePercent       = firePct;
  finalStats.ColdDamagePercent       = coldPct;
  finalStats.LightningDamagePercent  = lightPct;
  finalStats.ChaosDamagePercent      = chaosPct;

  // Flat attack damage scales by total additive % bonus
  // additive is stored multiplied by 10: +1000 = +100%, divisor = 1000
  finalStats.AttackDamage = rawStats.AttackDamage.flat * (1 + rawStats.AttackDamage.additive / 1000);
  
  // AttackSpeed: base stored as 100 (= 100%). Additive gems add e.g. +200 = +20%.
  // Final display: total % including base
  finalStats.AttackSpeed = rawStats.AttackSpeed.flat + rawStats.AttackSpeed.additive / 10;
  
  // Basic Attack DPS = AttackDamage * (AttackSpeed / divisor)
  // Bow has a base animation speed divisor of 130 instead of 100
  const divisor = (heroInfo && heroInfo.MainWeaponGearType === 'BOW') ? 130 : 100;
  finalStats.BasicAttackDPS = finalStats.AttackDamage * (finalStats.AttackSpeed / divisor);

  finalStats.CastSpeed = rawStats.CastSpeed.flat + rawStats.CastSpeed.additive / 10;
  
  finalStats.CriticalChance = (rawStats.CriticalChance.flat + rawStats.CriticalChance.additive) / 10;
  finalStats.CriticalDamage = (rawStats.CriticalDamage.flat + rawStats.CriticalDamage.additive) / 10;
  
  finalStats.MaxHp = rawStats.MaxHp.flat * (1 + rawStats.MaxHp.additive / 1000);
  finalStats.Armor = rawStats.Armor.flat * (1 + rawStats.Armor.additive / 1000);
  
  finalStats.CooldownReduction = (rawStats.CooldownReduction.flat + rawStats.CooldownReduction.additive) / 10;
  finalStats.MovementSpeed = rawStats.MovementSpeed.flat * (1 + rawStats.MovementSpeed.additive / 1000);
  
  finalStats.HpLeech = (rawStats.HpLeech.flat + rawStats.HpLeech.additive) / 10;
  finalStats.IncreaseProjectileDamage = (rawStats.IncreaseProjectileDamage.flat + rawStats.IncreaseProjectileDamage.additive) / 10;
  finalStats.IncreaseAreaOfEffectDamage = (rawStats.IncreaseAreaOfEffectDamage.flat + rawStats.IncreaseAreaOfEffectDamage.additive) / 10;

  finalStats.HpRegenPerSec = (rawStats.HpRegenPerSec.flat + rawStats.HpRegenPerSec.additive) / 10;
  finalStats.AddHpPerHit = rawStats.AddHpPerHit.flat + rawStats.AddHpPerHit.additive;
  finalStats.AddHpPerKill = rawStats.AddHpPerKill.flat + rawStats.AddHpPerKill.additive;

  finalStats.DodgeChance = (rawStats.DodgeChance.flat + rawStats.DodgeChance.additive) / 10;
  finalStats.ElementalDodgeChance = (rawStats.ElementalDodgeChance.flat + rawStats.ElementalDodgeChance.additive) / 10;
  finalStats.BlockChance = (rawStats.BlockChance.flat + rawStats.BlockChance.additive) / 10;
  finalStats.ElementalBlockChance = (rawStats.ElementalBlockChance.flat + rawStats.ElementalBlockChance.additive) / 10;

  finalStats.FireResistance = rawStats.FireResistance.flat + rawStats.FireResistance.additive;
  finalStats.ColdResistance = rawStats.ColdResistance.flat + rawStats.ColdResistance.additive;
  finalStats.LightningResistance = rawStats.LightningResistance.flat + rawStats.LightningResistance.additive;
  finalStats.ChaosResistance = rawStats.ChaosResistance.flat + rawStats.ChaosResistance.additive;

  finalStats.DamageReduction = (rawStats.DamageReduction.flat + rawStats.DamageReduction.additive) / 10;
  finalStats.AdditionalGold = (rawStats.AdditionalGold.flat + rawStats.AdditionalGold.additive) / 10;
  finalStats.AdditionalExp = (rawStats.AdditionalExp.flat + rawStats.AdditionalExp.additive) / 10;

  return finalStats;
}

function addStatValue(rawStats, type, val, modType) {
  // Prevent NaN pollution by strictly parsing integer values
  const numVal = parseInt(val);
  if (isNaN(numVal)) return;

  // Translate some wiki stat types if they have separate naming in rawStats
  let targetType = type;
  if (type === 'AllHeroAttackDamage' || type === 'AllHeroAttackDamagePercent') targetType = 'AttackDamage';
  if (type === 'AllHeroArmor' || type === 'AllHeroArmorPercent') targetType = 'Armor';
  if (type === 'AllHeroMoveSpeed') targetType = 'MovementSpeed';
  if (type === 'AllHeroAttackSpeed') targetType = 'AttackSpeed';
  if (type === 'IncreaseGoldAmount') targetType = 'AdditionalGold';
  if (type === 'IncreaseExpAmount') targetType = 'AdditionalExp';
  if (type === 'HealthRegen') targetType = 'HpRegenPerSec';
  
  // Elemental/physical damage % — accumulate into their own bucket AND into AttackDamage.additive
  // The wiki uses MODTYPE=FLAT for these, but they are percentage bonuses (value 500 = +50%)
  // We keep them in their specific bucket for the stats panel, and also add them to AttackDamage.additive
  if (type === 'PhysicalDamagePercent' || 
      type === 'FireDamagePercent' || 
      type === 'ColdDamagePercent' || 
      type === 'LightningDamagePercent' || 
      type === 'ChaosDamagePercent') {
    if (rawStats[type]) {
      // Always accumulate into .flat bucket since MODTYPE is FLAT in wiki
      rawStats[type].flat += numVal;
    }
    // Also apply to AttackDamage as an additive % bonus
    targetType = 'AttackDamage';
    modType = 'ADDITIVE';
  }

  if (type === 'IncreaseProjectileDamage') {
    if (rawStats[type]) {
      rawStats[type].additive += numVal;
    }
    targetType = 'AttackDamage';
    modType = 'ADDITIVE';
  }

  // Handle AllElementalResistance redirection
  if (type === 'AllElementalResistance') {
    ['FireResistance', 'ColdResistance', 'LightningResistance', 'ChaosResistance'].forEach(resType => {
      if (rawStats[resType]) {
        rawStats[resType].flat += numVal;
      }
    });
    return;
  }
  
  if (!rawStats[targetType]) return; // ignore unmapped stats
  
  const mod = (modType || '').toUpperCase();
  if (mod === 'ADDITIVE') {
    rawStats[targetType].additive += numVal;
  } else {
    rawStats[targetType].flat += numVal;
  }
}

// Show rich tooltip on gear hover
function showGearTooltip(index, event) {
  const tooltip = document.getElementById('item-tooltip');
  if (!tooltip || !simulatedSave) return;
  
  const uid = simulatedSave.ranger.equippedItemIds[index];
  if (uid === 0 || uid === '0' || !uid) {
    tooltip.style.display = 'none';
    return;
  }
  
  const item = simulatedSave.equipped_items.find(it => String(it.UniqueId) === String(uid));
  if (!item) return;
  
  const wItem = wiki_items[item.ItemKey];
  const wDetail = wiki_items_detail[item.ItemKey];
  const langKey = activeLanguage === 'pt' ? 'pt-BR' : 'en-US';
  
  const name = wItem ? (wItem.name[langKey] || wItem.name['en-US']) : `Unknown Item (${item.ItemKey})`;
  const grade = wItem ? wItem.grade : 'COMMON';
  const icon = wItem ? wItem.icon : '';
  const gradeLabel = TRANSLATIONS[activeLanguage][`grade_${grade.toLowerCase()}`] || grade;
  const gearTypeLabel = TRANSLATIONS[activeLanguage][`slot_${index}`] || (wItem ? wItem.gear : '');
  
  // 1. Build Header HTML
  let html = `
    <div class="tooltip-header">
      <div class="tooltip-icon-box">
        ${icon ? `<img class="tooltip-icon" src="${getImageUrl(icon)}" alt="" />` : ''}
      </div>
      <div class="tooltip-title-box">
        <h4 class="tooltip-name" style="color: var(--rarity-${grade.toLowerCase()});">${name}</h4>
        <div class="tooltip-meta">
          <span style="color: var(--rarity-${grade.toLowerCase()});">${gradeLabel}</span>
          <span>•</span>
          <span>Lvl ${wItem ? wItem.level : 1}</span>
          <span>•</span>
          <span>${gearTypeLabel}</span>
        </div>
      </div>
    </div>
  `;
  
  // 2. Build Attributes Section HTML
  let statsHtml = '';
  if (wDetail && wDetail.stats) {
    const statsObj = wDetail.stats;
    const gearType = wItem.gear;
    const gearTypeInfo = (wiki_db['/data/gear_types.json'] || []).find(gt => gt.GearType === gearType);
    
    // Base Stats
    if (gearTypeInfo) {
      if (statsObj.BaseStat1_Value) {
        const statLabel = formatStatName(gearTypeInfo.BaseStat1_STATTYPE);
        const formatVal = formatStatValue(gearTypeInfo.BaseStat1_STATTYPE, statsObj.BaseStat1_Value, gearTypeInfo.BaseStat1_MODTYPE);
        statsHtml += `<li><span class="stat-label">Base ${statLabel}</span> <span class="stat-value">${formatVal}</span></li>`;
      }
      if (statsObj.BaseStat2_Value) {
        const statLabel = formatStatName(gearTypeInfo.BaseStat2_STATTYPE);
        const formatVal = formatStatValue(gearTypeInfo.BaseStat2_STATTYPE, statsObj.BaseStat2_Value, gearTypeInfo.BaseStat2_MODTYPE);
        statsHtml += `<li><span class="stat-label">Base ${statLabel}</span> <span class="stat-value">${formatVal}</span></li>`;
      }
    }
    
    // Inherent Stats
    for (let i = 1; i <= 3; i++) {
      const type = statsObj[`InherentStat${i}_STATTYPE`];
      const val = statsObj[`InherentStat${i}_Value`];
      const mod = statsObj[`InherentStat${i}_MODTYPE`];
      
      if (type && type !== 'NONE' && val) {
        const statLabel = formatStatName(type);
        const formatVal = formatStatValue(type, val, mod);
        statsHtml += `<li><span class="stat-label">${statLabel}</span> <span class="stat-value">${formatVal}</span></li>`;
      }
    }
  }
  
  if (statsHtml) {
    const labelAttrs = activeLanguage === 'pt' ? 'Atributos do Item' : 'Item Attributes';
    html += `
      <div class="tooltip-section">
        <div class="tooltip-section-title">${labelAttrs}</div>
        <ul class="tooltip-stats-list">
          ${statsHtml}
        </ul>
      </div>
    `;
  }
  
  // 3. Build Sockets Section HTML
  const socketsMapping = getSocketMapping(grade);
  if (socketsMapping.length > 0) {
    const labelSockets = activeLanguage === 'pt' ? 'Configuração de Soquetes' : 'Sockets Configuration';
    let socketsHtml = '';
    
    socketsMapping.forEach((sock) => {
      const enchant = item.EnchantData[sock.index] || { StatModKey: 0, MaterialKey: 0, Value: 0 };
      const hasGem = enchant.MaterialKey !== 0;
      
      const baseLabel = TRANSLATIONS[activeLanguage][sock.type.toLowerCase()] || sock.type;
      const subIdx = sock.type === 'DECORATION' ? (sock.index + 1) : 
                      sock.type === 'ENGRAVING' ? (sock.index - 2 + 1) : // Fixed index offset label helpers
                      (sock.index - 4 + 1);
      const socketLabel = `${baseLabel} #${subIdx}`;
      
      if (hasGem) {
        const gItem = wiki_items[enchant.MaterialKey];
        const gemName = gItem ? (gItem.name[langKey] || gItem.name['en-US']) : `Material Key ${enchant.MaterialKey}`;
        const gemIcon = gItem ? getImageUrl(gItem.icon) : '';
        
        let rollValText = '';
        if (enchant.StatModKey !== 0) {
          const modDef = wiki_stat_mods.find(m => m.StatModKey === enchant.StatModKey && m.Tier === enchant.Tier);
          if (modDef) {
            rollValText = formatStatValue(modDef.STATTYPE, enchant.Value, modDef.MODTYPE);
          }
        }
        
        socketsHtml += `
          <div class="tooltip-socket-item">
            <span class="tooltip-socket-badge ${sock.type.toLowerCase()}">${socketLabel}</span>
            ${gemIcon ? `<img class="tooltip-socket-gem-icon" src="${gemIcon}" alt="" />` : '⚪'}
            <span class="tooltip-socket-gem-name">${gemName}</span>
            <span class="tooltip-socket-roll">${rollValText}</span>
          </div>
        `;
      } else {
        const emptyLabel = activeLanguage === 'pt' ? 'Vazio' : 'Empty';
        socketsHtml += `
          <div class="tooltip-socket-item">
            <span class="tooltip-socket-badge ${sock.type.toLowerCase()}">${socketLabel}</span>
            <span class="tooltip-socket-empty">⚪ ${emptyLabel}</span>
          </div>
        `;
      }
    });
    
    html += `
      <div class="tooltip-section">
        <div class="tooltip-section-title">${labelSockets}</div>
        <div class="tooltip-sockets-list">
          ${socketsHtml}
        </div>
      </div>
    `;
  }
  
  // Update and position tooltip
  tooltip.className = `item-tooltip ${grade.toLowerCase()}`;
  tooltip.innerHTML = html;
  tooltip.style.display = 'flex';
  
  moveGearTooltip(event);
}

// Move tooltip dynamically with mouse cursor, checking bounds
function moveGearTooltip(e) {
  const tooltip = document.getElementById('item-tooltip');
  if (!tooltip || tooltip.style.display === 'none') return;
  
  const x = e.clientX + 15;
  const y = e.clientY + 15;
  const tooltipWidth = tooltip.offsetWidth;
  const tooltipHeight = tooltip.offsetHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  let left = x;
  let top = y;
  
  if (x + tooltipWidth > viewportWidth) {
    left = e.clientX - tooltipWidth - 15;
  }
  if (y + tooltipHeight > viewportHeight) {
    top = e.clientY - tooltipHeight - 15;
  }
  
  tooltip.style.left = (left + window.scrollX) + 'px';
  tooltip.style.top = (top + window.scrollY) + 'px';
}

// Hide tooltip
function hideGearTooltip() {
  const tooltip = document.getElementById('item-tooltip');
  if (tooltip) {
    tooltip.style.display = 'none';
  }
}
