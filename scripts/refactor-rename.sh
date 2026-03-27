#!/usr/bin/env bash
# =============================================================================
# QORIA -> QORWAY OS / KYRA -> ATLAS / ASCENDIA -> ASCEND
# Refactoring Script - QORIA Technology
# =============================================================================
#
# MAPPING:
#   QORIA OS       -> Qorway OS
#   QORIA          -> Qorway
#   Qoria          -> Qorway
#   qoria          -> qorway
#   QORIA_ERR_     -> QORWAY_ERR_
#   qoria-os       -> qorway-os
#   qoria_os       -> qorway_os
#   qoria_user     -> qorway_user
#   qoria_superadmin -> qorway_superadmin
#
#   KYRA            -> ATLAS
#   Kyra            -> Atlas
#   kyra            -> atlas
#   KyraService     -> AtlasService
#   KyraModule      -> AtlasModule
#   KyraController  -> AtlasController
#   KYRA_CACHE_TTL  -> ATLAS_CACHE_TTL
#   KYRA_LLM_*      -> ATLAS_LLM_*
#
#   Ascendia        -> Ascend
#   ascendia        -> ascend
#   AscendiaService -> AscendService
#   AscendiaModule  -> AscendModule
#   ASCENDIA        -> ASCEND
#
# PHASE 1: Rename directories
# PHASE 2: Rename files
# PHASE 3: Update file contents (sed replacements)
# =============================================================================

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "=== Phase 1: Rename directories ==="

# Backend modules
mv src/modules/kyra src/modules/atlas 2>/dev/null || true
mv src/modules/ascendia src/modules/ascend 2>/dev/null || true

# Frontend components
mv frontend/components/ascendia frontend/components/ascend 2>/dev/null || true

# Frontend types
mv frontend/types/kyra.types.ts frontend/types/atlas.types.ts 2>/dev/null || true

echo "=== Phase 2: Rename files ==="

# Backend: kyra -> atlas
for f in src/modules/atlas/kyra.*; do
  [ -f "$f" ] && mv "$f" "${f//kyra/atlas}"
done

# Backend: ascendia -> ascend
for f in src/modules/ascend/ascendia.*; do
  [ -f "$f" ] && mv "$f" "${f//ascendia/ascend}"
done

# Config
mv src/config/kyra.config.ts src/config/atlas.config.ts 2>/dev/null || true

# Exception filter
mv src/common/filters/qoria-exception.filter.ts \
   src/common/filters/qorway-exception.filter.ts 2>/dev/null || true
mv src/common/filters/qoria-exception.filter.spec.ts \
   src/common/filters/qorway-exception.filter.spec.ts 2>/dev/null || true

# Error interface
mv src/common/interfaces/qoria-error.interface.ts \
   src/common/interfaces/qorway-error.interface.ts 2>/dev/null || true

echo "=== Phase 3: Update file contents ==="

# Order matters: longest/most-specific patterns first to avoid partial matches

find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.json" \
  -o -name "*.yml" -o -name "*.yaml" -o -name "*.sql" -o -name "*.prisma" \
  -o -name "*.md" -o -name "*.env*" -o -name "Dockerfile" \
  -o -name "docker-compose.yml" -o -name ".eslintrc.js" \) \
  ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/dist/*" \
  -print0 | while IFS= read -r -d '' file; do

  # --- QORIA -> QORWAY ---
  sed -i \
    -e 's/QORIA_ERR_/QORWAY_ERR_/g' \
    -e 's/QoriaExceptionFilter/QorwayExceptionFilter/g' \
    -e 's/QoriaErrorResponse/QorwayErrorResponse/g' \
    -e 's/qoria-os-backend/qorway-os-backend/g' \
    -e 's/qoria-os-gateway/qorway-os-gateway/g' \
    -e 's/qoria_os_test/qorway_os_test/g' \
    -e 's/qoria_os/qorway_os/g' \
    -e 's/qoria_user/qorway_user/g' \
    -e 's/qoria_dev_password/qorway_dev_password/g' \
    -e 's/qoria_superadmin/qorway_superadmin/g' \
    -e 's/qoria-exception/qorway-exception/g' \
    -e 's/qoria-error/qorway-error/g' \
    -e 's/QORIA OS/Qorway OS/g' \
    -e 's/QORIA Technology/Qorway Technology/g' \
    -e 's/QORIA/Qorway/g' \
    -e 's/Qoria/Qorway/g' \
    -e 's/qoria/qorway/g' \
    "$file"

  # --- KYRA -> ATLAS ---
  sed -i \
    -e 's/KyraService/AtlasService/g' \
    -e 's/KyraModule/AtlasModule/g' \
    -e 's/KyraController/AtlasController/g' \
    -e 's/kyraService/atlasService/g' \
    -e 's/kyraConfig/atlasConfig/g' \
    -e "s|'kyra'|'atlas'|g" \
    -e "s|kyra/|atlas/|g" \
    -e 's/kyra\./atlas\./g' \
    -e 's/kyra\.types/atlas\.types/g' \
    -e 's/KYRA_CACHE_TTL/ATLAS_CACHE_TTL/g' \
    -e 's/KYRA_LLM_ENDPOINT/ATLAS_LLM_ENDPOINT/g' \
    -e 's/KYRA_LLM_API_KEY/ATLAS_LLM_API_KEY/g' \
    -e 's/KYRA Cognitive Engine/ATLAS Cognitive Engine/g' \
    -e 's/KYRA Tri-Brain/ATLAS Tri-Brain/g' \
    -e 's/KYRA Multi-Client/ATLAS Multi-Client/g' \
    -e 's/moteur KYRA/moteur ATLAS/g' \
    -e 's/KYRA/ATLAS/g' \
    -e 's/Kyra/Atlas/g' \
    -e 's/kyra/atlas/g' \
    "$file"

  # --- ASCENDIA -> ASCEND ---
  sed -i \
    -e 's/AscendiaService/AscendService/g' \
    -e 's/AscendiaModule/AscendModule/g' \
    -e 's/AscendiaController/AscendController/g' \
    -e 's/ascendiaService/ascendService/g' \
    -e "s|ascendia/|ascend/|g" \
    -e 's/ascendia\./ascend\./g' \
    -e 's/Ascendia Score/Ascend Score/g' \
    -e 's/calculateAscendiaScore/calculateAscendScore/g' \
    -e 's/Ascendia/Ascend/g' \
    -e 's/ascendia/ascend/g' \
    -e 's/ASCENDIA/ASCEND/g' \
    "$file"

done

echo "=== Phase 4: Update package-lock.json name ==="
sed -i 's/"qorway-os-backend"/"qorway-os-backend"/g' package-lock.json

echo "=== Refactoring complete ==="
echo "Run: npx prisma generate && npx tsc --noEmit && npx jest"
